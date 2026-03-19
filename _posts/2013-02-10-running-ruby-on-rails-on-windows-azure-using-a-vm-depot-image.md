---
layout: post
title: Running Ruby on Rails on Windows Azure using a VM Depot image
date: 2013-02-10T07:53:00.000Z
tags:
  - vm
  - opensource
  - open source
  - ruby
  - virtual machine
  - vmdepot
  - vm depot
  - ruby on rails
  - windowws azure
---

<!--kg-card-begin: markdown--><h2 class="Publishwithline">Introduction</h2>
<p> Have you heard of <a href="http://vmdepot.msopentech.com/">VM Depot</a>? VM Depot is part of the Microsoft Open Technologies initiative, which is only one way of how Microsoft is opening up to open source technologies.</p>
<p>VM Depot is basically a repository of virtual machine images. Using VM Depot and Windows Azure, Developers can create and share images of Linux-based virtual machines, and share details on their experiences using those images.</p>
<p>We will be using the <a href="http://vmdepot.msopentech.com/Vhd/Show?vhdId=76&amp;version=77">BitNami Ruby Stack</a> which includes ready-to-run versions of Ruby, Rails, RubyGems, Apache, MySQL, SQLite, Subversion, Apache, PHP, phpMyAdmin, Git, nginx, sphinx, Imagemagick and more. It is completely integrated and configured, so you'll be ready to start developing your application as soon as the image is launched onto Windows Azure.</p>
<h2>Getting the image onto Azure</h2>
<p>There is an easy way to get VM Depot images onto your Windows Azure subscription. Let's start.</p>
<p>Go to the <a href="http://manage.windowsazure.com/">Management Portal</a> the go to "Virtual Machines", and click on the "Images" tab, you will find a "Browse VMDEPOT" button. Click this.</p>
<p><a href="/content/images/msdn/5811.1.-browse-vmdepot.PNG"><img src="/content/images/msdn/5811.1.-browse-vmdepot.PNG" alt="" border="0" /></a></p>
<p>You will be presented with a wide selection of Virtual Machines for different scenarios, whether it is a LAMP, Django, Node.js or Ruby on Rails stack.</p>
<p><a href="/content/images/msdn/6562.2.-select-vmdepot.PNG"><img src="/content/images/msdn/6562.2.-select-vmdepot.PNG" alt="" border="0" /></a></p>
<p>Select the image you desire, and select the storage account to download it on.</p>
<p><a href="/content/images/msdn/1121.3.-choose-storage.PNG"><img src="/content/images/msdn/1121.3.-choose-storage.PNG" alt="" border="0" /></a></p>
<p>Now sit back and relax, go grab a coffee, stretch and come back. This will take a while, as Windows Azure is now downloading the Linux VM image from the servers (which is a 30GB image). When it is done, you will need to "Register" it so that it would be available for you when creating a new Virtual Machine.</p>
<p><a href="/content/images/msdn/3301.3.1-register.PNG"><img src="/content/images/msdn/3301.3.1-register.PNG" alt="" border="0" /></a></p>
<h2>Provision the Ruby on Rails VM on Azure</h2>
<p>When you register the downloaded VM image, it is time to create a Virtual Machine using it.</p>
<p>Click on "New" to create a new Virtual Machine, and in the creation dialog, make sure you select "From Gallery".</p>
<p><a href="/content/images/msdn/0434.4.-From-gallery.PNG"><img src="/content/images/msdn/0434.4.-From-gallery.PNG" alt="" border="0" /></a></p>
<p>If the previous registration step was successful, you will be able to select the Ruby virtual machine from "My Images".</p>
<p><a href="/content/images/msdn/4743.5.-my-images.PNG"><img src="/content/images/msdn/4743.5.-my-images.PNG" alt="" border="0" /></a></p>
<p>Go through the steps to set it up and then wait for it to be provisioned, then start it.</p>
<h2>Login to the machine</h2>
<p>Now you can use SSH through any SSH client (I use PuTTY) to connect to your brand new Virtual Machine.</p>
<p><a href="/content/images/msdn/6712.6.-ssh-machine.PNG"><img src="/content/images/msdn/6712.6.-ssh-machine.PNG" alt="" border="0" /></a></p>
<p>Since we are using the BitNami image, we can go ahead and <a href="http://wiki.bitnami.org/Infrastructure_Stacks/BitNami_Ruby_Stack">follow the steps written here</a> to verify the installation (though it is a bit outdated, so I'll outline what I've done below).</p>
<p>Go into the "stack" folder</p>
<pre class="scroll"><code class="js">azureuser@sabbourruby:~$ <strong>cd stack</strong></code></pre>
<p>Run the rubyconsole</p>
<pre class="scroll"><code class="js">azureuser@sabbourruby:~/stack$ <strong>sudo ./rubyconsole</strong></code></pre>
<p>Go to the "projects" folder</p>
<pre class="scroll"><code class="js">root@sabbourruby:/opt/bitnami#<strong> cd projects/sample</strong></code></pre>
<p>Start the Rails server with the sample application</p>
<pre class="scroll"><code class="js">root@sabbourruby:/opt/bitnami/projects/sample#<strong> ruby script/rails server</strong></code></pre>
<p>You will then see something like this indicating the server started your app</p>
<pre class="scroll"><code class="cplusplus"> =&gt; Booting WEBrick<br /> =&gt; Rails 3.2.11 application starting in development on http://0.0.0.0:3000<br /> =&gt; Call with -d to detach<br /> =&gt; Ctrl-C to shutdown server<br /> [2013-02-10 15:21:58] INFO WEBrick 1.3.1<br /> [2013-02-10 15:21:58] INFO ruby 1.9.3 (2012-11-10) [x86_64-linux]<br /> [2013-02-10 15:21:58] INFO WEBrick::HTTPServer#start: pid=2024 port=3000</code></pre>
<h2>Open the required port as an Endpoint</h2>
<p>Before you can access this brand new sample Ruby website from the web, we need to punch a hole in the VM's firewall to allow the connections to go through. In this case, the webserver is running on port 3000, so we need to create an Endpoint mapping to that port from the Management Portal.</p>
<p><a href="/content/images/msdn/1057.7.-endpoints.PNG"><img src="/content/images/msdn/1057.7.-endpoints.PNG" alt="" border="0" /></a></p>
<p>Go to your VM instance, and click on the "Endpoints" tab and click on "Add Endpoint"</p>
<p><a href="/content/images/msdn/4466.8.-endpoints-add.PNG"><img src="/content/images/msdn/4466.8.-endpoints-add.PNG" alt="" border="0" /></a></p>
<p>Then specify the public and private ports to be 3000. Apply and wait for the rule to take effect.</p>
<p><a href="/content/images/msdn/5808.9.-endpoints-add-2.PNG"><img src="/content/images/msdn/5808.9.-endpoints-add-2.PNG" alt="" border="0" /></a></p>
<h2>Now you are ready to get started!</h2>
<p>Your first Azure backed Ruby on Rails website is now live on the web.</p>
<p><a href="/content/images/msdn/6545.10.-done.PNG"><img src="/content/images/msdn/6545.10.-done.PNG" alt="" border="0" /></a></p>
<p>You can go ahead and use MySQL, download additional Ruby gems, and basically do whatever you want with this VM.</p>
<p> </p><blockquote class='note original-post'><div><p><strong>Note: </strong>This post originally appeared on my MSDN blog at 		<a href='http://blogs.msdn.com/b/africaapps/archive/2013/02/10/running-ruby-on-rails-on-windows-azure-using-a-vm-depot-image.aspx'>http://blogs.msdn.com/b/africaapps/archive/2013/02/10/running-ruby-on-rails-on-windows-azure-using-a-vm-depot-image.aspx</a></p></div></blockquote><!--kg-card-end: markdown-->
