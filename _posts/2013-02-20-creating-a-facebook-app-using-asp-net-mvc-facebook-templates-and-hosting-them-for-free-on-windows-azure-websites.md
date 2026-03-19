---
layout: post
title: Creating a Facebook app using ASP.NET MVC Facebook Templates and hosting them for free on Windows Azure Websites
date: 2013-02-20T08:09:00.000Z
tags:
  - windows azure
  - azure
  - facebook apps
  - facebook
  - free
  - website
---

<!--kg-card-begin: markdown--><h1>Introduction</h1>
<p><span style="font-size: small;"><span style="font-family: Calibri;">If you haven't checked out the ASP.net and Web Tools 2012.12 release, you should! It is a tooling refresh of Visual Studio 2012 and Visual Studio 2012 Express for Web, that extends the existing ASP.net runtime with a lot of exciting new features including:</span></span></p>
<ul>
<li><span style="font-size: small;"><span style="font-family: Calibri;">New Web API functionality (OData endpoints, tracing and automatically generated help pages)</span></span></li>
<li><span style="font-size: small;"><span style="font-family: Calibri;">New ASP.NET MVC templates for Facebook Application and Single Page Application</span></span></li>
<li><span style="font-size: small;"><span style="font-family: Calibri;">Real-time communication via ASP.NET SignalR</span></span></li>
<li><span style="font-size: small;"><span style="font-family: Calibri;">Extensionless Web Forms via ASP.NET Friendly URLs</span></span></li>
<li><span style="font-size: small;"><span style="font-family: Calibri;">Support for the new Windows Azure Authentication</span></span></li>
<li><span style="font-size: small;"><span style="font-family: Calibri;">Ability to see CSS updates in real-time</span></span></li>
<li><span style="font-size: small;"><span style="font-family: Calibri;">Pasting JSON as an automatically generated .NET classes using a Special Paste command.</span></span></li>
</ul>
<p><a href="http://www.asp.net/vnext"><span style="color: #0563c1; font-family: Calibri; font-size: small;">Download it and check out all the new features</span></a><span style="font-family: Calibri; font-size: small;"> and also hit the release notes for the </span><a href="http://www.asp.net/vnext/overview/fall-2012-update/aspnet-and-web-tools-20122-release-notes-rtw"><span style="color: #0563c1; font-family: Calibri; font-size: small;">full details</span></a><span style="font-size: small;"><span style="font-family: Calibri;">.</span></span></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">In this post, we will be exploring the new Facebook Application MVC template. We will create a simple Facebook App, and host it on Azure.</span></span></p>
<h1>Let's start!</h1>
<p><span style="font-size: small;"><span style="font-family: Calibri;">Make sure you installed the update, then let's create a new ASP.net MVC4 App</span></span></p>
<p> <a href="/content/images/msdn/6170.1.PNG"><img src="/content/images/msdn/6170.1.PNG" alt="" border="0" /></a></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">Then select the Facebook Application project template</span></span></p>
<p> <a href="/content/images/msdn/1033.2.PNG"><img src="/content/images/msdn/1033.2.PNG" alt="" border="0" /></a></p>
<p><span style="font-family: Calibri; font-size: small;">Next go ahead to </span><a href="https://developers.facebook.com/apps"><span style="color: #0563c1; font-family: Calibri; font-size: small;">https://developers.facebook.com/apps</span></a><span style="font-size: small;"><span style="font-family: Calibri;"> and create a new Facebook app. You will need to select a unique name and be creative!</span></span></p>
<p> <a href="/content/images/msdn/8831.3.PNG"><img src="/content/images/msdn/8831.3.PNG" alt="" border="0" /></a></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">After the app is created, you need to take note of the App ID and App Secret as we will be using them in the next step. Also make sure to enable the Sandbox mode.</span></span></p>
<p> <a href="/content/images/msdn/7345.4.PNG"><img src="/content/images/msdn/7345.4.PNG" alt="" border="0" /></a></p>
<p><span style="font-family: Calibri; font-size: small;"> </span></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">Now, go back to Visual Studio, open the Web.config file and fill in the AppId, AppSecret and the App Namespace</span></span></p>
<p> <a href="/content/images/msdn/7418.5.PNG"><img src="/content/images/msdn/7418.5.PNG" alt="" border="0" /></a></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">Now in the <strong>Solution Explorer</strong>, right click on the project, click Properties, then go to the <strong>Web</strong> tab. Copy the <strong>Project Url</strong>.</span></span></p>
<p> <a href="/content/images/msdn/1205.6.PNG"><img src="/content/images/msdn/1205.6.PNG" alt="" border="0" /></a></p>
<p><span style="font-family: Calibri; font-size: small;"> </span></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">Go back to Facebook, check the "App on Facebook" mark, then paste the copied link in the Canvas URL</span></span></p>
<p> <a href="/content/images/msdn/2337.7.PNG"><img src="/content/images/msdn/2337.7.PNG" alt="" border="0" /></a></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">Save this settings. Now in Visual Studio, Build and run the app. You will find the Facebook Authentication dialog popping up</span></span></p>
<p> <a href="/content/images/msdn/0753.8.png"><img src="/content/images/msdn/0753.8.png" alt="" border="0" /></a></p>
<p> </p>
<p> <a href="/content/images/msdn/7181.9.PNG"><img src="/content/images/msdn/7181.9.PNG" alt="" border="0" /></a></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">Your app is now running inside Facebook, retrieving your Friends and Photos. It is that easy!</span></span></p>
<p> <a href="/content/images/msdn/2437.10.PNG"><img src="/content/images/msdn/2437.10.PNG" alt="" border="0" /></a></p>
<h1><span style="font-size: medium;"><span style="color: #2e74b5;"><span style="font-family: Calibri Light;">Moving it from localhost to Windows Azure</span></span></span></h1>
<p><span style="font-size: small;"><span style="font-family: Calibri;">Now I know what we've done above is impressive, but obviously, you need to host your app somewhere other than localhost!</span></span></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">Let's move it to Windows Azure. And the perfect host for that is Windows Azure Websites.</span></span></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">You can get up to 10 free Windows Azure Websites, so you can host this Facebook app right away and pay nothing. Shall we?</span></span></p>
<p><span style="font-family: Calibri; font-size: small;">If you haven't created an account on Azure, go ahead and </span><a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A6AE67820"><span style="color: #0563c1; font-family: Calibri; font-size: small;">create one now</span></a><span style="font-size: small;"><span style="font-family: Calibri;">. It is free.</span></span></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">Login to the Management Portal, click on New</span></span></p>
<p> <a href="/content/images/msdn/0535.11.PNG"><img src="/content/images/msdn/0535.11.PNG" alt="" border="0" /></a></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">Create a new website</span></span></p>
<p> <a href="/content/images/msdn/4721.12.PNG"><img src="/content/images/msdn/4721.12.PNG" alt="" border="0" /></a></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">After the website is created, click on its name, then click Download publishing profile, and save the resulting file somewhere you know.</span></span></p>
<p> <a href="/content/images/msdn/0552.13.PNG"><img src="/content/images/msdn/0552.13.PNG" alt="" border="0" /></a></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">Go back to Visual Studio, right click on the Project, click <strong>Publish</strong>, click <strong>Import</strong>, then browse to the file you saved earlier.</span></span></p>
<p> <a href="/content/images/msdn/2781.14.PNG"><img src="/content/images/msdn/2781.14.PNG" alt="" border="0" /></a></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">After you import the settings, simply click on <strong>Publish</strong> and wait till the publishing completes. </span></span></p>
<p> <a href="/content/images/msdn/8055.15.PNG"><img src="/content/images/msdn/8055.15.PNG" alt="" border="0" /></a></p>
<h1>Final step</h1>
<p><span style="font-family: Calibri; font-size: small;">You'll notice that your website has been published to </span><a href="http://mysupercoolazureapp.azurewebsites.net/"><span style="color: #0563c1;">http://mysupercoolazureapp.azurewebsites.net/</span></a>.</p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">You now need to go back to the Facebook app settings, and change the Canvas Url to that one.</span></span></p>
<p> <a href="/content/images/msdn/3240.16.PNG"><img src="/content/images/msdn/3240.16.PNG" alt="" border="0" /></a></p>
<p><span style="font-family: Calibri; font-size: small;"> </span></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">You're done!</span></span></p>
<h1>Where to take it from here?</h1>
<p><span style="font-size: small;"><span style="font-family: Calibri;">You've learnt how to create a basic Facebook app using ASP.NET MVC's new Facebook Application template, and you also hosted it for free on Windows Azure Websites.</span></span></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">Make sure you hit the resources below for more details on Facebook apps</span></span></p>
<ul>
<li><span style="text-decoration: underline;"><a href="https://developers.facebook.com/docs/guides/canvas/"><span style="font-family: Calibri; font-size: small;">Getting Started Building Apps on Facebook.com</span></a></span></li>
<li><span style="text-decoration: underline;"><a href="https://developers.facebook.com/docs/reference/api/user/"><span style="font-family: Calibri; font-size: small;">API Reference for User Fields</span></a></span></li>
<li><span style="text-decoration: underline;"><a href="http://csharpsdk.org/"><span style="font-family: Calibri; font-size: small;">Facebook C# SDK Project Home</span></a></span></li>
</ul>
<p><span style="font-family: Calibri; font-size: small;"> </span></p><blockquote class='note original-post'><div><p><strong>Note: </strong>This post originally appeared on my MSDN blog at 		<a href='http://blogs.msdn.com/b/africaapps/archive/2013/02/20/creating-a-facebook-app-using-asp-net-mvc-facebook-templates-and-hosting-them-for-free-on-windows-azure-websites.aspx'>http://blogs.msdn.com/b/africaapps/archive/2013/02/20/creating-a-facebook-app-using-asp-net-mvc-facebook-templates-and-hosting-them-for-free-on-windows-azure-websites.aspx</a></p></div></blockquote><!--kg-card-end: markdown-->
