---
layout: post
title: "blobify.js: a jQuery plugin for uploading stuff to Azure Blob Storage"
date: 2014-09-10T13:06:28.000Z
---

<!--kg-card-begin: markdown--><p>Some intro text paragraph on why I did this and a link to the source-code available on <a href="https://github.com/sabbour/blobify.js">https://github.com/sabbour/blobify.js</a></p>
<h1 id="jqueryandazureyousay">jQuery and Azure you say?</h1>
<p>Some text about why the idea for this plugin came into effect, and why it is a good idea, and a diagram for the architecture of how the thing works.</p>
<h1 id="bitsandpieces">Bits and pieces</h1>
<p>Breakdown of the components of the solution. In the sections below, I'm going to break it down into Azure specific bits and jQuery plugin specific bits.</p>
<h2 id="azurespecific">Azure specific</h2>
<h3 id="creatingthesharedaccesssignaturesas">Creating the Shared Access Signature (SAS)</h3>
<h3 id="fetchingthesas">Fetching the SAS</h3>
<h3 id="slicingthefile">Slicing the file</h3>
<h3 id="uploadingablock">Uploading a block</h3>
<h3 id="committingtheblocks">Committing the blocks</h3>
<h2 id="jquerypluginspecific">jQuery plugin specific</h2>
<h3 id="dependencies">Dependencies</h3>
<ul>
<li><a href="http://jquery.com">jQuery</a></li>
<li><a href="http://jqueryui.com/download/#!version=1.11.1&amp;components=1100000000000000000000000000000000000">jQuery UI Core + Widget</a></li>
<li><a href="https://github.com/caolan/async">async.js</a></li>
<li><a href="http://handlebarsjs.com/">Handlebars.js</a></li>
<li><a href="http://getbootstrap.com/">Bootstrap</a></li>
</ul>
<h3 id="creatingtheplugin">Creating the plugin</h3>
<h3 id="templates">Templates</h3>
<h3 id="runningtheplugin">Running the plugin</h3>
<h1 id="tyingitallup">Tying it all up</h1>
<p>[HTML code sample from Gist]</p>
<h1 id="awordofwarning">A word of warning</h1>
<p>The plugin and the controller code will allow anyone to upload files of unlimited size into any container name. Additionally, it doesn't account for uploading a file with the same name as a blob already in the container, hence, overwriting it.<br>
In a production environment, you will probably need to restrict access to the controller, restrict the creation of arbitrary containers and ensure there is a logic to avoid overwriting existing blobs in the container.</p>
<!--kg-card-end: markdown-->
