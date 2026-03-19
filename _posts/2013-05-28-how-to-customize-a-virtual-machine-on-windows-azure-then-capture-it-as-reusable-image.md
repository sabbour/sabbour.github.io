---
layout: post
title: How to customize a Virtual Machine on Windows Azure, then capture it as reusable image
date: 2013-05-28T02:14:00.000Z
tags:
  - virtual machine
  - windows azure
  - iis
---

<!--kg-card-begin: markdown--><h1>Introduction</h1>
<p>In this 2 series post, we'll be creating a web farm of virtual machines running IIS on Windows Server 2012. In the first part, we will customize a Windows Server 2012 machine and set its roles to be running IIS, then capture it to be able to later create duplicates out of it with ease.</p>
<h1>Create the Virtual Machine</h1>
<p>We'll create a machine using the defaults by going to New --&gt; Compute --&gt; Virtual Machine --&gt; Quick Create</p>
<p><a href="/content/images/msdn/4061.image_5F00_5C36C37D.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/7080.image_5F00_thumb_5F00_66A771D0.png" alt="image" width="644" height="427" border="0" /> </a></p>
<p>Wait for the machine to be provisioned, should take about 10 minutes, then connect to it using Remote Desktop, logging in with the username and password you specified in the previous step.</p>
<p><a href="/content/images/msdn/2161.image_5F00_2454598D.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/4505.image_5F00_thumb_5F00_3AC6F814.png" alt="image" width="644" height="426" border="0" /></a></p>
<h1>Configuring the server</h1>
<p>You will now be logged in onto the remote Windows Server 2012 machine we just created. The Server Manager should launch automatically, if not, launch it from the icon in the bottom left of the Task Bar.</p>
<p><a href="/content/images/msdn/0755.image_5F00_116FB016.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/1803.image_5F00_thumb_5F00_7C9DB795.png" alt="image" width="644" height="364" border="0" /></a></p>
<p><a href="/content/images/msdn/2570.image_5F00_3A4A9F52.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/3073.image_5F00_thumb_5F00_5F3839FE.png" alt="image" width="644" height="364" border="0" /></a></p>
<p>Since we want to configure this as a Web server, we'll go ahead and configure the IIS role. Click on Add roles and features, then advance through the wizard till you reach the page where you select the roles, select Web Server (IIS).</p>
<p><a href="/content/images/msdn/5826.image_5F00_5B6A6F61.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/7127.image_5F00_thumb_5F00_78FC4A60.png" alt="image" width="644" height="364" border="0" /></a></p>
<p>Also go through the wizard to start and finish the installation.</p>
<p><a href="/content/images/msdn/8156.image_5F00_6BB5C14D.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/1172.image_5F00_thumb_5F00_3B3F3CD7.png" alt="image" width="644" height="364" border="0" /></a></p>
<p>Once the installation is over, we just need to open up port 80 in the firewall the Windows Azure load balancer. This is done on the Windows Azure portal's Endpoints tab.</p>
<p><a href="/content/images/msdn/8308.image_5F00_4E7FF376.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/7183.image_5F00_thumb_5F00_70884F3C.png" alt="image" width="644" height="428" border="0" /></a></p>
<p>Add the endpoint</p>
<p><a href="/content/images/msdn/8540.image_5F00_4DE410C1.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/7534.image_5F00_thumb_5F00_325F0EBE.png" alt="image" width="644" height="425" border="0" /></a></p>
<p>Once the endpoint configuration is done, you'll be able to access the server from the web by opening its DNS name in the browser.</p>
<p><a href="/content/images/msdn/6036.image_5F00_0973F9B5.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/2117.image_5F00_thumb_5F00_541AC182.png" alt="image" width="644" height="351" border="0" /></a></p>
<p>Congratulations, you've just configured an IIS8 server running on Windows Server 2012.</p>
<h1>Preparing the virtual machine image to be reusable</h1>
<p>Now suppose you create a lot of webservers, or suppose you configured this server with additional tools and frameworks such as a database, etc. Wouldn't your life be a lot easier if you can just create copies of this exact machine on demand?</p>
<p>This is exactly what we're going to do now, we are going to prepare this virtual machine to be a reusable image.</p>
<p>Go back to the Remote Desktop session, launch the Command Prompt as an Administrator</p>
<p><a href="/content/images/msdn/7245.image_5F00_51918FC4.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/8787.image_5F00_thumb_5F00_28A67ABB.png" alt="image" width="644" height="364" border="0" /></a></p>
<p>Change directory to <code>%windir%\system32\sysprep</code> then run <span style="font-family: Courier New; font-size: x-small;">sysprep.exe</span></p>
<p><a href="/content/images/msdn/5543.image_5F00_14ACE825.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/5327.image_5F00_thumb_5F00_7208A9A9.png" alt="image" width="644" height="364" border="0" /></a></p>
<p>When the Sysprep tools comes up, choose <strong>"Enter System Out-Of-Box Experience (OOBE)"</strong> and make sure <strong>"Generalize"</strong> is checked, and select <strong>"Shutdown"</strong> from the Shutdown Options.</p>
<p><img src="http://www.windowsazure.com/media/itpro/windows/sysprepgeneral.png" alt="Enter Sysprep.exe options" /></p>
<p>Sysprep will do some processing, then the Virtual Machine will shutdown which changes the status of the machine in the Management Portal to Stopped. The process of stopping the virtual machine may take up to 20 minutes. Once the virtual machine is stopped, you will be able to continue.</p>
<p> </p>
<h1>Capturing the Virtual Machine</h1>
<p>Once the machine is stopped, you will be able to click on <strong>"Capture"</strong> in the Management Portal to create a reusable image out of that machine.</p>
<p><a href="/content/images/msdn/0535.image_5F00_209EB28C.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/8322.image_5F00_thumb_5F00_0519B089.png" alt="image" width="644" height="425" border="0" /></a></p>
<p>Enter a recognizable name for the image, say "Windows_Server_2012_with_IIS", select "I have run Sysprep on the virtual machine", then continue with capturing. <strong>Note that this process deletes the virtual machine.</strong></p>
<p><a href="/content/images/msdn/3414.image_5F00_62E1A502.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/1321.image_5F00_thumb_5F00_4E7BDF77.png" alt="image" width="644" height="423" border="0" /></a></p>
<p>After this is done, you will find this image in the Images tab, and you will be able to create new virtual machines based on it.</p>
<p><a href="/content/images/msdn/0537.image_5F00_1E718DF6.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/8015.image_5F00_thumb_5F00_028058FE.png" alt="image" width="644" height="427" border="0" /></a></p>
<p><a href="/content/images/msdn/7318.image_5F00_60484D77.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/7183.image_5F00_thumb_5F00_24A83EB7.png" alt="image" width="644" height="426" border="0" /></a></p>
<p>In our next post, we'll see how to use this image and easily create a load balanced web farm of servers.</p><blockquote class='note original-post'><div><p><strong>Note: </strong>This post originally appeared on my MSDN blog at 		<a href='http://blogs.msdn.com/b/africaapps/archive/2013/05/28/how-to-customize-a-virtual-machine-on-windows-azure-then-capture-it-as-reusable-image.aspx'>http://blogs.msdn.com/b/africaapps/archive/2013/05/28/how-to-customize-a-virtual-machine-on-windows-azure-then-capture-it-as-reusable-image.aspx</a></p></div></blockquote><!--kg-card-end: markdown-->
