---
layout: post
title: Running an optimized MariaDB (MySQL) cluster on Azure
date: 2014-11-25T19:09:43.000Z
tags:
  - linux
  - mysql
  - virtual machines
  - high availability
  - mariadb
  - galera
  - centos
---

<!--kg-card-begin: markdown--><h1 id="introduction">Introduction</h1>
<p>In this post, I'm going to create a multi-Master <a href="http://galeracluster.com/products/">Galera</a> cluster of <a href="https://mariadb.org/en/about/">MariaDBs</a>, a robust, scalable, and reliable drop-in replacement for MySQL, to work in a highly available environment on Azure Virtual Machines.</p>
<h2 id="architectureoverview">Architecture overview</h2>
<p>Below is what we are ulitmatley want to achieve. Key points being:</p>
<ol>
<li>3 node cluster to ensure we don't have split brain</li>
<li>Separate Data Disks from the OS Disk</li>
<li>Create the Data Disks in RAID-0/striped setting to increase IOPS</li>
<li>The 3 nodes are load balanced using the Azure Load Balancer</li>
<li>I want to minimize repetetive work, so I'll create a VM image containing MariaDB+Galera and use it to create the other cluster VMs.</li>
</ol>
<p><img src="__GHOST_URL__/content/images/2014/11/Setup-1.png" alt="Architecture" loading="lazy"></p>
<h2 id="letsgo">Let's go</h2>
<p>I'm going to do things a bit differently this time. Instead of working with the Azure Portal GUI, I'm going to try and do as much of the repetitive work as possible using the <a href="http://azure.microsoft.com/en-us/documentation/articles/xplat-cli/">Azure CLI</a> tools, so make sure to download them and follow the connecting them to your Azure subscription instructions.</p>
<p>If you need a reference to the commands available in the Azure CLI, check out this link for the <a href="http://azure.microsoft.com/en-us/documentation/articles/command-line-tools/">Azure CLI command reference</a>. You will also need to <a href="http://www.jeff.wilcox.name/2013/06/secure-linux-vms-with-ssh-certificates/">create an SSH key for authentication</a> and make note of the <strong>.pem file location</strong>.</p>
<h3 id="createthetemplate">Create the template</h3>
<ol>
<li>
<p>Create an Affinity Group to hold our resources together</p>
<pre><code> azure account affinity-group create mariadbcluster --location &quot;North Europe&quot; --label &quot;MariaDB Cluster&quot;
</code></pre>
</li>
<li>
<p>Create a Virtual Network</p>
<pre><code> azure network vnet create --address-space 10.0.0.0 --cidr 8 --subnet-name mariadb --subnet-start-ip 10.0.0.0 --subnet-cidr 24 --affinity-group mariadbcluster mariadbvnet
</code></pre>
</li>
<li>
<p>Create a Storage Account to host all our disks. Note that according to the documentation, you shouldn't be placing more than 40 heavily used disks on the same Storage Account to avoid hitting the 20,000 IOPS Storage Account limit. In our case, we're far off from this number so I'll opt for storing everyhing on the same account for simplicity</p>
<pre><code> azure storage account create mariadbstorage --label mariadbstorage --affinity-group mariadbcluster
</code></pre>
</li>
<li>
<p>Find the name of the CentOS 7 Virtual Machine image</p>
<pre><code> azure vm image list | findstr CentOS        
</code></pre>
</li>
</ol>
<p>this will output something like <code>5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-70-20140926</code>. Use the name in the following step.</p>
<ol start="4">
<li>
<p>Create the VM template replacing <strong>/path/to/key.pem</strong> with the path where you stored the generated .pem SSH key</p>
<pre><code> azure vm create --virtual-network-name mariadbvnet --subnet-names mariadb --blob-url &quot;http://mariadbstorage.blob.core.windows.net/vhds/mariadbhatemplate-os.vhd&quot;  --vm-size Medium --ssh 22 --ssh-cert &quot;/path/to/key.pem&quot; --no-ssh-password mariadbtemplate 5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-70-20140926 azureuser
</code></pre>
</li>
<li>
<p>Attach 4 x 500GB data disks to the VM for use in the RAID configuration</p>
<pre><code> FOR /L %d IN (1,1,4) DO azure vm disk attach-new mariadbhatemplate 512 http://mariadbstorage.blob.core.windows.net/vhds/mariadbhatemplate-data-%d.vhd
</code></pre>
</li>
<li>
<p>SSH into the template VM that you created at <strong>mariadbhatemplate.cloudapp.net:22</strong> and connect using your private key.</p>
</li>
<li>
<p>Install required software by changing to root <code>sudo su</code> then</p>
<ul>
<li>
<p>Install RAID support:</p>
<ul>
<li>
<p>Install mdadm</p>
<pre><code>  yum install mdadm
</code></pre>
</li>
<li>
<p>Create the RAID0/stripe configuration with an EXT4 file system</p>
<pre><code>  mdadm --create --verbose /dev/md0 --level=stripe --raid-devices=4 /dev/sdc /dev/sdd /dev/sde /dev/sdf
  mdadm --detail --scan &gt;&gt; /etc/mdadm.conf
  mkfs -t ext4 /dev/md0
</code></pre>
</li>
<li>
<p>Create the mount point directory</p>
<pre><code>  mkdir /mnt/data
</code></pre>
</li>
<li>
<p>Retrieve the UUID of the newly created RAID device</p>
<pre><code>  blkid | grep /dev/md0
</code></pre>
</li>
<li>
<p>Edit /etc/fstab</p>
<pre><code>  vi /etc/fstab
</code></pre>
</li>
<li>
<p>Add the device in there to enable auto mouting on reboot replacing the UUID with the value obtained from the <strong>blkid</strong> command before</p>
<pre><code>  UUID=&lt;UUID FROM PREVIOUS&gt;   /mnt/data ext4   defaults,noatime   1 2
</code></pre>
</li>
<li>
<p>Mount the new partition</p>
<pre><code>  mount /mnt/data
</code></pre>
</li>
</ul>
</li>
<li>
<p>Add MariaDB repos by:</p>
<ul>
<li>
<p>Creating the MariaDB.repo file:</p>
<pre><code>	vi /etc/yum.repos.d/MariaDB.repo
</code></pre>
</li>
<li>
<p>Filling it with the below content</p>
<pre><code>  [mariadb]
  name = MariaDB
  baseurl = http://yum.mariadb.org/10.0/centos7-amd64
  gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
  gpgcheck=1
</code></pre>
</li>
</ul>
</li>
<li>
<p>Remove existing postfix and mariadb-libs to avoid conflicts</p>
<pre><code>  yum remove postfix mariadb-libs-*
</code></pre>
</li>
<li>
<p>Install MariaDB with Galera</p>
<pre><code>  yum install MariaDB-Galera-server MariaDB-client galera
</code></pre>
</li>
<li>
<p>Set permissions accordingly</p>
<pre><code>  chown -R mysql:mysql /mnt/data  &amp;&amp; chmod -R 755 /mnt/data/  
</code></pre>
</li>
<li>
<p>Copy the current MySQL directory into its new location and remove the old directory</p>
<pre><code>  cp -avr /var/lib/mysql /mnt/data  
  rm -rf /var/lib/mysql
</code></pre>
</li>
<li>
<p>Create a symlink pointing the old directory to the new location on the RAID partition</p>
<pre><code>  ln -s /mnt/data/mysql /var/lib/mysql
</code></pre>
</li>
<li>
<p><a href="http://galeracluster.com/documentation-webpages/configuration.html#selinux">SELinux will interfere with the cluster operations</a>, so until it is made compatible, it is necessary to disable it for the current session theb edit <code>/etc/selinux/config</code> to disable it for subsequent restarts</p>
<pre><code>  setenforce 0
</code></pre>
<p>then editing <code>/etc/selinux/config</code> to set <code>SELINUX=permissive</code></p>
</li>
<li>
<p>Start MySQL</p>
<pre><code>  service mysql start
</code></pre>
</li>
<li>
<p>Secure the MySQL installation, set the root password, remove anonymous users, disabling remote root login and removing the test database</p>
<pre><code>  mysql_secure_installation
</code></pre>
</li>
<li>
<p>Create a user on the database for cluster operations and optionally, your applications</p>
<pre><code>   mysql -u root -p
   GRANT ALL PRIVILEGES ON *.* TO 'cluster'@'%' IDENTIFIED BY 'p@ssw0rd' WITH GRANT OPTION; FLUSH PRIVILEGES;
   exit
</code></pre>
</li>
<li>
<p>Stop MySQL</p>
<pre><code>   service mysql stop
</code></pre>
</li>
<li>
<p>Edit the MySQL configuration to create a placeholder for the cluster settings. Do not replace the <strong><code>&lt;Vairables&gt;</code></strong> or uncomment now. We'll do it once we create a VM from this template.</p>
<pre><code>   vi /etc/my.cnf.d/server.cnf
</code></pre>
</li>
<li>
<p>Edit the <strong>[galera]</strong> section and clear it out</p>
</li>
<li>
<p>Edit the <strong>[mariadb]</strong> section</p>
<pre><code>   wsrep_provider=/usr/lib64/galera/libgalera_smm.so 
   binlog_format=ROW
   wsrep_sst_method=rsync
   bind-address=0.0.0.0 # When set to 0.0.0.0, the server listens to remote connections
   default_storage_engine=InnoDB
   innodb_autoinc_lock_mode=2
   wsrep_sst_auth=cluster:p@ssw0rd # CHANGE: Set the username and password you created for the SST cluster MySQL user
   #wsrep_cluster_name='mariadbcluster' # CHANGE: Uncomment and set your desired cluster name
   #wsrep_cluster_address=&quot;gcomm://mariadb1,mariadb2,mariadb3&quot; # CHANGE: Uncomment and Add all your servers
   #wsrep_node_address='&lt;ServerIP&gt;' # CHANGE: Uncomment and set IP address of this server
   #wsrep_node_name='&lt;NodeName&gt;' # CHANGE: Uncomment and set the node name of this server
</code></pre>
</li>
</ul>
</li>
<li>
<p>Open required ports on the firewall (using FirewallD on CentOS 7)</p>
<ul>
<li>MySQL: <code>firewall-cmd --zone=public --add-port=3306/tcp --permanent</code></li>
<li>GALERA: <code>firewall-cmd --zone=public --add-port=4567/tcp --permanent</code></li>
<li>GALERA IST: <code>firewall-cmd --zone=public --add-port=4568/tcp --permanent</code></li>
<li>RSYNC: <code>firewall-cmd --zone=public --add-port=4444/tcp --permanent</code></li>
</ul>
<p>Reload the firewall: <code>firewall-cmd --reload</code></p>
</li>
<li>
<p>Optimize the system for performance</p>
<ul>
<li>
<p>Increase the maximum number of system handles for high concurrency by adding editing <strong>/etc/security/limits.conf</strong> file</p>
<pre><code>  vi /etc/security/limits.conf
</code></pre>
</li>
<li>
<p>And adding the following four lines to increase the maximum allowed concurrent handles. Note that 65536 is the maximum number that the system can support</p>
<pre><code>  * soft nofile 65536
  * hard nofile 65536
  * soft nproc 65536
  * hard nproc 65536
</code></pre>
</li>
<li>
<p>Updating the system for the new limits</p>
<pre><code>  ulimit -SHn 65536
  ulimit -SHu 65536
</code></pre>
</li>
<li>
<p>Ensure that the limits are updated at boot time</p>
<pre><code>  echo &quot;ulimit -SHn 65536&quot; &gt;&gt;/etc/rc.local
  echo &quot;ulimit -SHu 65536&quot; &gt;&gt;/etc/rc.local
  chmod +x /etc/rc.d/rc.local
</code></pre>
</li>
<li>
<p>You can use the same <a href="http://azure.microsoft.com/sv-se/documentation/articles/virtual-machines-linux-optimize-mysql-perf/">performance tuning strategy</a> to configure MySQL on Azure as on an on-premises machine. The main I/O optimization rules are increasing the cache size and reducing the I/O response time. Optimize MySQL settings by editing the configuration</p>
<pre><code>   vi /etc/my.cnf.d/server.cnf
</code></pre>
</li>
<li>
<p>Edit the <strong>[mariadb]</strong> section and append the below. Take note of the <strong>innodb_buffer_pool_size</strong> to be 70% of your VM's memory. I've set it at 2.45GB for the Medium Azure VM with 3.5GB of RAM.</p>
<pre><code>   innodb_buffer_pool_size = 2508M # The buffer pool contains buffered data and the index. This is usually set to 70% of physical memory.
   innodb_log_file_size = 512M #  Redo logs ensure that write operations are fast, reliable, and recoverable after a crash
   max_connections = 5000 # A larger value will give the server more time to recycle idled connections
   innodb_file_per_table = 1 # Speed up the table space transmission and optimize the debris management performance
   innodb_log_buffer_size = 128M # The log buffer allows transactions to run without having to flush the log to disk before the transactions commit
   innodb_flush_log_at_trx_commit = 2 # The setting of 2 enables the most data integrity and is suitable for Master in MySQL cluster
   query_cache_size = 0
</code></pre>
</li>
</ul>
</li>
<li>
<p>Stop MySQL and Deprovision the machine and disable MySQL service from running on startup to avoid messing up the cluster when adding a new node</p>
<pre><code> service mysql stop
 chkconfig mysql off
 waagent -deprovision
</code></pre>
</li>
<li>
<p>Capture the VM. Now for this specific step, I'll do it through the portal because there is an <a href="https://github.com/Azure/azure-xplat-cli/issues/1268">open issue in the Azure CLI</a> tools now that leads to images captured not capturing the attatched data disks.</p>
<ul>
<li>Shutdown the machine through the portal</li>
<li>Click on Capture and specify the image name as <strong>mariadb-galera-image</strong> and provide a  description and check &quot;I have run waagent&quot;.<br>
<img src="__GHOST_URL__/content/images/2014/11/Capture.png" alt="Capture the Virtual Machine" loading="lazy"><br>
<img src="__GHOST_URL__/content/images/2014/11/Capture2-1.PNG" alt="Capture the Virtual Machine" loading="lazy"></li>
</ul>
</li>
</ol>
<h3 id="createthecluster">Create the cluster</h3>
<p>Now that we've created the template with MariaDB installed and optimized, we'll create 3 VMs out of this template then configure and start the cluster.</p>
<ol>
<li>
<p>Create the first CentOS 7 VM from the <strong>mariadb-galera-image</strong> image, providing the virtual network name you created <strong>mariadbvnet</strong> and the subnet <strong>mariadb</strong>, machine size <strong>Medium</strong>, passing in the Cloud Service name to be <strong>mariadbha</strong> (or whatever name you want to be accessed through mariadbha.cloudapp.net), setting the name of this machine to be <strong>mariadb1</strong>  and the username to be <strong>azureuser</strong>,  and enabling SSH access and passing the SSH certificate .pem file and replacing <strong>/path/to/key.pem</strong> with the path where you stored the generated .pem SSH key.</p>
<p>I've split the command over multiple lines for clarity, but you should enter it as one line.</p>
<pre><code> azure vm create 
 --virtual-network-name mariadbvnet
 --subnet-names mariadb 
 --availability-set clusteravset
 --vm-size Medium 
 --ssh-cert &quot;/path/to/key.pem&quot; 
 --no-ssh-password 
 --ssh 22 
 --vm-name mariadb1 
 mariadbha mariadb-galera-image azureuser 
</code></pre>
</li>
<li>
<p>Create 2 more Virtual Machines by <em>connecting</em> them to the currently created <strong>mariadbha</strong> Cloud Service, changing the <strong>VM name</strong> as well as the <strong>SSH port</strong> to a unique port not conflicting with other VMs in the same Cloud Service.</p>
<pre><code> azure vm create		
 --virtual-network-name mariadbvnet
 --subnet-names mariadb 
 --availability-set clusteravset
 --vm-size Medium
 --ssh-cert &quot;/path/to/key.pem&quot;
 --no-ssh-password
 --ssh 23
 --vm-name mariadb2
 --connect mariadbha mariadb-galera-image azureuser
</code></pre>
</li>
</ol>
<p>and for MariaDB3</p>
<pre><code>	azure vm create
    --virtual-network-name mariadbvnet
    --subnet-names mariadb 
    --availability-set clusteravset
	--vm-size Medium
	--ssh-cert &quot;/path/to/key.pem&quot;
	--no-ssh-password
	--ssh 24
	--vm-name mariadb3
    --connect mariadbha mariadb-galera-image azureuser
</code></pre>
<ol start="3">
<li>
<p>You will need to get the internal IP address of each of the 3 VMs for the next step:</p>
<p><img src="__GHOST_URL__/content/images/2014/11/IP-1.png" alt="Getting IP address" loading="lazy"></p>
</li>
<li>
<p>SSH into the 3 VMs and and edit the configuration file on each</p>
<pre><code> sudo vi /etc/my.cnf.d/server.cnf
</code></pre>
<p>uncommenting <strong><code>wsrep_cluster_name</code></strong> and <strong><code>wsrep_cluster_address</code></strong> by removing the <strong>#</strong> at the beginning and validation they are indeed what you want.<br>
Additionally, replace <strong><code>&lt;ServerIP&gt;</code></strong> in <strong><code>wsrep_node_address</code></strong> and <strong><code>&lt;NodeName&gt;</code></strong> in <strong><code>wsrep_node_name</code></strong> with the VM's IP address and name respectively and uncomment those lines as well.</p>
</li>
<li>
<p>Start the cluster on MariaDB1 and let it run at startup</p>
<pre><code> sudo service mysql bootstrap
 chkconfig mysql on
</code></pre>
</li>
<li>
<p>Start MySQL on MariaDB2 and MariaDB3 and let it run at startup</p>
<pre><code> sudo service mysql start
 chkconfig mysql on
</code></pre>
</li>
</ol>
<h3 id="loadbalancethecluster">Loadbalance the cluster</h3>
<p>When we created the clustered VMs, we already added them into an Availablity Set called <strong>clusteravset</strong> to ensure they are put on different fault and update domains and that Azure never does maintenance on all machines at once. Doing so will also give us the SLA.</p>
<p>Now we need to load balance requests between our 3 nodes, and for that we will use the built-in Azure Loadbalancer.</p>
<p>Run the below commands on your machine using the Azure CLI. The command parameters mean<br>
<code>azure vm endpoint create-multiple &lt;MachineName&gt; &lt;PublicPort&gt;:&lt;VMPort&gt;:&lt;Protocol&gt;:&lt;EnableDirectServerReturn&gt;:&lt;Load Balanced Set Name&gt;:&lt;ProbeProtocol&gt;:&lt;ProbePort&gt;</code></p>
<pre><code>azure vm endpoint create-multiple mariadb1 3306:3306:tcp:false:MySQL:tcp:3306
azure vm endpoint create-multiple mariadb2 3306:3306:tcp:false:MySQL:tcp:3306
azure vm endpoint create-multiple mariadb3 3306:3306:tcp:false:MySQL:tcp:3306
</code></pre>
<p>Finally, since unfortunately the CLI sets the probe interval to 15 seconds which is a bit too long, we have to change it on the portal under Endpoints for any of the VMs<br>
<img src="__GHOST_URL__/content/images/2014/11/Endpoint.PNG" alt="Edit endpoint" loading="lazy"></p>
<p>then click on Reconfigure The Load-Balanced Set and go next</p>
<p><img src="__GHOST_URL__/content/images/2014/11/Endpoint2.PNG" alt="Reconfigure Load Balanced Set" loading="lazy"></p>
<p>then change the Probe Interval to 5 seconds and save</p>
<p><img src="__GHOST_URL__/content/images/2014/11/Endpoint3.PNG" alt="Change Probe Interval" loading="lazy"></p>
<h2 id="validatingthecluster">Validating the cluster</h2>
<p>We're done with the hardwork. Our cluster should be now accessible at <code>mariadbha.cloudapp.net:3306</code> which will hit the load balancer and route requests between out 3 VMs.</p>
<p>Use your favorite MySQL client to connect (I'll just connect from one of the VMs)</p>
<pre><code> mysql -u cluster -h mariadbha.cloudapp.net -p
</code></pre>
<p>Then create a new database and populate it with some data</p>
<pre><code>CREATE DATABASE TestDB;
USE TestDB;
CREATE TABLE TestTable (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, value VARCHAR(255));
INSERT INTO TestTable (value)  VALUES ('Value1');
INSERT INTO TestTable (value)  VALUES ('Value2');
SELECT * FROM TestTable;
</code></pre>
<p>Will result in the table below</p>
<pre><code>+----+--------+
| id | value  |
+----+--------+
|  1 | Value1 |
|  4 | Value2 |
+----+--------+
2 rows in set (0.00 sec)
</code></pre>
<h1 id="closing">Closing</h1>
<p>In this article, we've created a 3 node MySQL Galera highly available cluster on Azure Virtual Machines running CentOS 7. The machines are load balanced with the Azure Load Balancer.</p>
<p>In a future article, I will run benchmarks against the cluster and present the results.</p>
<!--kg-card-end: markdown-->
