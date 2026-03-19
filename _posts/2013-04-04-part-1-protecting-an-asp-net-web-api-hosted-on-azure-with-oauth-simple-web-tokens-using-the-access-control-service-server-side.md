---
layout: post
title: "Part 1: Protecting an ASP.net Web API hosted on Azure with OAuth Simple Web Tokens using the Access Control Service – Server Side"
date: 2013-04-04T07:36:00.000Z
tags:
  - OAuth
  - Access Control Service
  - ACS
  - Windows Phone
  - windows azure
  - SWT
---

<!--kg-card-begin: markdown--><h2><span style="font-size: medium;"><span style="color: #2e74b5;"><span style="font-family: Calibri Light;">Introduction</span></span></span></h2>
<p><span style="font-size: small;"><span style="font-family: Calibri;">I've been in this situation many times, I have an API that needs an authenticated user to access it, how can this problem be solved?</span></span></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">You could pass the username and password of the user with each request, a horribly unsecure method for that the password can be sniffed if your API is not using HTTPS, and even if using HTTPS, it is not a good practice to keep sending this sensitive data around.</span></span></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">Come to save you is the Token based authentication. You login to a server, and you a presented with a Token, which you can think of as a Ticket with an expiry date. Whenever you want to access protected resources, you just present this ticket to the service, and the service would check its validity and grant you access.</span></span></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">That's the idea behind Token based authentication, which OAuth and Simple Web Token (SWT) is one of them.</span></span></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">I will not be going into deep details in this post, but I'll be providing the sample working solution. The project and the Simple Web Token OAuth library are posted on <a href="https://github.com/sabb0ur/SWTOAuth"><span style="color: #0563c1;">GitHub</span></a>, so get them from there.<br /> <br /> It is based on the project hosted below but modified. </span></span></p>
<p><a href="http://zamd.net/2011/02/08/using-simple-web-token-swt-with-wif/"><span style="color: #0563c1; font-family: Calibri; font-size: small;">http://zamd.net/2011/02/08/using-simple-web-token-swt-with-wif/</span></a><br /><a href="http://netfx.codeplex.com/"><span style="color: #0563c1; font-family: Calibri; font-size: small;">http://netfx.codeplex.com/</span></a></p>
<p> </p>
<h2><span style="font-size: medium;"><span style="color: #2e74b5;"><span style="font-family: Calibri Light;">What we are trying to build</span></span></span></h2>
<p><span style="font-size: medium;"><span style="color: #2e74b5;"><span style="font-family: Calibri Light;"><a href="/content/images/msdn/1323.Picture1.jpg"><img src="/content/images/msdn/1323.Picture1.jpg" alt="" border="0" /></a></span></span></span></p>
<p>Open the sample solution, you should find the solution structure as below <br /><a href="/content/images/msdn/7331.Picture2.png"><img src="/content/images/msdn/7331.Picture2.png" alt="" border="0" /></a></p>
<h2><span style="font-size: medium;"><span style="color: #2e74b5;"><span style="font-family: Calibri Light;">Server side: Configuring and Protecting the Web API</span></span></span></h2>
<p><span style="font-size: small;"><span style="font-family: Calibri;">In this part, we are going to configure the Windows Azure Access Control Service (ACS) to accept logins from Facebook, and allow your client application to use it to Authenticate and issue Simple Web Tokens. Then protect the Web API itself with such mechanism.</span></span></p>
<h3><span style="font-size: small;"><span style="color: #1f4d78;"><span style="font-family: Calibri Light;">Step 1</span></span></span></h3>
<p><span style="font-family: Calibri; font-size: small;">Create a Windows Azure ACS by going to the Management Portal. Windows Azure ACS allows you to externalize the process of authenticating users, where you can use it to authenticate users using Facebook, Google, Microsoft Account and Active Directory. ACS is a big topic and if you are interested, I suggest you read up on it </span><a href="http://msdn.microsoft.com/en-us/library/hh147631.aspx"><span style="color: #0563c1; font-family: Calibri; font-size: small;">here</span></a><span style="font-size: small;"><span style="font-family: Calibri;">.</span></span></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">Create a new Access Control namespace</span></span></p>
<p> <a href="/content/images/msdn/1033.Picture3.png"><img src="/content/images/msdn/1033.Picture3.png" alt="" border="0" /></a></p>
<p><span style="font-family: Calibri; font-size: small;"> </span></p>
<h3><span style="font-size: small;"><span style="color: #1f4d78;"><span style="font-family: Calibri Light;">Step 2</span></span></span></h3>
<p><span style="font-size: small;"><span style="font-family: Calibri;">After creating the ACS on Windows Azure, you need to create a "Relying Party Application". This basically allows you to specify applications that have access to your API.</span></span></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">Click on Manage to manage the ACS</span></span></p>
<p> <a href="/content/images/msdn/2275.Picture4.png"><img src="/content/images/msdn/2275.Picture4.png" alt="" border="0" /></a></p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">When the management portal loads up, click on "Relying party applications", then click on Add.</span></span></p>
<ul>
<li><span style="font-size: small;">&amp;middot;</span>        <span style="font-size: small;"><span style="font-family: Calibri;">Enter a name for the application, say "<strong>MyWebAPI</strong>"</span></span></li>
<li><span style="font-size: small;">&amp;middot;</span>        <span style="font-size: small;"><span style="font-family: Calibri;">Enter a realm to identify the app, could be a url or an identifier, Ex: "<strong>uri:mywebapi</strong>"</span></span></li>
<li><span style="font-size: small;">&amp;middot;</span>        <span style="font-size: small;"><span style="font-family: Calibri;">Select the "<strong>SWT</strong>" Token Format</span></span></li>
<li><span style="font-size: small;">&amp;middot;</span>        <span style="font-size: small;"><span style="font-family: Calibri;">Select the identity providers you want to enable login through. For the purpose of this, we're sticking with Windows Live Id, but you can add more through the Identity Providers tab.</span></span></li>
<li><span style="font-size: small;">&amp;middot;</span>        <span style="font-size: small;"><span style="font-family: Calibri;">Click <strong>Generate</strong> to generate a <strong>256-bit symmetric signing key</strong></span></span></li>
<li><span style="font-size: small;">&amp;middot;</span>        <span style="font-size: small;"><span style="font-family: Calibri;">Save</span></span></li>
</ul>
<p><a href="/content/images/msdn/7418.Picture5.png"><img src="/content/images/msdn/7418.Picture5.png" alt="" border="0" /></a><br /><span style="font-size: small;"><span style="font-family: Calibri;"> <br /> Now take the Symmetric Key and the realm and put them in the <strong>Web.config</strong> of your Web API under the &lt;appSettings&gt;.</span></span></p>
<p>&lt;!-- for ACS --&gt;</p>
<p>&lt;appSettings&gt;</p>
<p>    &lt;add key=&quot;TrustedTokenPolicyKey&quot; value=&quot;[your symmetric key]&quot; /&gt;</p>
<p>    &lt;add key=&quot;TrustedAudience&quot; value=&quot;[your app realm]&quot; /&gt;<br /> &lt;/appSettings&gt;</p>
<p><span style="font-size: small;"><span style="font-family: Calibri;">And then open the <strong>Global.asax.cs</strong> file to register the SWTOAuth module to handle incoming requests and validate the tokens that the client is sending. Write the line below in Application_Start() method:</span></span></p>
<p>GlobalConfiguration.Configuration.MessageHandlers.Add(new TokenValidationHandler(CloudConfigurationManager.GetSetting(&quot;TrustedTokenPolicyKey&quot;)));</p>
<p>         <br /><span style="font-size: small;"><span style="font-family: Calibri;"> This will allow the SWTOAuth library to validate the tokens that the client is sending.</span></span></p>
<h3><span style="font-size: small;"><span style="color: #1f4d78;"><span style="font-family: Calibri Light;">Step 3</span></span></span></h3>
<p><span style="font-size: small;"><span style="font-family: Calibri;">But what does the SWTOAuth module do exactly? It parses the incoming Authorization header in the request, validates the validity of the token, then sets the current <strong>User.Identity</strong> of the Thread to the parsed claims from the SWT token in the request. By making that, you are able to make use of the User.Identity in any of the API Controllers like so:</span></span></p>
<p>// GET api/claims</p>
<p>        public Dictionary&lt;string, string&gt; Get()</p>
<p>        {</p>
<p>            // Get the User.Identity which would have been set by the SWTOAuth module</p>
<p>            var identity = User.Identity as ClaimsIdentity;</p>
<p> </p>
<p>            // Parse the incoming claims</p>
<p>            Dictionary&lt;string, string&gt; parsedClaims = new Dictionary&lt;string, string&gt;();</p>
<p>            foreach (var claim in identity.Claims)</p>
<p>                parsedClaims[claim.Type] = claim.Value;</p>
<p> </p>
<p>            // Return them, just for show</p>
<p>            return parsedClaims;</p>
<p>        }</p>
<p> </p>
<p>Stay tuned for the next post, were we'll tackle the client side of the app.</p><blockquote class='note original-post'><div><p><strong>Note: </strong>This post originally appeared on my MSDN blog at 		<a href='http://blogs.msdn.com/b/africaapps/archive/2013/04/04/part-1-protecting-an-asp-net-web-api-hosted-on-azure-with-oauth-simple-web-tokens-using-the-access-control-service-server-side.aspx'>http://blogs.msdn.com/b/africaapps/archive/2013/04/04/part-1-protecting-an-asp-net-web-api-hosted-on-azure-with-oauth-simple-web-tokens-using-the-access-control-service-server-side.aspx</a></p></div></blockquote><!--kg-card-end: markdown-->
