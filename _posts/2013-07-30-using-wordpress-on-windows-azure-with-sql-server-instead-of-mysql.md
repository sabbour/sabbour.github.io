---
layout: post
title: Using WordPress on Windows Azure with SQL Server instead of MySQL
date: 2013-07-30T04:08:00.000Z
tags:
  - mysql
  - windows azure
  - wordpress
---

<!--kg-card-begin: markdown--><h1>Introduction</h1>
<p>Creating a WordPress based site on Windows Azure is already pretty trivial, you can very easily select WordPress from the gallery when creating an Azure Website.</p>
<p>The problem is, by default, Wordpress works with MySQL, which means for you that you will either need to get a database from ClearDB, which is more expensive and isn't included in say, your BizSpark $150 monthly credit allowance; or you need to create a Virtual Machine and install MySQL on it which would cost you more than you need.</p>
<p>It is much more cost effective and manageable to use SQL Server as a Service, which is managed for you and you can use your BizSpark credits against.</p>
<p>We'll be using a database abstraction plugin for WordPress that allows the blog engine to use a SQL server as a database.</p>
<h1>Overview</h1>
<p>What we'll need to do is:</p>
<ol>
<li>Install WordPress from the gallery</li>
<li>Download the <a href="http://wordpress.org/plugins/wordpress-database-abstraction/" target="_blank">WP DB Abstraction plugin</a> and extract it locally</li>
<li>Modify a file to fix a bug in the plugin (I know, sorry!)</li>
<li>Create a SQL Database on Windows Azure</li>
<li>Connect to the website using FTP and delete the wp-config.php that comes with the installation</li>
<li>Upload the plugin</li>
<li>Configure the plugin to use our SQL Server</li>
<li>Install WordPress regularly</li>
<li>(Optional) Enable Url Rewrite for friendly links</li>
</ol>
<p>I'm assuming this is a new WordPress installation. What I won't be covering in this post is how to migrate your data from your old WordPress installation to the new one. There are a lot of tutorials to do that already.</p>
<p> </p>
<h1>Details</h1>
<h2>Installing WordPress from the gallery</h2>
<p><a href="/content/images/msdn/1854.image_5F00_0A201B30.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/2781.image_5F00_thumb_5F00_0E0A1D68.png" alt="image" width="644" height="425" border="0" /></a></p>
<p>When creating the site, choose to create a new MySQL database, it doesn't matter as we won't be using it anyway. Delete it later.</p>
<h2>Downloading (and fixing) the plugin</h2>
<p>Go to the <a href="http://wordpress.org/plugins/wordpress-database-abstraction/" target="_blank">WP DB Abstraction plugin</a> website, download the zip file and extract it somewhere on your computer. From the folder you unzipped, open up <strong>\wp-db-abstraction\translations\sqlsrv\translations.php</strong></p>
<p>In<strong> </strong>line <strong>740</strong>, change:    </p>
<pre class="csharpcode">elseif ( count($limit_matches) == 5 &amp;&amp; $limit_matches[1] == <span class="str">'0'</span>)</pre>
<p>to</p>
<pre class="csharpcode">elseif ( count($limit_matches) &gt;= 5 &amp;&amp; $limit_matches[1] == <span class="str">'0'</span> )</pre>
<h2>Create a Windows Azure SQL Database</h2>
<p>On the portal, create a new database/server in the same region you created the website and take note of: <br /><strong>the username</strong> and <strong>password</strong> you specified as well as the <strong>database server hostname</strong> and the <strong>database name</strong>.</p>
<p><a href="/content/images/msdn/7317.image_5F00_2E150458.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/0815.image_5F00_thumb_5F00_39CA4B8A.png" alt="image" width="644" height="295" border="0" /></a></p>
<h2>Installing the plugin</h2>
<p>We'll be uploading couple of files using FTP to install the plugin.</p>
<p>First, if you haven't created FTP deployment credentials, go to your website Quick Start (that little blue cloud with a thunderbolt <img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/2728.image_5F00_30FA433E.png" alt="image" width="33" height="27" border="0" />) and click on "Set deployment credentials" to create a username and password that you'll use with FTP.</p>
<p>After that is done, go to the Dashboard and take note of the FTP hostname and your deployment username.</p>
<p><a href="/content/images/msdn/3364.image_5F00_38758CDE.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/2727.image_5F00_thumb_5F00_76FADA84.png" alt="image" width="288" height="453" border="0" /></a></p>
<p>Now using your favorite FTP client (or Windows File Explorer) connect to the website using that FTP host name and FTP username and password you specified earlier.</p>
<ol>
<li>Navigate to<strong> "site/wwwroot"</strong> and <strong>delete wp-config.php. </strong>This is a VERY IMPORTANT step, otherwise you'll keep getting 500 Internal Server Error in the next step.</li>
<li>Navigate to <strong>"site/wwwroot/wp-content"</strong> and create a <strong>mu-plugins</strong> folder.</li>
<li>From the plugin folder you extracted on your computer, copy <strong>wp-db-abstraction.php</strong> and the <strong>wp-db-abstraction</strong> directory to <strong>"site/wwwroot/wp-content/mu-plugins"</strong> folder on the FTP. <br />This is how your FTP structure would look like after that <br /><a href="/content/images/msdn/0434.image_5F00_3B1AF637.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/2783.image_5F00_thumb_5F00_2D388A6F.png" alt="image" width="644" height="137" border="0" /></a> </li>
<li>Finally, navigate back to <strong>"site/wwwroot/wp-content"</strong>  and from your extracted plugin folder, under the <strong>wp-db-abstraction</strong> directory, copy <strong>db.php</strong> into <strong>wp-content</strong>. <br /><a href="/content/images/msdn/1680.image_5F00_6B51A520.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/7418.image_5F00_thumb_5F00_4919999A.png" alt="image" width="644" height="108" border="0" /></a></li>
</ol>
<h2>Configuring the plugin</h2>
<ol>
<li>Now that the plugin is uploaded in place, open up its configuration URL: <br /><a href="http://[yourazurewebsite].azurewebsites.net/wp-content/mu-plugins/wp-db-abstraction/setup-config.php">http://[yourazurewebsite].azurewebsites.net/wp-content/mu-plugins/wp-db-abstraction/setup-config.php</a> <br /><a href="/content/images/msdn/7888.image_5F00_35200704.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/1447.image_5F00_thumb_5F00_5E672935.png" alt="image" width="583" height="484" border="0" /></a> </li>
<li>Enter the details of the database server and make sure you <strong>select PDO SqlSrv</strong> and <strong>not SQL Server using MS PHP Driver</strong> <br /><a href="/content/images/msdn/6457.image_5F00_5BDDF777.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/5775.image_5F00_thumb_5F00_69808DB2.png" alt="image" width="642" height="484" border="0" /></a> <br />Once this step is done, WordPress can communicate with your database, click on "Run the install" to run the regular WordPress installation</li>
</ol>
<p> </p>
<h2>Install WordPress</h2>
<p><br /><a href="/content/images/msdn/8867.image_5F00_13AC279C.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/2061.image_5F00_thumb_5F00_3C678CE5.png" alt="image" width="644" height="197" border="0" /></a> <br /><a href="/content/images/msdn/0714.image_5F00_3D5F7CC2.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/6457.image_5F00_thumb_5F00_517546F3.png" alt="image" width="642" height="549" border="0" /></a></p>
<p>Now your installation should be running fine and dandy. <br /><a href="/content/images/msdn/4834.image_5F00_2413B123.png"><img style="display: inline; background-image: none;" title="image" src="/content/images/msdn/8446.image_5F00_thumb_5F00_0B546413.png" alt="image" width="644" height="384" border="0" /></a></p>
<h2>Optional step, to enable URL Rewriting for pretty Permalinks without "index.php"</h2>
<p>Create a <strong>web.config</strong> file with the content below</p>
<pre class="csharpcode"><span class="kwrd">&lt;?</span><span class="html">xml</span> <span class="attr">version</span><span class="kwrd">=&quot;1.0&quot;</span> <span class="attr">encoding</span><span class="kwrd">=&quot;UTF-8&quot;</span>?<span class="kwrd">&gt;</span>  
<span class="kwrd">&lt;</span><span class="html">configuration</span><span class="kwrd">&gt;</span>  
    <span class="kwrd">&lt;</span><span class="html">system.webServer</span><span class="kwrd">&gt;</span>  
        <span class="kwrd">&lt;</span><span class="html">rewrite</span><span class="kwrd">&gt;</span>  
            <span class="kwrd">&lt;</span><span class="html">rules</span><span class="kwrd">&gt;</span>  
                <span class="kwrd">&lt;</span><span class="html">rule</span> <span class="attr">name</span><span class="kwrd">=&quot;wordpress&quot;</span> <span class="attr">patternSyntax</span><span class="kwrd">=&quot;Wildcard&quot;</span><span class="kwrd">&gt;</span>  
                    <span class="kwrd">&lt;</span><span class="html">match</span> <span class="attr">url</span><span class="kwrd">=&quot;*&quot;</span><span class="kwrd">/&gt;</span>  
                    <span class="kwrd">&lt;</span><span class="html">conditions</span><span class="kwrd">&gt;</span>  
                        <span class="kwrd">&lt;</span><span class="html">add</span> <span class="attr">input</span><span class="kwrd">=&quot;{REQUEST_FILENAME}&quot;</span> <span class="attr">matchType</span><span class="kwrd">=&quot;IsFile&quot;</span> <span class="attr">negate</span><span class="kwrd">=&quot;true&quot;</span><span class="kwrd">/&gt;</span>  
                        <span class="kwrd">&lt;</span><span class="html">add</span> <span class="attr">input</span><span class="kwrd">=&quot;{REQUEST_FILENAME}&quot;</span> <span class="attr">matchType</span><span class="kwrd">=&quot;IsDirectory&quot;</span> <span class="attr">negate</span><span class="kwrd">=&quot;true&quot;</span><span class="kwrd">/&gt;</span>  
                    <span class="kwrd">&lt;/</span><span class="html">conditions</span><span class="kwrd">&gt;</span>  
                    <span class="kwrd">&lt;</span><span class="html">action</span> <span class="attr">type</span><span class="kwrd">=&quot;Rewrite&quot;</span> <span class="attr">url</span><span class="kwrd">=&quot;index.php&quot;</span><span class="kwrd">/&gt;</span>  
                <span class="kwrd">&lt;/</span><span class="html">rule</span><span class="kwrd">&gt;</span>  
            <span class="kwrd">&lt;/</span><span class="html">rules</span><span class="kwrd">&gt;</span>  
        <span class="kwrd">&lt;/</span><span class="html">rewrite</span><span class="kwrd">&gt;</span>  
    <span class="kwrd">&lt;/</span><span class="html">system.webServer</span><span class="kwrd">&gt;</span>  
<span class="kwrd">&lt;/</span><span class="html">configuration</span><span class="kwrd">&gt;</span> </pre>
<p>And upload it to the root of the WordPress installation, ie: Under <strong>wwwroot</strong> folder</p>
<p>Make sure your WordPress Permalink settings do not contain "index.php"</p><blockquote class='note original-post'><div><p><strong>Note: </strong>This post originally appeared on my MSDN blog at 		<a href='http://blogs.msdn.com/b/africaapps/archive/2013/07/30/using-wordpress-on-windows-azure-with-sql-server-instead-of-mysql.aspx'>http://blogs.msdn.com/b/africaapps/archive/2013/07/30/using-wordpress-on-windows-azure-with-sql-server-instead-of-mysql.aspx</a></p></div></blockquote><!--kg-card-end: markdown-->
