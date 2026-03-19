---
layout: post
title: Creating a WIMP Stack (Windows Server, IIS, MySQL, PHP) on Windows Azure
date: 2013-11-05T04:23:00.000Z
tags:
  - php
  - mysql
  - azure
  - wimp
  - virtual machines
---

<!--kg-card-begin: markdown--><h1>Introduction</h1>
<p>In this post, I'll take you through how you can create a WIMP stack (regardless of the name!) onto a Windows Azure VM really easy. I'm a guy who likes to configure things graphically, so although you can already create a LAMP stack (Linux, Apache, MySQL, PHP) on a Linux VM on Azure pretty easily, I still love Windows and easy management. In a future post, I'll also document how to create a WAMP stack (Windows, Apache, MySQL, PHP).</p>
<div style="padding: 12px; background-color: #ffff99;">
<p><strong>Disclaimer:</strong><strong> <br /></strong>You can host PHP sites much easier on Windows Azure Websites, as there is practically ZERO configuration that you need to do and you get .NET, PHP, node.js and Python support out of the box with FTP and Source Control deployment options baked in.</p>
<p>If you must use MySQL as your database, you can opt for a Database as a Service solution provided by ClearDB through Windows Azure, or you can create a Virtual Machine (Windows or Linux) and use it as a dedicated database.</p>
<p>I'm showing you this tutorial for the sake of completeness and in case you really need to manage everything yourself. But I'm telling you, you are probably better off using Windows Azure Websites + ClearDB.</p>
</div>
<h1>Let's start</h1>
<h2>Create a Windows Server 2012 VM</h2>
<p><a href="__GHOST_URL__/content/images/msdn/2275.image_5F00_6A8D4ACF.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/5282.image_5F00_thumb_5F00_2744D360.png" alt="image" width="644" height="412" border="0" /></a></p>
<p><a href="__GHOST_URL__/content/images/msdn/8877.image_5F00_06C0245F.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/1376.image_5F00_thumb_5F00_3CC4A36C.png" alt="image" width="644" height="411" border="0" /></a></p>
<p><a href="__GHOST_URL__/content/images/msdn/4062.image_5F00_5556D16D.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/7658.image_5F00_thumb_5F00_3948A333.png" alt="image" width="644" height="411" border="0" /></a></p>
<p>And in the last step, make sure to open up the FTP and HTTP endpoints in the Load Balancer</p>
<p><a href="__GHOST_URL__/content/images/msdn/0172.image_5F00_60194A24.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/3757.image_5F00_thumb_5F00_0AF43EE8.png" alt="image" width="644" height="411" border="0" /></a></p>
<p>Click the checkmark and wait for the machine to be provisioned. About 5 minutes.</p>
<h2>Login to the new machine using Remote Desktop</h2>
<p>Once the machine is ready and is in the Running state, click on its name (or its row), then click on Connect.</p>
<p><a href="__GHOST_URL__/content/images/msdn/0167.image_5F00_6EE610AD.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/1425.image_5F00_thumb_5F00_19C10571.png" alt="image" width="644" height="427" border="0" /></a></p>
<p>Login with the username and password you specified during creating the VM.</p>
<h2>Configure the server by adding Web Server IIS (Internet Information Services) role</h2>
<p>The Server Manager window should open by default, but if not, open it.</p>
<p><a href="__GHOST_URL__/content/images/msdn/0363.image_5F00_7DB2D736.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/6366.image_5F00_thumb_5F00_3F4D1383.png" alt="image" width="244" height="112" border="0" /></a></p>
<p>On the <strong>Dashboard</strong>, go to<strong> Quick start</strong> then click on <strong>Add roles and features</strong></p>
<p><a href="__GHOST_URL__/content/images/msdn/6131.image_5F00_2ED4A288.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/1781.image_5F00_thumb_5F00_0C136ACB.png" alt="image" width="644" height="338" border="0" /></a></p>
<p>Click Next, then select <strong>"Role-based or feature-based installation"</strong></p>
<p><a href="__GHOST_URL__/content/images/msdn/7181.image_5F00_6952330D.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/7484.image_5F00_thumb_5F00_1022D9FF.png" alt="image" width="644" height="299" border="0" /></a></p>
<p>Leave your server preselected and click Next</p>
<p><a href="__GHOST_URL__/content/images/msdn/6443.image_5F00_2CBF55D2.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/5228.image_5F00_thumb_5F00_733ED68B.png" alt="image" width="644" height="423" border="0" /></a></p>
<p>Scroll down a bit and check Web Server (IIS) and click on Add Features on the dialog that will popup</p>
<p><a href="__GHOST_URL__/content/images/msdn/1563.image_5F00_0BD1048D.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/7624.image_5F00_thumb_5F00_7675DFD5.png" alt="image" width="644" height="427" border="0" /></a></p>
<p>Click Next then start the installation process</p>
<p><a href="__GHOST_URL__/content/images/msdn/8750.image_5F00_611ABB1E.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/2766.image_5F00_thumb_5F00_5991DC62.png" alt="image" width="644" height="427" border="0" /></a></p>
<p>In a few minutes, IIS should be up and running.</p>
<p><a href="__GHOST_URL__/content/images/msdn/6428.image_5F00_0B1FDAA9.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/5710.image_5F00_thumb_5F00_1CFEFF27.png" alt="image" width="644" height="280" border="0" /></a></p>
<h2>Install PHP and MySQL</h2>
<p>You could go ahead and download PHP and MySQL separately and then install/configure them manually, or you could go to the easy route and use the brilliant Microsoft Web Platform Installer, which is what I'll do.</p>
<p>Open up a browser on the server and download the Microsoft WebPI from here <a title="http://www.microsoft.com/web/downloads/platform.aspx" href="http://www.microsoft.com/web/downloads/platform.aspx">http://www.microsoft.com/web/downloads/platform.aspx</a></p>
<p>When the website loads, click on Free download and run the downloaded installer</p>
<p><a href="__GHOST_URL__/content/images/msdn/7220.image_5F00_00F0D0ED.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/2860.image_5F00_thumb_5F00_577C8FAC.png" alt="image" width="244" height="233" border="0" /></a></p>
<p>When the installer loads up, search for PHP and then add your preferred PHP version</p>
<p><a href="__GHOST_URL__/content/images/msdn/8360.image_5F00_1BBF87AA.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/5826.image_5F00_thumb_5F00_469A7C6D.png" alt="image" width="644" height="437" border="0" /></a></p>
<p>then search for MySQL and add your preferred version</p>
<p><a href="__GHOST_URL__/content/images/msdn/3326.image_5F00_48012FF0.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/5355.image_5F00_thumb_5F00_17017F43.png" alt="image" width="644" height="441" border="0" /></a></p>
<p>Click on <strong>Install</strong> to begin the installation</p>
<p>The installer will ask you to choose a password for MySQL, choose a password</p>
<p><a href="__GHOST_URL__/content/images/msdn/2664.image_5F00_56CDF679.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/1856.image_5F00_thumb_5F00_3ABFC83F.png" alt="image" width="644" height="443" border="0" /></a></p>
<p>Continue and Accept the Terms and Conditions. Web PI will now download and install PHP and MySQL.</p>
<h2>Testing the PHP installation worked</h2>
<p>On the server navigate to the default IIS web root (<strong>C:\inetpub\wwwroot</strong>) and add an <strong>index.php</strong> file with the following content</p>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: 'Courier New', courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: #f4f4f4;">
<div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">&lt;?php</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">phpinfo();</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">?&gt;</pre>
<!--CRLF --></div>
</div>
<p>Save the file then go to <a href="http://wimpstack.cloudapp.net/index.php">http://wimpstack.cloudapp.net/index.php</a> you should find the PHP information page loading up. Congratulations!</p>
<p><a href="__GHOST_URL__/content/images/msdn/5618.image_5F00_1EB19A05.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/8132.image_5F00_thumb_5F00_1B9F3C10.png" alt="image" width="644" height="361" border="0" /></a></p>
<h2>(Optional) Install phpMyAdmin to manage your MySQL database</h2>
<p>On the server, open up the <a href="http://www.phpmyadmin.net/home_page/index.php" target="_blank">phpMyAdmin website</a> and download the latest version, then unzip it as phpmyadmin in <strong>C:\inetpub\wwwroot</strong></p>
<p>Following the configuration documentation of phpMyAdmin, create an empty <strong>config</strong> folder under <strong>C:\inetpub\wwwroot\phpmyadmin </strong>and <strong>make sure to grant Write or Full Control permissions to IUSR user </strong>then in a browser, go to <a href="http://wimpstack.cloudapp.net/phpmyadmin/setup">http://wimpstack.cloudapp.net/phpmyadmin/setup</a> and follow the setup wizard.</p>
<p><a href="__GHOST_URL__/content/images/msdn/4477.image_5F00_7467838B.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/3252.image_5F00_thumb_5F00_0CF9B18D.png" alt="image" width="644" height="368" border="0" /></a></p>
<p><a href="__GHOST_URL__/content/images/msdn/6443.image_5F00_258BDF8E.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/8358.image_5F00_thumb_5F00_09117E5F.png" alt="image" width="380" height="493" border="0" /></a></p>
<p>Finish the setup, move the <strong>config.inc.php</strong> file to the root of the <strong>phpmyadmin</strong> folder then delete the <strong>config</strong> folder, and you're in!</p>
<p><a href="__GHOST_URL__/content/images/msdn/0486.image_5F00_2FE22550.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/6786.image_5F00_thumb_5F00_7EE274A2.png" alt="image" width="644" height="262" border="0" /></a></p>
<h3>(Optional) Add FTP role</h3>
<p>In order to easily manage your server, let's add an FTP role. Follow the same process you did at the beginning to enable Web Server (IIS) role, but this time, expand the Web Server (IIS) node and check FTP Server</p>
<p><a href="__GHOST_URL__/content/images/msdn/4024.image_5F00_62D44668.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/2816.image_5F00_thumb_5F00_7B667469.png" alt="image" width="644" height="428" border="0" /></a></p>
<p>In about 1 minutes, the FTP role will be installed.</p>
<h4>Configure FTP</h4>
<p>Add FTP publishing to the Default Web Site</p>
<p><a href="__GHOST_URL__/content/images/msdn/1682.image_5F00_13F8A26B.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/0508.image_5F00_thumb_5F00_7E9D7DB3.png" alt="image" width="644" height="365" border="0" /></a></p>
<p>I'm going to select No SSL for now, since I don't have a certificate</p>
<p><a href="__GHOST_URL__/content/images/msdn/7384.image_5F00_451CFE6D.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/8322.image_5F00_thumb_5F00_420AA078.png" alt="image" width="644" height="433" border="0" /></a></p>
<p>Enable Basic Authentication and for now, grant the Read Write permissions to our administrator user that we created when the machine was provisioned. You can create a different user and use it here if you want.</p>
<p><a href="__GHOST_URL__/content/images/msdn/2018.image_5F00_53E9C4F6.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/4024.image_5F00_thumb_5F00_4CCD192F.png" alt="image" width="644" height="430" border="0" /></a></p>
<p>Due to the way the Windows Azure network functions, we need to enable Passive FTP so we need to do a few more steps.</p>
<p><strong>1. Get the public IP address of the machine from the portal</strong></p>
<p><a href="__GHOST_URL__/content/images/msdn/7610.image_5F00_1BCD6882.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/4010.image_5F00_thumb_5F00_2DAC8D00.png" alt="image" width="644" height="457" border="0" /></a></p>
<p><strong>2. Setup the local passive FTP data channel ports by running the following lines in a command prompt specifying the low data channel port and the high data channel port</strong></p>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: 'Courier New', courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: #f4f4f4;">
<div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">cd %windir%system32/inetsrv</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">appcmd set config /section:system.ftpServer/firewallSupport /lowDataChannelPort:7000 /highDataChannelPort:7002</pre>
<!--CRLF --></div>
</div>
<p><strong>3. Opening those ports (in this example, they are ports 7000,7001,7002) in the Virtual Machine endpoints on the portal</strong></p>
<p><a href="__GHOST_URL__/content/images/msdn/3617.image_5F00_119E5EC6.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/2086.image_5F00_thumb_5F00_6EDD2708.png" alt="image" width="485" height="484" border="0" /></a></p>
<p><strong>4. Enable stateful FTP filtering on the firewall by running this command in a command prompt</strong></p>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: 'Courier New', courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: #f4f4f4;">
<div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">netsh advfirewall set <span style="color: #0000ff;">global</span> StatefulFtp enable</pre>
<!--CRLF --></div>
</div>
<p><strong>5. Configure the FTP server to allow Passive FTP. Open FTP Firewall support <br /></strong><a href="__GHOST_URL__/content/images/msdn/3122.image_5F00_610D71BE.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/7776.image_5F00_thumb_5F00_2B97404A.png" alt="image" width="644" height="363" border="0" /></a></p>
<p>then type in the public IP of the machine that you got from the portal then hit Apply</p>
<p> <a href="__GHOST_URL__/content/images/msdn/2474.image_5F00_2F37EBD8.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/0160.image_5F00_thumb_5F00_3CA08F8F.png" alt="image" width="644" height="362" border="0" /></a></p>
<p><strong>6. Restart the FTP site for the changes to take effect</strong></p>
<p><a href="__GHOST_URL__/content/images/msdn/0647.image_5F00_398E319A.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/4212.image_5F00_thumb_5F00_5FF2A596.png" alt="image" width="644" height="363" border="0" /></a></p>
<p>And we are ready!</p>
<p><a href="__GHOST_URL__/content/images/msdn/5340.image_5F00_63935124.png"><img style="display: inline;" title="image" src="__GHOST_URL__/content/images/msdn/0334.image_5F00_thumb_5F00_757275A2.png" alt="image" width="644" height="221" border="0" /></a></p>
<h1>Closing</h1>
<p>Now I admit this was a rather lengthy post with some workarounds (to enable FTP for example), but the point is, Windows Azure is a very flexible platform and no matter what you are trying to run, you will find multiple ways to do it.</p>
<p>Since I spent sometime customizing this server, I can now <a href="http://www.windowsazure.com/en-us/manage/windows/how-to-guides/capture-an-image/"><strong>&quot;Capture&quot;</strong> it and make the image available for future provisioning</a>, meaning that when I want to create another WIMP server, I simply select it from the list and it is provisioned, preconfigured!<br />How cool is that?</p>
<p>To recap my disclaimer at the top, if you are simply hosting websites running on .NET, PHP, node.js or Python, you are most probably better of using Windows Azure Websites, as all the above is already handled for you. When it comes to the database and you prefer MySQL, you can either use ClearDB, which provide regular backups, redundancy, etc., or you might choose to create your own Windows/Linux server running MySQL, but beware that the management overhead is now on your shoulders.</p>
<p>In another couple of posts, I'll show you how to create a standalone MySQL server and use it with Windows Azure websites, how to create a WAMP server and how to create a LAMP server. The choice is yours!</p><blockquote class='note original-post'><div><p><strong>Note: </strong>This post originally appeared on my MSDN blog at 		<a href='http://blogs.msdn.com/b/africaapps/archive/2013/11/05/creating-a-wimp-stack-windows-server-iis-mysql-php-on-windows-azure.aspx'>http://blogs.msdn.com/b/africaapps/archive/20<!--kg-card-end: markdown-->
