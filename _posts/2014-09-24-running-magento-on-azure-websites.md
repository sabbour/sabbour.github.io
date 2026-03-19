---
layout: post
title: Running Magento on Azure Websites
date: 2014-09-24T10:10:59.000Z
tags:
  - azure
  - websites
  - magento
---

<!--kg-card-begin: markdown--><h1 id="introduction">Introduction</h1>
<p><a href="http://www.magento.com">Magento</a> is a powerful eCommerce system and in this post, we're going to explore installing Magento Community Edition on an Azure Website.</p>
<h2 id="createwebsite">Create website</h2>
<p>Login to the portal and create a new empty Azure website with a MySQL database. Note that you will most likely need to scale the website to at least Basic and the free MySQL database from ClearDB will run out of space.</p>
<h2 id="downloadmagento">Download Magento</h2>
<h3 id="option1">Option 1</h3>
<p>There are several ways you can do this. You can download the <a href="http://www.magentocommerce.com/wiki/1_-_installation_and_configuration/magento_installation_guide#installing_magento_using_the_full_release_package">Magento full release package</a> zip file to your computer, unzip and upload it but this will take a LOT of time since there are thousands of files to upload.</p>
<h3 id="option2">Option 2</h3>
<p>Another way would be to use the <a href="http://www.magentocommerce.com/wiki/1_-_installation_and_configuration/magento_installation_guide#installing_magento_using_the_downloader">Magento downloader</a>  then following the installation instructions.</p>
<h3 id="option3">Option 3</h3>
<p>A third option which I opted in-to, is to use the <a href="http://channel9.msdn.com/shows/azure-friday/what-is-kudu-azure-web-sites-deployment-with-david-ebbo">Kudu Diagnostic Console</a> that comes with every Azure Website to download Magento directly to my website and unzip it.</p>
<p>Open the console by going to <a href="http://yourwebsite.scm.azurewebsites.net/DebugConsole">http://yourwebsite.<strong>scm</strong>.azurewebsites.net/DebugConsole</a><br>
<img src="__GHOST_URL__/content/images/2014/Sep/1.PNG" alt="Debug Console" loading="lazy"></p>
<p>You will be presented with this nice pseudo-console where you can do some neat stuff.</p>
<h4 id="download">Download</h4>
<p>Navigate to <code>home\site\wwwroot</code> and download Magento by doing a <code>curl -o magento.zip http://www.magentocommerce.com/downloads/assets/1.9.0.1/magento-1.9.0.1.tar.gz</code><br>
optionally, also download the sample data<br>
<code>curl -o sampledata.zip http://www.magentocommerce.com/downloads/assets/1.9.0.0/magento-sample-data-1.9.0.0.zip</code></p>
<h4 id="unzipmagento">Unzip Magento</h4>
<p><code>unzip magento.zip</code> and grab a coffee, this will take a while.</p>
<h4 id="installthesampledata">Install the sample data</h4>
<p>Extract the sample data <code>unzip sampledata.zip</code></p>
<p>Copy the <code>magento-sample-data-1.9.0.0\media</code> folder into the <code>magento</code> folder then additionally copy the <code>magento-sample-data-1.9.0.0\skin</code> folder into <code>magento</code> folder.</p>
<p><code>cp -r magento-sample-data-1.9.0.0\media magento cp -r magento-sample-data-1.9.0.0\skin magento</code></p>
<h4 id="importthesampledatabasedata">Import the sample database data</h4>
<p>Connect to your MySQL instance (in my case, this was running on ClearDB) and run the sample script to insert data into the database<br>
<code>mysql --user=yourMysqlUsername --password=yourMysqlPassword -=host=yourMysqlHost yourDatabaseName &lt; magento-sample-data-1.9.0.0\magento_sample_data_for_1.9.0.0.sql</code></p>
<h2 id="runinstallationwizard">Run Installation Wizard</h2>
<p>After completing the above steps, open <a href="http://yourwebsite.azurewebsites.net/magento/">http://yourwebsite.azurewebsites.net/magento/</a> in a browser window where you will be presented with the Magento Installation Wizard<br>
<img src="__GHOST_URL__/content/images/2014/Sep/2.PNG" alt="Magento Installation Wizard" loading="lazy"></p>
<h3 id="configuredatabaseconnection">Configure database connection</h3>
<p><img src="__GHOST_URL__/content/images/2014/Sep/3.PNG" alt="MySQL configuration" loading="lazy"></p>
<h3 id="enablewebconfigbasedurlrewriting">Enable Web.config based URL Rewriting</h3>
<p>Using your favorite text editor, create a Web.config file with the content below</p>
<script src="https://gist.github.com/sabbour/e49b3ac9e1438c93d5fb.js"></script>
<p>then upload it to the root of your website (wwwroot).</p>
<h1 id="done">Done</h1>
<p>You have now installed Magento on Azure Websites!<br>
<img src="__GHOST_URL__/content/images/2014/Sep/4.PNG" alt="Frontend" loading="lazy"><br>
<img src="__GHOST_URL__/content/images/2014/Sep/5.PNG" alt="Backend" loading="lazy"></p>
<!--kg-card-end: markdown-->
