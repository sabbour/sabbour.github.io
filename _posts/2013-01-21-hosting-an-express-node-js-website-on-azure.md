---
layout: post
title: Hosting an Express Node.js website on Azure
date: 2013-01-21T23:13:00.000Z
tags:
  - node.js
  - node
  - windows azure websites
  - opensource
  - open source
  - nodejs
  - windows azure
  - azure
  - express
  - website
---

<!--kg-card-begin: markdown--><pre><span style="font-family: verdana, geneva;"><em><span style="color: #888888;">I'm writing this post from Kenya, where I'm presenting Windows Azure this week at the <a title="#MSKenCamp" href="https://twitter.com/search/realtime?q=%23MSKenCamp&amp;src=hash">#MSKenCamp</a>. Be sure to follow the hashtag and <a title="@AfricaApps" href="__GHOST_URL__/africaapps">@AfricaApps</a> for updates on our whereabouts.</span></em></span></pre>
<h2>Introduction</h2>
<p>In this post, we are going to deploy an <a title="Express  " href="http://expressjs.com/">Express</a> Node.js on Windows Azure websites using GIT, and we're going to do that using Windows Azure command line tools, just for fun. Note that these steps might appear to be long cause we're going to go through a lot of things that you will only need to setup once. After that, publishing would be a breeze.</p>
<h2>Getting started and setting up the prerequisites</h2>
<p>If you don't have Node installed, go ahead and <a title="install it from a package" href="https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager">install it from a package</a>.<br /> <br />Windows Azure command line tools are conveniently written in Node.js, and if you haven't done so already, you can install it by launching a Node command prompt and doing an:</p>
<pre class="scroll"><code class="cplusplus">npm install -g azure-cli</code></pre>
<p><br />When the installation is done, you are ready to start.<br /> <br />We need to download your Windows Azure publish settings so that the Windows Azure command line tools know how to authenticate with your account. You can do so by typing the command below in a Node.js command prompt:</p>
<pre class="scroll"><code class="cplusplus">azure account download</code></pre>
<p><br />This will open your default browser and prompt you to sign in to the Management Portal. After signing in, your .publishsettings file will be downloaded. Make note of where this file is saved.<br /> <br />Next, import the .publishsettings file by running the following command, replacing &lt;path to .publishsettings file&gt; with the path to your .publishsettings file:</p>
<pre class="scroll"><code class="cplusplus">azure account import &lt;path to .publishsettings file&gt;</code></pre>
<p><br />After importing your publish settings, you should delete the .publishsettings file for security reasons.<br />You are now ready to being creating and managing Windows Azure Websites and Windows Azure Virtual Machines.</p>
<h2>Create the website structure locally, and on Azure</h2>
<p>Now that you've setup the environment, let's use the Windows Azure command line tools to actually create a our website on the Windows Azure platform as well as create a GIT folder for it.<br /> <br />For this part, we will be using the GIT command prompt so that the GIT environment variables are ready.<br /> <br />Let's create the website shall we?<br /> <br />Create a folder to store the local files, and change directory into it</p>
<pre class="scroll"><code class="cplusplus">mkdir helloazureexpress<br />cd helloazureexpress</code></pre>
<p><br />Using this command we will create the website on Azure, and create a local folder for it on our computer which will be the base for a local GIT repository.</p>
<pre class="scroll"><code class="cplusplus">azure site create helloazureexpress --git</code></pre>
<p><a href="/content/images/msdn/3441.azurecreate.PNG"><img src="/content/images/msdn/3441.azurecreate.PNG" alt="" border="0" /></a></p>
<p><br />Now the website has been created on Azure, and a local GIT repository has been created as well.</p>
<h2>Install Express</h2>
<p>We'll be following the Express installation instructions from the official guide.<br /> <br />Now let's install Express globally<br />npm install -g express</p>
<h2>Create a website using Express</h2>
<p>Now that Express is installed, let's go ahead and use it to generate a website<br /> <br />Supposing you are now in the helloazureexpress folder, go up one level</p>
<pre class="scroll"><code class="cplusplus">cd ..</code></pre>
<p><br />Then it is time to generate it</p>
<pre class="scroll"><code class="cplusplus">express helloazureexpress</code></pre>
<p><a href="/content/images/msdn/8154.azureexpresssite.PNG"><img src="/content/images/msdn/8154.azureexpresssite.PNG" alt="" border="0" /></a></p>
<p><br />Add the generated files to GIT and commit them</p>
<pre class="scroll"><code class="cplusplus">cd helloazureexpress<br />git commit -m &quot;initial commit&quot;</code></pre>
<p><br />Install the app and any dependencies</p>
<pre class="scroll"><code class="cplusplus">npm install</code></pre>
<p><br />Run locally, express would start on the local PC</p>
<pre class="scroll"><code class="cplusplus">node app</code></pre>
<p><a href="/content/images/msdn/0652.azureexpressrun.PNG"><img src="/content/images/msdn/0652.azureexpressrun.PNG" alt="" border="0" /></a></p>
<p><br />Now if you open this<a title="  http://localhost:3000" href="http://localhost:3000"> http://localhost:3000</a> you'll find your Express site running</p>
<p><a href="/content/images/msdn/3302.azureexpressrun2.PNG"><img src="/content/images/msdn/3302.azureexpressrun2.PNG" alt="" border="0" /></a></p>
<h2><br />Commit changes to your Windows Azure GIT repository</h2>
<p><br />So now the application all running and dandy on your local host, it is time to take it up to the cloud.<br /> <br />Now, all we have to do is push the changes</p>
<pre class="scroll"><code class="cplusplus">git push azure master</code></pre>
<p><br />We're done! The Express Node.js website has been deployed on Azure<br /> <br /> <a href="/content/images/msdn/3122.azureexpressrunremote.PNG"><img src="/content/images/msdn/3122.azureexpressrunremote.PNG" alt="" border="0" /></a><br /><br /></p><blockquote class='note original-post'><div><p><strong>Note: </strong>This post originally appeared on my MSDN blog at 		<a href='http://blogs.msdn.com/b/africaapps/archive/2013/01/22/hosting-an-express-node-js-website-on-azure.aspx'>http://blogs.msdn.com/b/africaapps/archive/2013/01/22/hosting-an-express-node-js-website-on-azure.aspx</a></p></div></blockquote><!--kg-card-end: markdown-->
