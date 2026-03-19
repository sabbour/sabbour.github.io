---
layout: post
title: "Part 2: Creating a Composer enabled PHP website on Windows Azure with Git deployment"
date: 2014-01-28T07:57:00.000Z
tags:
  - php
  - git
  - azure
  - composer
  - websites
---

<!--kg-card-begin: markdown--><h1>Introduction</h1>
<p>This is part 2 of a 2 part blog post. <a href="__GHOST_URL__/part-1-creating-a-composer-enabled-php-website-on-windows-azure-with-git-deployment" target="_blank">Read part 1 here</a>.</p>
<p>So in part 1, we've created a local Symfony2 PHP website that uses Composer to manage its packages. In this part, we are going to create a Windows Azure Website, setup deployment from source control, and modify the Git post deployment script to automatically run run <strong>php composer.phar install</strong> after each commit.</p>
<p>Why would you want to do that you ask? Well, the vendors directory, where all the downloaded packages reside, can get quite large, and storing it in source control, and uploading it with your website is a waste of bandwidth.</p>
<h1>Creating the website</h1>
<p>I'm not going to go through the details here, as it is a well covered topic, I'll create the website on the portal, and choose to <strong>"Publish from source control"</strong></p>
<p><a href="__GHOST_URL__/content/images/msdn/4885.image_5F00_24942707.png"><img style="display: inline; background-image: none;" title="image" src="__GHOST_URL__/content/images/msdn/0552.image_5F00_thumb_5F00_61BA733D.png" alt="image" width="644" height="429" border="0" /></a></p>
<p>And then choose <strong>"Local Git repository"</strong></p>
<p><a href="__GHOST_URL__/content/images/msdn/2577.image_5F00_0509F894.png"><img style="display: inline; background-image: none;" title="image" src="__GHOST_URL__/content/images/msdn/3005.image_5F00_thumb_5F00_2F11A8CF.png" alt="image" width="644" height="429" border="0" /></a></p>
<p>Fire it up! Bam, 5 seconds, I have a website created.</p>
<h1>Create the local Git repo</h1>
<p>Go to the Deployments tab for the website, then follow the steps there to create a local repository on my machine and commit my files. I'll run the commands on Git Bash. <strong>Only commit the files locally, don't add the remote Windows Azure repository and push just yet!</strong></p>
<p><a href="__GHOST_URL__/content/images/msdn/4274.image_5F00_401AF814.png"><img style="display: inline; background-image: none;" title="image" src="__GHOST_URL__/content/images/msdn/2055.image_5F00_thumb_5F00_7B930927.png" alt="image" width="644" height="445" border="0" /></a></p>
<p>What we need to do now is to modify what happens whenever I commit files. Fortunatley, the great guys at the Windows Azure team have a tool called <a href="https://github.com/projectkudu/kudu" target="_blank">Kudu</a> which is basically responsible for deploying your code once you push it to a Git source control.</p>
<h1>Create the custom Kudo deployment script</h1>
<p>For this part, you will need to have the <a href="http://www.windowsazure.com/en-us/documentation/articles/xplat-cli/#install" target="_blank">Windows Azure Command Line Tools (CLI) installed</a>.</p>
<p>Once you have it installed, you can launch the <strong>Windows Azure Command Prompt</strong> that got installed (which you will find under C:\Program Files\Microsoft SDKs\Windows Azure\.NET SDK\v2.2 or whichever version the SDK is current at the time you read this)</p>
<p>If you type <strong>azure</strong> in that prompt, you will get all the commands that you can use. The command we are interested in is <strong>azure site</strong></p>
<p><a href="__GHOST_URL__/content/images/msdn/6114.image_5F00_65CE422C.png"><img style="display: inline; background-image: none;" title="image" src="__GHOST_URL__/content/images/msdn/7532.image_5F00_thumb_5F00_4BFC9CAE.png" alt="image" width="644" height="422" border="0" /></a></p>
<p>So <strong>change directory into our project location</strong> then run the following</p>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: 'Courier New', courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: #f4f4f4;">
<div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">azure site deploymentscript --php -t bash </pre>
<!--CRLF --></div>
</div>
<p>Which will generate a <strong>.deployment</strong> file and a <strong>deploy.sh</strong> file. This deploy.sh file is what is executed after each push we do on the Windows Azure Git repo.</p>
<h1>Customize the deploy.sh script to run composer</h1>
<p>Open <strong>deploy.sh</strong> in your favorite editor</p>
<h3>Add the below before the <strong>Deployment</strong> section</h3>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: 'Courier New', courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: #f4f4f4;">
<div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;"><!--CRLF --><!--CRLF --><!--CRLF --><!--CRLF --><!--CRLF --><!--CRLF --><!--CRLF --><!--CRLF --><!--CRLF --><!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;"><span style="color: #008000;">##################################################################################################################################</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;"><span style="color: #008000;"># Download Composer</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;"><span style="color: #008000;"># ----------</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">echo Downloading Composer</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">curl -sS https://getcomposer.org/installer | php</pre>
<!--CRLF --></div>
</div>
<h3><strong>Add the below after the Deployment section</strong></h3>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: 'Courier New', courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: #f4f4f4;">
<div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;"><span style="color: #008000;">##################################################################################################################################</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;"><span style="color: #008000;"># Dependency install</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;"><span style="color: #008000;"># ----------</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;"> </pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;"><span style="color: #008000;"># Invoke Composer in the deployment directory</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">echo Invoking composer install <span style="color: #0000ff;">in</span> deployment directory $DEPLOYMENT_TARGET</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">php -d extension<span class="o">=</span>php_intl.dll $DEPLOYMENT_TARGET/composer.phar install -v --prefer-dist --no-dev --optimize-autoloader --no-interaction</pre>
<!--CRLF --></div>
</div>
<p><strong></strong> </p>
<h1>Commit the newly added files to your local repository</h1>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: 'Courier New', courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: #f4f4f4;">
<div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">git add ---all</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">git commit -m <span style="color: #006080;">&quot;added deployment scripts&quot;</span></pre>
<!--CRLF --></div>
</div>
<h1>Add the remote Windows Azure repository and push to it</h1>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: 'Courier New', courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: #f4f4f4;">
<div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">git remote add azure https://sabbour@symfonycomposer.scm.azurewebsites.net:443/symfonycomposer.git</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">git push azure master</pre>
<!--CRLF --></div>
</div>
<h1>You're done</h1>
<p>You'll see that I've only pushed 270KB and on the server, the composer script kicked in and started downloading all the dependencies without using my bandwidth. Talk about efficiency!</p>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: 'Courier New', courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: #f4f4f4;">
<div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">Counting objects: 168, done.</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">Delta compression using up to 8 threads.</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">Compressing objects: 100% (153/153), done.</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">Writing objects: 100% (168/168), 269.25 KiB | 0 bytes/s, done.</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">Total 168 (delta 48), reused 0 (delta 0)</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;"> </pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote: Updating branch <span style="color: #006080;">'master'</span>.</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: Updating submodules.</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote: Preparing deployment <span style="color: #0000ff;">for</span> commit id <span style="color: #006080;">'623af14f72'</span>.</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: Running custom deployment command...</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote: Running deployment command...</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: Using php.ini from: C:/DWASFiles/Sites/symfonycomposer/Config/PHP-5.4.9/php.ini</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote: Downloading Composer</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: <span style="color: #008000;">#!/usr/bin/env php</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote: All settings correct <span style="color: #0000ff;">for</span> using Composer</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: Downloading...</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote:</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: Composer successfully installed to: D:\home\site\repository\composer.phar</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote: Use it: php composer.phar</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: Handling Basic Web Site deployment.</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote: KuduSync.NET from: <span style="color: #006080;">'D:\home\site\repository'</span> to: <span style="color: #006080;">'D:\home\site\wwwroot'</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: Copying file: <span style="color: #006080;">'.gitignore'</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;"> </pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">----- [ REMOVED FOR BREVITY ] -----</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;"> </pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: Copying file: <span style="color: #006080;">'src\Acme\DemoBundle\Resources\public\images\welcome-demo.gif'</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote: Omitting next output lines...</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: Invoking composer install <span style="color: #0000ff;">in</span> D:\home\site\wwwroot</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote: Loading composer repositories with package information</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: Installing dependencies from lock file</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote: Warning: The lock file is not up to date with the latest changes <span style="color: #0000ff;">in</span> comp</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">oser.json. You may be getting outdated dependencies. Run update to update them.</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote:   - Installing doctrine/lexer (v1.0)</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote:     Downloading: 100%</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote:     Extracting archive</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;"> </pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">----- [ REMOVED FOR BREVITY ] -----</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;"> </pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote:   - Installing twig/extensions (v1.0.1)</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote:     Downloading: 100%</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote:     Extracting archive</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;"> </pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">----- [ REMOVED FOR BREVITY ] -----</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;"> </pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote: Generating optimized autoload files</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: ........................................................................</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">..........................................</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: Creating the <span style="color: #006080;">&quot;app/config/parameters.yml&quot;</span> file</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote: ..........</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: Clearing the cache <span style="color: #0000ff;">for</span> the dev environment with debug true</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote: ..........</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: Installing assets using the hard copy option</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote: Installing assets <span style="color: #0000ff;">for</span> Symfony\Bundle\FrameworkBundle into web/bundles/fr</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">amework</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote: Installing assets <span style="color: #0000ff;">for</span> Acme\DemoBundle into web/bundles/acmedemo</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: Installing assets <span style="color: #0000ff;">for</span> Sensio\Bundle\DistributionBundle into web/bundles/</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">sensiodistribution</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;"> </pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">remote: Finished successfully.</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">remote: Deployment successful.</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">To https://sabbour@symfonycomposer.scm.azurewebsites.net:443/symfonycomposer.git</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;"> </pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;"> * [new branch]      master -&gt; master</pre>
<!--CRLF --></div>
</div>
<h1>Next steps</h1>
<p>You need to take care of some things when migrating from an Apache based installation to an IIS based installation (like Windows Azure Websites). For example, IIS uses Web.config (in contrast to Apache's .htaccess) to configure stuff, like URL Rewriting.</p>
<p>You may use these excellent posts to understand how to <a href="http://www.iis.net/learn/application-frameworks/install-and-configure-php-applications-on-iis/translate-htaccess-content-to-iis-webconfig">translate .htaccess content to Web.config</a> and if you are running Windows, you can even use a<a href="http://www.iis.net/learn/extensions/url-rewrite-module/importing-apache-modrewrite-rules"> tool provided inside IIS Manager to do the conversion for you</a>.</p><blockquote class='note original-post'><div><p><strong>Note: </strong>This post originally appeared on my MSDN blog at 		<a href='http://blogs.msdn.com/b/africaapps/archive/2014/01/28/part-2-creating-a-composer-enabled-php-website-on-windows-azure-with-git-deployment.aspx'>http://blogs.msdn.com/b/africaapps/archive/2014/01/28/part-2-creating-a-composer-enabled-php-website-on-windows-azure-with-git-deployment.aspx</a></p></div></blockquote><!--kg-card-end: markdown-->
