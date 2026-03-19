---
layout: post
title: Highly Available and Scalable Master-Master MySQL on Azure Virtual Machines
date: 2014-09-29T13:43:09.000Z
tags:
  - mysql
  - virtual machines
  - high availability
---

<!--kg-card-begin: markdown--><h1 id="introduction">Introduction</h1>
<p>Achieving High Availability on your database level is essential in order to maintain your application availability. On Azure, you can provision a managed highly-available MySQL database cluster through a 3rd party <a href="https://www.cleardb.com/store/azure">ClearDB</a>.</p>
<p>In this post, I'm going to explore creating a highly available and scalable MySQL environment using Master-Master replication and the Azure Load Balancer.</p>
<h2 id="settingupmastermasterreplication">Setting up Master-Master replication</h2>
<p>MySQL replication is the process by which data stored in a MySQL database, is continuously copied to a second server, called &quot;Master-Slave&quot; replication. On the other hand, what we will be exploring here is &quot;Master-Master&quot; replication, where data is bi-directionally copied between two servers. This allows us to perform reads or writes from either server, ensuring high availability and scalability.</p>
<h3 id="step1settinguptheinfrastructure">Step 1 - Setting up the infrastructure</h3>
<p>Login to the new <a href="http://portal.azure.com">Azure Portal</a> and click on New, then choose Ubuntu 14.04 LTS to start.<br>
<img src="__GHOST_URL__/content/images/2014/Sep/2-1.PNG" alt="Creating the VM" loading="lazy"></p>
<p>Now fill in the data require. In my setup I've used <code>mysql1</code> as the hostname of this first machine, and I've customized the Cloud Service name to be <code>mysqlha</code>.</p>
<p>Additionally, you'll need to provide an SSH key for logging in to the machines with certificates, so here is how to <a href="http://www.jeff.wilcox.name/2013/06/secure-linux-vms-with-ssh-certificates/">generate an SSH key for Azure</a> if you haven't already.</p>
<p><img src="__GHOST_URL__/content/images/2014/Sep/3-1.PNG" alt="Configuration of the VM" loading="lazy"></p>
<p>Additionally, we will need to manually assign a static IP address (instead of relying on DHCP) to ensure that even if we stop or restart a machine, it will come up with the same address.</p>
<p><img src="__GHOST_URL__/content/images/2014/09/3-1.PNG" alt="Assign static IP address" loading="lazy"></p>
<p>Once the machine has been created, we need to add it to an Availability Set</p>
<p><img src="__GHOST_URL__/content/images/2014/Sep/4-2.PNG" alt="Configure Availability Set" loading="lazy"></p>
<p>Now, let's add a second Virtual Machine to the same Cloud Service and availablity set by going to the Resource Group, and adding a new resource (Virtual Machine), specifying the hostname to be <code>mysql2</code> and the same user name and SSH key.</p>
<p><img src="__GHOST_URL__/content/images/2014/09/5.PNG" alt="Adding another VM to the Resource Group" loading="lazy"></p>
<p>What is important to notice is, when creating this second Virtual Machine, you have to add it to the same Availability Set of the first <code>mysql1</code> machine. You might also want to use the same Storage Account.</p>
<p>Make sure you configure a different Static IP.</p>
<p><img src="__GHOST_URL__/content/images/2014/09/6.PNG" alt="Create the VM in the same Availablility Set" loading="lazy"></p>
<p>Now let the portal create the second Virtual Machine.</p>
<h3 id="step2installingmysql">Step 2 - Installing MySQL</h3>
<p>Once both machines are up and running, we'll need to SSH into each machine and run a few commands to install MySQL and setup the replication.</p>
<p>The SSH endpoint on both machines would be your Cloud Service name, in my case here that would be <code>mysqlha.cloudapp.net</code> and the port would be the one defined in the Endpoints. For <code>mysql1</code> that would be port <code>22</code>, for <code>mysql2</code> that would be <code>50793</code> which was randomly assigned by the portal.</p>
<p><img src="__GHOST_URL__/content/images/2014/09/7.PNG" alt="Finding out the SSH endpoint" loading="lazy"></p>
<p>Using your favorite SSH client, SSH into your machines one by one to setup.</p>
<h4 id="virtualmachinemysql1">Virtual Machine: mysql1</h4>
<h5 id="installmysql">Install MySQL</h5>
<p>Once you're connected, update the package sources<br>
<code>sudo apt-get update</code></p>
<p>Then let's install mysql-server and mysql-client packages<br>
<code>sudo apt-get install mysql-server mysql-client</code></p>
<h5 id="createreplicationuser">Create replication user</h5>
<p>Create the replication user and specify a password<br>
<code>create user 'replicator'@'%' identified by 'aComplexPassword';</code></p>
<p>Then give him permissions to replicate all databases (that are specified in the config file)<br>
<code>grant replication slave, replication client on *.* to 'replicator'@'%';</code></p>
<p>Then run <code>flush privileges;</code> to apply changes to the user table.</p>
<p>After this step is completed, you should be able to login to <code>mysql1</code> from <code>mysql2</code> through the <code>replicator</code> user.</p>
<h5 id="configurereplication">Configure replication</h5>
<p>We need to edit and set some parameters in MySQL configuration to ensure correct replication. Open the config file using your favorite editor by<code>sudo nano /etc/mysql/my.cnf</code></p>
<ul>
<li>Uncomment and edit the <code>server-id</code> specifying a non zero identifier that will identify the server in the replication group.</li>
<li>Uncomment <code>log_bin = /var/log/mysql/mysql-bin.log</code> which is the path where the transactions are stored.</li>
<li>Uncomment and edit <code>binlog_do_db = exampledb</code> with the name of the database(s) you wish to include in the replication relationship.</li>
<li>Comment <code>bind-address = 127.0.0.1</code> to allow connections from the Internet. In a production environment, you probably don't want to do this and you can opt to use Azure Internal Loadbalancer and make the service only accessible from within your Virtual Network.</li>
<li>Set the <code>relay-log</code>, <code>relay-log-index</code> and <code>relay-log-info-file</code> to ensure proper resumption of replication relationship in the event of MySQL service restart or failover:</li>
</ul>
<pre>
relay-log = /var/log/mysql/relay-bin
relay-log-index = /var/log/mysql/relay-bin.index
relay-log-info-file = /var/log/mysql/relay-bin.info
</pre>
<ul>
<li>To avoid auto incremented primary keys from clashing across servers, you also need to set on <code>mysql1</code> and change the increment offset on <code>mysql2</code></li>
</ul>
<pre>
auto_increment_increment = 2
auto_increment_offset    = 1
</pre>
<ul>
<li>Finally also set <code>log_slave_updates = 1</code> to ensure that changes that happened on the other master are also reflected in this machine's binary log.</li>
</ul>
<p>To summarize, here are the final list of changes and variables under <code>[mysqld]</code>:</p>
<pre>#bind-address = 127.0.0.1
server-id = 1
log_bin = /var/log/mysql/mysql-bin.log
binlog_do_db = exampledb # your database name here
relay-log = /var/log/mysql/relay-bin
relay-log-index = /var/log/mysql/relay-bin.index
relay-log-info-file = /var/log/mysql/relay-bin.info
auto_increment_increment = 2
auto_increment_offset    = 1
log_slave_updates		 = 1
</pre>
<p>Ctrl-X then Y to save and exit.</p>
<p>Restart mysql <code>sudo service mysql restart</code></p>
<p>Finally, we need 2 pieces of information to setup the replication on the slave <code>mysql2</code>, we can obtain them through <code>show master status;</code> which will output something similar to:</p>
<pre>
+------------------+----------+--------------+------------------+
| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB |
+------------------+----------+--------------+------------------+
| mysql-bin.000001 |      343 | exampledb    |                  |
+------------------+----------+--------------+------------------+
1 row in set (0.00 sec)
</pre>
<p>The information we need is the File and Position. Make note of them, they are probably different on your server than from what you see here.</p>
<h4 id="virtualmachinemysql2">Virtual Machine: mysql2</h4>
<p>For our second MySQL node, <code>mysql2</code>, we'll configure it using the exact same steps as we've did for <code>mysql1</code> (install MySQL, add replication user and configure) with the exception to setting the <code>server-id = 2</code> and <code>auto_increment_offset = 2</code> in the <code>/etc/mysql/my.cnf</code> config file.</p>
<h3 id="step3setupreplicationbetweenmysql1andmysql2">Step 3 - Setup replication between <code>mysql1</code> and <code>mysql2</code></h3>
<h4 id="createthedatabaseonmysql1">Create the database on <code>mysql1</code></h4>
<p>On <code>mysql1</code>, in a MySQL prompt, create the <code>exampledb</code><br>
<code>create database exampledb;</code></p>
<h4 id="pointtheslavemysql2tomastermysql1">Point the slave <code>mysql2</code> to master <code>mysql1</code></h4>
<p>On <code>mysql2</code>, in this step, we will need:</p>
<ul>
<li>The replicator user credentials</li>
<li>The master log File name (of <code>mysql1</code>) that we obtained previously through <code>show master status;</code> on <code>mysql1</code></li>
<li>The Position (of <code>mysql1</code>) that we obtained previously through <code>show master status;</code> on <code>mysql1</code></li>
</ul>
<p>Then run the below on the MySQL prompt <strong>replacing the values with your values</strong>:</p>
<pre>
slave stop;
CHANGE MASTER TO MASTER_HOST = 'mysql1', MASTER_USER = 'replicator', MASTER_PASSWORD = 'aComplexPassword', MASTER_LOG_FILE = 'mysql-bin.000001',  MASTER_LOG_POS = 344;
</pre>
<h4 id="startreplication">Start replication</h4>
<p>After doing the above, start the slave on <code>mysql2</code> then show the status of the replication relationship</p>
<pre>
slave start;
show slave status;
</pre>
<h4 id="testmysql1tomysql2replication">Test <code>mysql1</code> to <code>mysql2</code> replication</h4>
<p>On <code>mysql1</code>, create a new table on the <code>exampledb</code><br>
<code>create table exampledb.dummy(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, data varchar(100));</code> then insert a couple of rows</p>
<pre>
insert into exampledb.dummy SET data='mysql 1 to 2 replication test';
insert into exampledb.dummy SET data='mysql 1 to 2 replication test another row';
</pre>
<p>Once you do that and do a <code>select * from exampledb.dummy</code> on <code>mysql2</code> you should find the rows nicely waiting for you:</p>
<pre>
mysql> select * from exampledb.dummy;
+----+-------------------------------------------+
| id | data                                      |
+----+-------------------------------------------+
|  1 | mysql 1 to 2 replication test             |
|  3 | mysql 1 to 2 replication test another row |
+----+-------------------------------------------+
2 rows in set (0.00 sec)
</pre>
<h3 id="step4setupreplicationbetweenmysql2andmysql1">Step 4 - Setup replication between <code>mysql2</code> and <code>mysql1</code></h3>
<h4 id="pointtheslavemysql1tomastermysql2">Point the slave <code>mysql1</code> to master <code>mysql2</code></h4>
<p>On <code>mysql1</code>, in this step, we will need:</p>
<ul>
<li>The replicator user credentials</li>
<li>The master log File name (of <code>mysql2</code>) that we obtained previously through <code>show master status;</code> on <code>mysql2</code></li>
<li>The Position (of <code>mysql2</code>) that we obtained previously through <code>show master status;</code> on <code>mysql2</code></li>
</ul>
<p>Then run the below on the MySQL prompt <strong>replacing the values with your values</strong>:</p>
<pre>
slave stop;
CHANGE MASTER TO MASTER_HOST = 'mysql2', MASTER_USER = 'replicator', MASTER_PASSWORD = 'aComplexPassword', MASTER_LOG_FILE = 'mysql-bin.000003',  MASTER_LOG_POS = 107;
</pre>
<h4 id="startreplication">Start replication</h4>
<p>After doing the above, start the slave on <code>mysql1</code> then show the status of the replication relationship</p>
<pre>
slave start;
show slave status;
</pre>
<h4 id="testmysql2tomysql1replication">Test <code>mysql2</code> to <code>mysql1</code> replication</h4>
<p>On <code>mysql2</code>, then insert a couple of rows</p>
<pre>
insert into exampledb.dummy SET data='mysql 2 to 1 replication test';
insert into exampledb.dummy SET data='mysql 2 to 1 replication test another row';
</pre>
<p>Once you do that and do a <code>select * from exampledb.dummy</code> on <code>mysql1</code> you should find the rows nicely waiting for you:</p>
<pre>
mysql> select * from exampledb.dummy;
+----+-------------------------------------------+
| id | data                                      |
+----+-------------------------------------------+
|  1 | mysql 1 to 2 replication test             |
|  3 | mysql 1 to 2 replication test another row |
|  4 | mysql 2 to 1 replication test             |
|  6 | mysql 2 to 1 replication test another row |
+----+-------------------------------------------+
4 rows in set (0.00 sec)
</pre>
<h3 id="step5loadbalancebetweenmysql1andmysql2">Step 5 - Load balance between <code>mysql1</code> and <code>mysql2</code></h3>
<p>Now that we have setup the Master-Master replication between <code>mysql1</code> and <code>mysql2</code>, we need to ensure that applications using this database always find a healthy replica.</p>
<p>There are a couple of ways to do this, one of them being setting up another Virtual Machine <a href="http://mysql.wingtiplabs.com/documentation/hap225xe/fail-over-mysql-with-haproxy">running HAProxy for example</a> or in our case, I'm going to make use of the Azure Load Balancer that comes with the Cloud Service to setup load balancing.</p>
<p>Note that in this setup, I'm going to expose my MySQL database to the internet over a public endpoint (3306), I could apply <a href="http://msdn.microsoft.com/library/azure/dn376541.aspx">ACL to the endpoint</a> to allow only specific IP addresses to connect, or I can make use of the <a href="http://azure.microsoft.com/blog/2014/05/20/internal-load-balancing/">Internal Azure Load balancer</a>. For the purpose of this blog post, I'll just leave it public.</p>
<h4 id="createloadbalancedsetonmysql1">Create Load balanced set on <code>mysql1</code></h4>
<p>Let's go back to our portal, click on the <code>mysql1</code> VM, scroll down to <strong>Load balanced sets</strong> and click there, then click on <strong>Join</strong>, then <strong>Configure required settings</strong>.<br>
<img src="__GHOST_URL__/content/images/2014/09/9-1.PNG" alt="Setting up load balanced set" loading="lazy"></p>
<p>Then <strong>Create new</strong> with <strong>Public and Private ports 3306</strong>, specify a <strong>6 second interval</strong> and <strong>2 retries before considering node unavailable</strong> then save and wait for the set to show in the table.<br>
<img src="__GHOST_URL__/content/images/2014/09/10.PNG" alt="Settings for load balanced set" loading="lazy"></p>
<h4 id="jointhesameloadbalancedsetonmysql2">Join the same Load balanced set on <code>mysql2</code></h4>
<p>Repeat the same procedure for <code>mysql2</code> but instead of creating a new set, join the previously created one.<br>
<img src="__GHOST_URL__/content/images/2014/09/11.PNG" alt="Join load balanced set" loading="lazy"></p>
<h3 id="step6testloadbalancing">Step 6 - Test load balancing</h3>
<p>Additionally, for the purpose of the blog post, <strong>on both servers</strong>, run:</p>
<pre>
grant all privileges on *.* to 'root'@'%' identified by 'aComplexPassword';
flush privileges;
</pre>
<p>which essentially allows the <code>root</code> user to connect remotely.</p>
<p>You should now be able to connect to your MySQL &quot;farm&quot; on<br>
<code>mysqlha.cloudapp.net:3306</code> so test it from any machine and do a <code>show variables like &quot;server_id&quot;</code> to get</p>
<pre>
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| server_id     | 2     |
+---------------+-------+
1 row in set (0.00 sec)
</pre>
<p>if you disconnect and connect again, you might get</p>
<pre>
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| server_id     | 1     |
+---------------+-------+
1 row in set (0.00 sec)
</pre>
<h3 id="step6testfailover">Step 6 - Test Fail over</h3>
<p>Now Shutdown one of the VMs (for example <code>mysql2</code>) on Azure and try to connect to <code>mysqlha.cloudapp.net</code> and insert a couple of rows.</p>
<pre>
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| server_id     | 1     |
+---------------+-------+
1 row in set (0.00 sec)
</pre>
<p><code>mysql&gt; insert into exampledb.dummy SET data='mysql 1 is up, testing failover';</code></p>
<p>Now Start the <code>mysql2</code> VM again and directly connect to it's MySQL instance, then <code>select * from exampledb.dummy</code>. You should find the row inserted while the instance was offline synced:</p>
<pre>
+----+-------------------------------------------+
| id | data                                      |
+----+-------------------------------------------+
|  1 | mysql 1 to 2 replication test             |
|  3 | mysql 1 to 2 replication test another row |
|  4 | mysql 2 to 1 replication test             |
|  6 | mysql 2 to 1 replication test another row |
|  7 | Testing Load balancing                    |
|  8 | Testing Load balancing 2                  |
|  9 | mysql 1 is up, testing failover           |
+----+-------------------------------------------+
7 rows in set (0.00 sec)
</pre><!--kg-card-end: markdown-->
