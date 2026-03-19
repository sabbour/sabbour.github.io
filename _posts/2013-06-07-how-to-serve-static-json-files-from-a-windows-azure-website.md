---
layout: post
title: How to serve static .json files from a Windows Azure Website
date: 2013-06-07T01:50:00.000Z
tags:
  - windows azure websites
  - JSON
  - windows azure
---

<!--kg-card-begin: markdown--><p>If you upload a .json file to your Windows Azure website and try to access it, it would give you a 404 File Not Found error, because the MIME Type of .json is not set by default. This also applies in general to any file that might need a specific MIME Type.</p>  <p>To fix this issue, FTP into your website and upload the following Web.config file which will set the correct MIME types. If you already have a Web.config file in place, just add the below to the appropriate section.</p>  <pre>&lt;?xml version=&quot;1.0&quot;?&gt;
<p>&lt;configuration&gt;<br>
&lt;system.webServer&gt;<br>
&lt;staticContent&gt;<br>
&lt;mimeMap fileExtension=&quot;.json&quot; mimeType=&quot;application/json&quot; /&gt;<br>
&lt;/staticContent&gt;<br>
&lt;/system.webServer&gt;<br>
&lt;/configuration&gt; </pre></p>
<div id="scid:fb3a1972-4489-4e52-abe7-25a00bb07fdf:f1da289a-392a-40ab-89d4-0784647dc110" class="wlWriterEditableSmartContent" style="margin: 0px; padding: 0px; float: none; display: inline;"><p>Download <a href="__GHOST_URL__/content/images/msdn/1526_2E00_Web_5F00_16857C11_2E00_config" target="_blank">Web.config</a></p></div><blockquote class='note original-post'><div><p><strong>Note: </strong>This post originally appeared on my MSDN blog at 		<a href='http://blogs.msdn.com/b/africaapps/archive/2013/06/07/how-to-serve-static-json-files-from-a-windows-azure-website.aspx'>http://blogs.msdn.com/b/africaapps/archive/2013/06/07/how-to-serve-static-json-files-from-a-windows-azure-website.aspx</a></p></div></blockquote><!--kg-card-end: markdown-->
