---
layout: post
title: Creating a LAMP Stack (Linux, Apache, MySQL, PHP) using tasksel on Windows Azure
date: 2013-11-13T08:20:00.000Z
tags:
  - php
  - linux
  - mysql
  - apache
  - ubuntu
  - azure
  - lamp
  - virtual machines
---

<!--kg-card-begin: markdown--><h1>Introduction</h1>  <p>I’ve covered in my previous post how to create a <a href="__GHOST_URL__/creating-a-lamp-stack-linux-apache-mysql-php-on-windows-azure" target="_blank">LAMP stack on Windows Azure using the BitNami provided image</a>. In this post, I’ll alternatively create the lamp stack using Ubuntu’s <strong>tasksel</strong>, which gives me a more “traditional” barebones setup than the once enforced by the BitNami images.</p>  <h1>Let’s start</h1>  <h2>Provision the machine</h2>  <p>Create a new Virtual Machine, I’ll choose a spanking new Ubuntu 13.10</p>  <p><a href="__GHOST_URL__/content/images/msdn/4431.image_5F00_7EB19F81.png"><img title="image" style="display: inline; background-image: none;" border="0" alt="image" src="__GHOST_URL__/content/images/msdn/7522.image_5F00_thumb_5F00_428AF53B.png" width="644" height="410" /></a></p>  <p>Open the HTTP port 80 in the load balancer to allow web access</p>  <p><a href="__GHOST_URL__/content/images/msdn/7573.image_5F00_5B1D233C.png"><img title="image" style="display: inline; background-image: none;" border="0" alt="image" src="__GHOST_URL__/content/images/msdn/3644.image_5F00_thumb_5F00_01156444.png" width="644" height="410" /></a></p>  <p>Provision the server (should take about 10 minutes).</p>  <h2>Install the required software</h2>  <p>SSH into the new machine using <a href="http://aka.ms/putty" target="_blank">PuTTy</a> and run apt-get update</p>  <div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: rgb(244, 244, 244);">   <div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);">     <pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">sudo apt-get update</pre>
<!--CRLF --></div>
</div>
<h3>Install the Ubuntu LAMP stack using Tasksel</h3>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: rgb(244, 244, 244);">
  <div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);">
    <pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">sudo apt-get install tasksel</pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);&quot;&gt;sudo tasksel install lamp-server&lt;/pre&gt;
</code></pre>
<!--CRLF --></div>
</div>
<p>Go through the wizard and choose your <strong>MySQL root password</strong></p>
<p><a href="__GHOST_URL__/content/images/msdn/5165.image_5F00_3DCCECD4.png"><img title="image" style="display: inline; background-image: none;" border="0" alt="image" src="__GHOST_URL__/content/images/msdn/3554.image_5F00_thumb_5F00_50184447.png" width="644" height="389" /></a></p>
<p><a href="__GHOST_URL__/content/images/msdn/5633.image_5F00_5AD82C4D.png"><img title="image" style="display: inline; background-image: none;" border="0" alt="image" src="__GHOST_URL__/content/images/msdn/4527.image_5F00_thumb_5F00_2EBB2F5C.png" width="644" height="393" /></a></p>
<p>After the wizard is done, if you browse to <a href="http://lampstack3.cloudapp.net">http://lampstack3.cloudapp.net</a> you should be presented with a page like the below</p>
<p><a href="__GHOST_URL__/content/images/msdn/1738.image_5F00_4E6C99D5.png"><img title="image" style="display: inline; background-image: none;" border="0" alt="image" src="__GHOST_URL__/content/images/msdn/7853.image_5F00_thumb_5F00_6938BFE1.png" width="644" height="182" /></a></p>
<h3>Install phpmyadmin</h3>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: rgb(244, 244, 244);">
  <div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);">
    <pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">sudo apt-get install phpmyadmin</pre>
<!--CRLF --></div>
</div>
<p>Go through the wizard</p>
<p><a href="__GHOST_URL__/content/images/msdn/1033.image_5F00_342EC162.png"><img title="image" style="display: inline; background-image: none;" border="0" alt="image" src="__GHOST_URL__/content/images/msdn/8037.image_5F00_thumb_5F00_0CF708DE.png" width="644" height="389" /></a></p>
<p>Then enter the MySQL root password</p>
<p><a href="__GHOST_URL__/content/images/msdn/2117.image_5F00_69C99E2B.png"><img title="image" style="display: inline; background-image: none;" border="0" alt="image" src="__GHOST_URL__/content/images/msdn/0312.image_5F00_thumb_5F00_352BD2A1.png" width="644" height="390" /></a></p>
<p>Then define a password for the phpMyAdmin application</p>
<p><a href="__GHOST_URL__/content/images/msdn/1325.image_5F00_11FE67EF.png"><img title="image" style="display: inline; background-image: none;" border="0" alt="image" src="__GHOST_URL__/content/images/msdn/5008.image_5F00_thumb_5F00_486F19F1.png" width="644" height="392" /></a></p>
<p>After phpmyadmin is installed, you need to add its configuration in the <strong>apache2.conf</strong> to be able to access it at <a href="http://lampstack3.cloudapp.net/phpmyadmin">http://lampstack3.cloudapp.net/phpmyadmin</a></p>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: rgb(244, 244, 244);">
  <div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);">
    <pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">sudo nano /etc/apache2/apache2.conf</pre>
<!--CRLF --></div>
</div>
<p>And add the following line at the very end</p>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: rgb(244, 244, 244);">
  <div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);">
    <pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">Include /etc/phpmyadmin/apache.conf</pre>
<!--CRLF --></div>
</div>
<p>Then exit and save (CTRL+X then Y)</p>
<p>Restart apache</p>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: rgb(244, 244, 244);">
  <div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);">
    <pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">sudo /etc/init.d/apache2 restart</pre>
<!--CRLF --></div>
</div>
<h3></h3>
<h3>Accessing the webserver files</h3>
<p>The root of the webserver is located at <strong>/var/www. </strong>You need to change the ownership of that folder from root to the username you used when provisioning the machine (ex: azureuser)</p>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: rgb(244, 244, 244);">
  <div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);">
    <pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">sudo chown azureuser /<span style="color: rgb(0, 0, 255);">var</span>/www</pre>
<!--CRLF --></div>
</div>
<p>Use any SFTP client (ex: <a href="https://filezilla-project.org/download.php?type=client" target="_blank">FileZilla</a>) to connect to lampstack3.cloudapp.net and navigate to <strong>/var/www</strong> to publish your site.</p>
<p><a href="__GHOST_URL__/content/images/msdn/1321.image_5F00_3380282F.png"><img title="image" style="display: inline; background-image: none;" border="0" alt="image" src="__GHOST_URL__/content/images/msdn/6866.image_5F00_thumb_5F00_1052BD7D.png" width="644" height="330" /></a></p><blockquote class='note original-post'><div><p><strong>Note: </strong>This post originally appeared on my MSDN blog at 		<a href='http://blogs.msdn.com/b/africaapps/archive/2013/11/13/creating-a-lamp-stack-linux-apache-mysql-php-using-tasksel-on-windows-azure.aspx'>http://blogs.msdn.com/b/africaapps/archive/2013/11/13/creating-a-lamp-stack-<!--kg-card-end: markdown-->
