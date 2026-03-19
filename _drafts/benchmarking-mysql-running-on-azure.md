---
layout: post
title: Benchmarking MySQL running on Azure
date: 2014-11-25T19:17:27.000Z
---

<!--kg-card-begin: markdown--><ul>
<li>
<p>Create CentOS 7 VM</p>
</li>
<li>
<p>Go to <a href="http://dl.fedoraproject.org/pub/epel/7/x86_64/e/">http://dl.fedoraproject.org/pub/epel/7/x86_64/e/</a></p>
</li>
<li>
<p>Download latest epel-release-7-2.noarch.rpm</p>
<pre><code>  curl -O http://dl.fedoraproject.org/pub/epel/7/x86_64/e/epel-release-7-2.noarch.rpm
</code></pre>
</li>
<li>
<p>Install epel</p>
<pre><code>  rpm -Uvh epel-release*rpm
</code></pre>
</li>
<li>
<p>Install sysbench</p>
<pre><code>	yum install sysbench
</code></pre>
</li>
<li>
<p>Prepare</p>
<pre><code>  sysbench --test=oltp --oltp-table-size=100000 --mysql-user=cluster --mysql-password=p@ssw0rd --mysql-host=mariadbha.cloudapp.net --mysql-db=TestDB --db-ps-mode=disable --mysql-port=3306 --db-driver=mysql  prepare
</code></pre>
</li>
<li>
<p>Run</p>
<pre><code>  for i in 1 2 4 8 16 32 64 128 ; do sysbench --num-threads=$i --max-requests=0 --max-time=60 --test=oltp --oltp-table-size=100000 --mysql-user=cluster --mysql-password=p@ssw0rd --mysql-host=mariadbha.cloudapp.net --mysql-db=TestDB --db-ps-mode=disable --mysql-port=3306 --db-driver=mysql --oltp-read-only run | grep 'transactions:' ; done
</code></pre>
</li>
</ul>
<!--kg-card-end: markdown-->
