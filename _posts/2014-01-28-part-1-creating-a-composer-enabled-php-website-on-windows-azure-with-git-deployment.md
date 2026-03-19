---
layout: post
title: "Part 1: Creating a Composer enabled PHP website on Windows Azure with Git deployment"
date: 2014-01-28T07:51:00.000Z
tags:
  - php
  - azure
  - composer
  - websites
---

<!--kg-card-begin: markdown--><h1>Introduction</h1>
<p><a href="__GHOST_URL__/content/images/msdn/6371.wa_5F00_git_5F00_comp_5F00_62C5980C.jpg"><img style="border: 0px currentcolor; margin-right: 0px; margin-left: 0px; float: right; display: inline; background-image: none;" title="wa_git_comp" src="__GHOST_URL__/content/images/msdn/4152.wa_5F00_git_5F00_comp_5F00_thumb_5F00_3CF2025A.jpg" alt="wa_git_comp" width="601" height="186" align="right" border="0" /></a></p>
<p>There is no doubt that <a href="https://getcomposer.org/" target="_blank">Composer</a> is a really cool dependency manager for PHP, sort of like <a href="https://www.nuget.org/" target="_blank">NuGet</a> for ASP.net, <a href="https://npmjs.org/" target="_blank">npm</a> for Node.js and <a href="http://rubygems.org/" target="_blank">gems</a> for Ruby.  It makes the deployment process of libraries that much easier.</p>
<p>Composer is basically a PHP script that you provide with a json file with the your dependencies, and run with</p>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: 'Courier New', courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: #f4f4f4;">
<div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">php composer.phar install</pre>
<!--CRLF --></div>
</div>
<p>In this post, I'll take you quickly on what you need to do in order to deploy your PHP website using Git, and setup the deployment process to execute the above command upon each commit. And we will do this on a Windows Azure Website.</p>
<h1>Installing Composer locally</h1>
<p>I'm going to assume you already have <a href="http://msysgit.github.io/" target="_blank">Git tools installed</a>, so I'll use Git Bash in order to perform the next commands</p>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: 'Courier New', courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: #f4f4f4;">
<div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">cd ProjectsRoot</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">curl -s http://getcomposer.org/installer | php</pre>
<!--CRLF --></div>
</div>
<p>Just doing the above will install composer into the "Projects" directory</p>
<p><a href="__GHOST_URL__/content/images/msdn/7245.image_5F00_7BE613A6.png"><img style="display: inline; background-image: none;" title="image" src="__GHOST_URL__/content/images/msdn/5164.image_5F00_thumb_5F00_5271D266.png" alt="image" width="644" height="380" border="0" /></a></p>
<p>Confirm Composer in installed by running the below</p>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: 'Courier New', courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: #f4f4f4;">
<div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">php composer.phar</pre>
<!--CRLF --></div>
</div>
<p>You should get an output like this</p>
<p><a href="__GHOST_URL__/content/images/msdn/0333.image_5F00_4435EA27.png"><img style="display: inline; background-image: none;" title="image" src="__GHOST_URL__/content/images/msdn/8130.image_5F00_thumb_5F00_4F620522.png" alt="image" width="644" height="380" border="0" /></a></p>
<h1>Using Composer for something useful. Installing Symfony2</h1>
<p>Now to demonstrate the power and versatility of Composer, let's install the <a href="http://symfony.com" target="_blank">Symfony2 PHP framework</a> using Composer by executing this command in our Projects (usually this is our webserver's htdocs, wwwroot or similar) which will create a new Symfony project in the "MySymfonyProject" folder using Symfony version 2.4.1</p>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: 'Courier New', courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: #f4f4f4;">
<div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">php composer.phar create-project symfony/framework-standard-edition MySymfonyProject 2.4.1</pre>
<!--CRLF --></div>
</div>
<p>Composer will crunch away for a while downloading Symfony and its dependencies</p>
<p><a href="__GHOST_URL__/content/images/msdn/6825.image_5F00_32E7A3F3.png"><img style="display: inline; background-image: none;" title="image" src="__GHOST_URL__/content/images/msdn/4336.image_5F00_thumb_5F00_26E84470.png" alt="image" width="644" height="380" border="0" /></a></p>
<p>Once it is done you will be left with the below directory structure for your project</p>
<p><a href="__GHOST_URL__/content/images/msdn/8484.image_5F00_0663956F.png"><img style="display: inline; background-image: none;" title="image" src="__GHOST_URL__/content/images/msdn/6278.image_5F00_thumb_5F00_0114AEBE.png" alt="image" width="166" height="429" border="0" /></a></p>
<p>Let's take a look at the <strong>composer.json</strong> file</p>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: 'Courier New', courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: #f4f4f4;">
<div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">{</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">    <span style="color: #006080;">&quot;name&quot;</span>: <span style="color: #006080;">&quot;symfony/framework-standard-edition&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">    <span style="color: #006080;">&quot;license&quot;</span>: <span style="color: #006080;">&quot;MIT&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">    <span style="color: #006080;">&quot;type&quot;</span>: <span style="color: #006080;">&quot;project&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">    <span style="color: #006080;">&quot;description&quot;</span>: <span style="color: #006080;">&quot;The \&quot;Symfony Standard Edition\&quot; distribution&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">    <span style="color: #006080;">&quot;autoload&quot;</span>: {</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">        <span style="color: #006080;">&quot;psr-0&quot;</span>: { <span style="color: #006080;">&quot;&quot;</span>: <span style="color: #006080;">&quot;src/&quot;</span> }</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">    },</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">    <span style="color: #006080;">&quot;require&quot;</span>: {</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">        <span style="color: #006080;">&quot;php&quot;</span>: <span style="color: #006080;">&quot;&gt;=5.3.3&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">        <span style="color: #006080;">&quot;symfony/symfony&quot;</span>: <span style="color: #006080;">&quot;~2.4&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">        <span style="color: #006080;">&quot;doctrine/orm&quot;</span>: <span style="color: #006080;">&quot;~2.2,&gt;=2.2.3&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">        <span style="color: #006080;">&quot;doctrine/doctrine-bundle&quot;</span>: <span style="color: #006080;">&quot;~1.2&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">        <span style="color: #006080;">&quot;twig/extensions&quot;</span>: <span style="color: #006080;">&quot;~1.0&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">        <span style="color: #006080;">&quot;symfony/assetic-bundle&quot;</span>: <span style="color: #006080;">&quot;~2.3&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">        <span style="color: #006080;">&quot;symfony/swiftmailer-bundle&quot;</span>: <span style="color: #006080;">&quot;~2.3&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">        <span style="color: #006080;">&quot;symfony/monolog-bundle&quot;</span>: <span style="color: #006080;">&quot;~2.4&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">        <span style="color: #006080;">&quot;sensio/distribution-bundle&quot;</span>: <span style="color: #006080;">&quot;~2.3&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">        <span style="color: #006080;">&quot;sensio/framework-extra-bundle&quot;</span>: <span style="color: #006080;">&quot;~3.0&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">        <span style="color: #006080;">&quot;sensio/generator-bundle&quot;</span>: <span style="color: #006080;">&quot;~2.3&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">        <span style="color: #006080;">&quot;incenteev/composer-parameter-handler&quot;</span>: <span style="color: #006080;">&quot;~2.0&quot;</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">    },</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">    <span style="color: #006080;">&quot;scripts&quot;</span>: {</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">        <span style="color: #006080;">&quot;post-install-cmd&quot;</span>: [</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">            <span style="color: #006080;">&quot;Incenteev\\ParameterHandler\\ScriptHandler::buildParameters&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">            <span style="color: #006080;">&quot;Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::buildBootstrap&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">            <span style="color: #006080;">&quot;Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::clearCache&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">            <span style="color: #006080;">&quot;Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::installAssets&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">            <span style="color: #006080;">&quot;Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::installRequirementsFile&quot;</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">        ],</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">        <span style="color: #006080;">&quot;post-update-cmd&quot;</span>: [</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">            <span style="color: #006080;">&quot;Incenteev\\ParameterHandler\\ScriptHandler::buildParameters&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">            <span style="color: #006080;">&quot;Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::buildBootstrap&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">            <span style="color: #006080;">&quot;Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::clearCache&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">            <span style="color: #006080;">&quot;Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::installAssets&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">            <span style="color: #006080;">&quot;Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::installRequirementsFile&quot;</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">        ]</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">    },</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">    <span style="color: #006080;">&quot;config&quot;</span>: {</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">        <span style="color: #006080;">&quot;bin-dir&quot;</span>: <span style="color: #006080;">&quot;bin&quot;</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">    },</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">    <span style="color: #006080;">&quot;extra&quot;</span>: {</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">        <span style="color: #006080;">&quot;symfony-app-dir&quot;</span>: <span style="color: #006080;">&quot;app&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">        <span style="color: #006080;">&quot;symfony-web-dir&quot;</span>: <span style="color: #006080;">&quot;web&quot;</span>,</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">        <span style="color: #006080;">&quot;incenteev-parameters&quot;</span>: {</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">            <span style="color: #006080;">&quot;file&quot;</span>: <span style="color: #006080;">&quot;app/config/parameters.yml&quot;</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">        },</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">        <span style="color: #006080;">&quot;branch-alias&quot;</span>: {</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">            <span style="color: #006080;">&quot;dev-master&quot;</span>: <span style="color: #006080;">&quot;2.4-dev&quot;</span></pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">        }</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">    }</pre>
<!--CRLF -->
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">}</pre>
<!--CRLF --></div>
</div>
<p>Note the &quot;require" part, this is where Symfony specified which packages it needs and hence Composer downloaded them into the "vendor" directory:</p>
<p><a href="__GHOST_URL__/content/images/msdn/1016.image_5F00_57A06D7D.png"><img style="display: inline; background-image: none;" title="image" src="__GHOST_URL__/content/images/msdn/6646.image_5F00_thumb_5F00_2302A1F3.png" alt="image" width="134" height="334" border="0" /></a></p>
<p><strong>Now copy the composer.phar file into your project directory for easier access</strong>. At any point if we want to add more packages and update old ones, you add them to the composer.json file and then run</p>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: 'Courier New', courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: #f4f4f4;">
<div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: #f4f4f4;">
<pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: 'Courier New', courier, monospace; font-size: 8pt; direction: ltr; background-color: white;">php composer.phar install</pre>
<!--CRLF --></div>
</div>
<h1>To be continued..</h1>
<p>In this part we covered how to create a Composer enabled PHP web application. In part 2 of this post, I'll cover how to create a Windows Azure Website, set-up Git deployment and modify the post deployment actions to <strong>run the composer install command after each commit</strong>. What benefit would that give us? You'd have to <a href="__GHOST_URL__/part-2-creating-a-composer-enabled-php-website-on-windows-azure-with-git-deployment">read part 2</a> in order to find out!</p><blockquote class='note original-post'><div><p><strong>Note: </strong>This post originally appeared on my MSDN blog at 		<a href='http://blogs.msdn.com/b/africaapps/archive/2014/01/28/part-1-creating-a-composer-enabled-php-website-on-windows-azure-with-git-deployment.aspx'>http://blogs<!--kg-card-end: markdown-->
