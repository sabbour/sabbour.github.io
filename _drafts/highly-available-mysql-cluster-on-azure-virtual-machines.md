---
layout: post
title: Highly Available MySQL Cluster on Azure Virtual Machines
date: 2014-09-25T12:57:51.000Z
---

<!--kg-card-begin: markdown--><h1 id="introduction">Introduction</h1>
<p>Achieving High Availability on your database level is essential in order to maintain your application availability. On Azure, you can provision a managed highlt-available MySQL database cluster through a 3rd party <a href="https://www.cleardb.com/store/azure">ClearDB</a>.</p>
<p>In this post, I'm going to explore creating a highly available MySQL Cluster on Azure running on Ubuntu Virtual Machines and making use of <a href="http://www.drbd.org/">Distributed Replicated Block Device (DRBD)</a>, <a href="http://corosync.github.io/corosync/">Corosync</a> and <a href="http://clusterlabs.org/">Pacemaker</a>.</p>
<p>I'm roughly following the guidance by Jose-Miguelle Parella (<a href="https://twitter.com/bureado">@bureado</a>) where you can watch him do this on <a href="http://channel9.msdn.com/Blogs/Open/Load-balancing-highly-available-Linux-services-on-Windows-Azure-OpenLDAP-and-MySQL">Channel 9</a>.</p>
<p>Below is a high-level architecture of what we're trying to achieve<br>
<img src="__GHOST_URL__/content/images/2014/Sep/1-1.png" alt="Architecture" loading="lazy"></p>
<p>Where DRBD is doing the replication for the data and Corosync+Pacemaker orchestrate the clustering and failover.</p>
<p>The virtual machines are running within an availability set to ensure High Availability, and they are both within a single Cloud Service that is configured behind an internal load balancer.</p>
<h1 id="gettingstarted">Getting Started</h1>
<h2 id="createvirtualmachines">Create Virtual Machines</h2>
<h3 id="createnode1">Create Node 1</h3>
<p>Login to the new <a href="http://portal.azure.com">Azure Portal</a> and click on New, then choose Ubuntu 14.04 LTS to start.<br>
<img src="__GHOST_URL__/content/images/2014/Sep/2-1.PNG" alt="Creating the VM" loading="lazy"></p>
<p>Now fill in the data require. In my setup I've used <code>mysql1</code> as the hostname of this first machine, and I've customized the Cloud Service name to be <code>mysqlha</code>.</p>
<p>Additionally, you'll need to provide an SSH key for logging in to the machines with certificates, so here is how to <a href="http://www.jeff.wilcox.name/2013/06/secure-linux-vms-with-ssh-certificates/">generate an SSH key for Azure</a> if you haven't already.</p>
<p><img src="__GHOST_URL__/content/images/2014/Sep/3-1.PNG" alt="Configuration of the VM" loading="lazy"></p>
<p>Once the machine has been created, we need to add it to an Availability Set</p>
<p><img src="__GHOST_URL__/content/images/2014/Sep/4-2.PNG" alt="Configure Availability Set" loading="lazy"></p>
<!--kg-card-end: markdown-->
