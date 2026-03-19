---
layout: post
title: Securing ASP.net logins with Azure Multi-factor Authentication
date: 2014-07-14T12:41:53.000Z
tags:
  - azure
  - websites
  - mfa
---

<!--kg-card-begin: markdown--><p>With recent high profile hacks, like what happened with <a href="http://www.codespaces.com/">Code Spaces</a> and the <a href="http://techcrunch.com/2014/01/29/godaddy-admits-hackers-social-engineering-led-it-to-divulge-info-in-n-twitter-account-hack/">@n twitter hack</a>, simply using passwords is becoming something that is inadequate as attackers are becoming more and more complex in their techniques.</p>
<p>An attacker getting access to your password can cripple your business or erase your online identity.</p>
<p>With that in mind, if you are building a cloud application, maybe you're building the next big CRM software as a service; you owe it to your end users to provide them with the highest security possible.</p>
<h1 id="whatismultifactorauthentication">What is Multi-factor Authentication?</h1>
<p>I'm glad you asked, Multi-factor Authentication, or MFA for short, is a technique to provide more security during signing-in, while still maintaining a simple sign-in procedure. Simply put, it requires using more than one verification method to verify that <strong>you are, you</strong>.</p>
<p>It works by requiring any two or more of the following verification methods:</p>
<ul>
<li>Something you know (typically a password)</li>
<li>Something you have (a trusted device that is not easily duplicated, like a phone)</li>
<li>Something you are (biometrics)</li>
</ul>
<h1 id="mfaandazure">MFA and Azure</h1>
<p>Depending on how you built your application, you have <a href="http://azure.microsoft.com/en-us/documentation/articles/multi-factor-authentication/">several options</a> for adding MFA functionality.</p>
<p>In this post, I'll assume you're not using Azure Active Directory, and that you have your own implementation of a users database that you want to protect with MFA, hence I'll be implementing MFA using the <a href="http://msdn.microsoft.com/en-us/library/dn249464.aspx">MFA SDK</a>. The Multi-Factor Authentication SDK is available for C#, Visual Basic (.NET), Java, Perl, PHP, and Ruby.</p>
<h1 id="showmethemoney">Show me the money</h1>
<h2 id="creatingtheproject">Creating the project</h2>
<p>I'll start by creating a new ASP.net MVC website <img src="__GHOST_URL__/content/images/2014/Jul/1.PNG" alt="New project" loading="lazy"> and choosing an MVC website that is secured by <strong>Individual User Accounts</strong>. <img src="__GHOST_URL__/content/images/2014/Jul/2.PNG" alt="MVC Site" loading="lazy"></p>
<p>Essentially, this will create the required <em>plumbing</em> ie: Account controller, database tables, views, etc. that are needed for quickly spinning up a login form. You could opt not to use the <a href="http://www.asp.net/identity">ASP.NET identity</a> if you want and integrate your own database, but I highly recommend you take a look at it. It is awesome!</p>
<h2 id="addingfieldsforthephonenumberandpininthemodelanddatabase">Adding fields for the phone number and PIN in the Model and database</h2>
<p>Migrations are recommended to use when you are modifying the schema of the database or you are changing the Code First Model. ASP.NET Identity uses Entity Framework Code First as an underlying framework. For more information on EF migrations please visit <a href="http://msdn.microsoft.com/en-us/data/jj591621">http://msdn.microsoft.com/en-us/data/jj591621</a></p>
<p>Bring up the Package Manager Console then go ahead and <code>enable-migrations</code>.<br>
<img src="__GHOST_URL__/content/images/2014/Jul/3757_image_051538A3.png" alt="Open the Package Manager Console" loading="lazy"></p>
<p>After migrations are enabled, open <code>Models\IdentityModels.cs</code> and add Country Code, Phone and PIN properties to the <code>ApplicationUser</code> class.</p>
<script src="https://gist.github.com/sabbour/cc8dacfd41afbd8b696d.js"></script>
<p>Now in the Package Manager Console, run <code>add-migration adding_mfa_fields</code></p>
<p>Finally run <code>update-database</code> to apply the changes to the database.</p>
<h2 id="addingthefieldsduringregistration">Adding the fields during registration</h2>
<p>Now let's update our <code>RegisterViewModel</code> in <code>Models\AccountViewModels.cs</code> to add the same fields, so that we're able to access them during registration.</p>
<script src="https://gist.github.com/sabbour/9ccecc6bebb97cfd47b9.js"></script>
<p>Then update the <code>Register</code> method in the <code>AccountController.cs</code> to pass on the additional fields to the <code>ApplicationUser</code></p>
<script src="https://gist.github.com/sabbour/9950b96a1685ddedec40.js"></script>
<p>Finally, let's add the fields in <code>Views\Register.cshtml</code></p>
<script src="https://gist.github.com/sabbour/2dc1cfc5b0dc7ca3d254.js"></script>
<h2 id="runandregisteranewuser">Run and register a new user</h2>
<p><img src="__GHOST_URL__/content/images/2014/Jul/3-1.PNG" alt="Register" loading="lazy"></p>
<h2 id="createamultifactorauthenticationprovideronazure">Create a Multi-factor Authentication Provider on Azure</h2>
<p>On the portal click on the big New button, then create a new Multi-factor Auth provider. Do not link it to a directory, and make sure you select the appropriate usage model because you can't change it later.<br>
<img src="__GHOST_URL__/content/images/2014/Jul/4-1.PNG" alt="Create MFA provider" loading="lazy"></p>
<h2 id="downloadthesdk">Download the SDK</h2>
<p>Once your provider is provisioned, you need to click on Manage to open its management portal and download the appropriate SDK.<br>
<img src="__GHOST_URL__/content/images/2014/Jul/5.PNG" alt="" loading="lazy"></p>
<p>Download the <code>ASP.NET 2.0 C#</code> SDK and extract it somewhere.</p>
<h2 id="addthesdktotheproject">Add the SDK to the project</h2>
<p>Open the extracted zip file, and copy the <code>pf</code> folder into your project, then add the files to the project.<br>
<img src="__GHOST_URL__/content/images/2014/Jul/6.PNG" alt="Include in project" loading="lazy"></p>
<h2 id="modifythelogin">Modify the Login</h2>
<p>Modify the Login method in <code>AccountController.cs</code> to include calls to the MFA provider. Note that in the code below, there are some commented options. Basically, these are different ways you can initiate the authentication varying between a phone call, SMS and voice prints.</p>
<script src="https://gist.github.com/sabbour/b220c39a72053edf1ef7.js"></script>
<h2 id="testit">Test it!</h2>
<p>Run the site and click on Log In then enter your username and password, you should be getting a phone call that you have to accept in order to be logged in.<br>
<img src="__GHOST_URL__/content/images/2014/Jul/7.PNG" alt="" loading="lazy"></p>
<p>You will get a phone call (or SMS) that you have to pick up<br>
<img src="__GHOST_URL__/content/images/2014/Jul/wp_ss_20140714_0001.jpg" alt="" loading="lazy"></p>
<h1 id="closing">Closing</h1>
<p>We've implemented Multi-factor Authentication in a pretty straight forward way and added a strong layer of security. If you want to try this out, you can go ahead and create a <a href="http://azure.microsoft.com/en-us/pricing/free-trial/">30-day free trial for Azure</a>.</p>
<!--kg-card-end: markdown-->
