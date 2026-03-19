---
layout: post
title: How to run an App Service behind a WAF-enabled Application Gateway
date: 2016-10-18T11:47:23.000Z
tags:
  - app service environment
  - application gateway
  - waf
  - web application firewall
  - app service
---

<!--kg-card-begin: markdown--><h1 id="introduction">Introduction</h1>
<p>You may have heard of the <a href="https://azure.microsoft.com/en-us/services/application-gateway/">Azure Application Gateway</a> which is a Layer-7 HTTP load balancer that provides application-level routing and load balancing services that let you build a scalable and highly-available web front end in Azure. It works by accepting traffic and based on rules that are defined with it, routes the traffic to the appropriate back-end instances.</p>
<p>It has pretty neat features too like:</p>
<ul>
<li>Web Application Firewall (WAF)</li>
<li>HTTP load balancing</li>
<li>Cookie-based session affinity</li>
<li>SSL offloading and End-to-end SSL</li>
<li>URL-based content routing</li>
<li>Multi-site routing</li>
<li>Websocket support</li>
<li>Health monitoring</li>
</ul>
<p>For more details about what Application Gateway can do, have a look at the <a href="https://azure.microsoft.com/en-us/documentation/articles/application-gateway-introduction/">Introduction to Application Gateway article</a> on the Azure documentation website.</p>
<h2 id="architectureoverview">Architecture overview</h2>
<p>What I'm trying to achieve here is hosting a website in an App Service Environment and protect it with the Web Application Firewall that is provided by the Application Gateway. Ultimately, this should look like the diagram below:</p>
<p><img src="__GHOST_URL__/content/images/2016/10/architecture-2.png" alt="Application Gateway + App Service Environment architecture" loading="lazy"></p>
<h2 id="letsgo">Let's go</h2>
<h3 id="createyourvirtualnetwork">Create your Virtual Network</h3>
<p>The virtual network with at least 1 subnet. That subnet would be used by the Application Gateway. In the next step, the App Service Environment subnet will be create as part of the provisioning process.<br>
<img src="__GHOST_URL__/content/images/2016/10/1-vnet.png" alt="Virtual Network" loading="lazy"></p>
<h3 id="createanappserviceenvironment">Create an App Service Environment</h3>
<p>When you are creating the App Service Environment, make sure you create it in the same Virtual Network. Choose the VIP type to be <em>Internal</em>, select a subdomain and create the required subnet for the App Service Environment. This step may take up to 2 hours to complete. Be patient.<br>
<img src="__GHOST_URL__/content/images/2016/10/2-ase-1.png" alt="App Service Environment creation" loading="lazy"></p>
<h3 id="createanappserviceplanandwebapp">Create an App Service Plan and Web App</h3>
<p>In the App Service Environment, create an App Service Plan and create a new Web App with the hostname of <strong>yoursite.internal.sabbour.me</strong>. You may also add a custom domain now that will be externally resolved, in my case I went with <strong>protected.sabbour.me</strong>.<br>
<img src="__GHOST_URL__/content/images/2016/10/3-asp.png" alt="Web App settings" loading="lazy"></p>
<h3 id="createajumpboxandadnsserver">Create a &quot;jump-box&quot; and a DNS server</h3>
<p>Remember that this Web App is living within a VNET that isn't publicly accessible, so in order to be able to deploy stuff, access Kudu console and so on, you need to create a Virtual Machine that is living within the same Virtual Network and use that to access the Web App with its internal IP. While you're at it, you may configure this machine with a DNS role to be able to resolve the Web App specific domains (and other hostnames within your Virtual Network).<br>
You need to create <strong>A-records</strong> pointing to the App Service Environment's Internal Load Balancer IP address for the following hostnames <strong>(*, *.scm, ftp, publish)</strong>.<br>
<img src="__GHOST_URL__/content/images/2016/10/4-dns.png" alt="A records required" loading="lazy"><br>
Set the Virtual Network to use this newly created DNS server.<br>
<img src="__GHOST_URL__/content/images/2016/10/5-dns.png" alt="Virtual Network DNS settings" loading="lazy"></p>
<h3 id="createtheapplicationgateway">Create the Application Gateway</h3>
<p>Now it is time to create the Application Gateway and select whether you want it WAF enabled or not.<br>
<img src="__GHOST_URL__/content/images/2016/10/6-appgateway1.png" alt="Application Gateway - Step 1" loading="lazy"></p>
<p>In the settings, make sure to select the same Virtual Network you configured earlier and the subnet you created specifically for the Application Gateway. While you're at it, also configure the public IP address.<br>
<img src="__GHOST_URL__/content/images/2016/10/7-appgateway2.png" alt="Application Gateway - Step 2" loading="lazy"></p>
<p>Review the results and create the gateway.</p>
<h3 id="configuretheapplicationgateway">Configure the Application Gateway</h3>
<p>After the gateway is ready, go to the <strong>Backend Pools</strong> and create a new pool with the App Service Environment Internal Load Balancer IP.</p>
<p><img src="__GHOST_URL__/content/images/2016/10/8-appgateway3.png" alt="Backend pool configuration" loading="lazy"></p>
<p>Create a <strong>Custom Probe</strong> with the Host set as your custom Web App domain, for example <strong>protected.sabbour.me</strong>.</p>
<p><img src="__GHOST_URL__/content/images/2016/10/9-appgateway4.png" alt="Custom probe configuration" loading="lazy"></p>
<p>Go to the <strong>HTTP settings</strong>, and make sure that the setting has <strong>Custom Probes turned on</strong> and <strong>select the probe you just created</strong>. Otherwise, the Application Gateway will try to go to the IP of the App Service Environment without passing a Host header, which won't work and will throw the probe into an Unhealthy state resulting in  the 502 Gateway Proxy error.<br>
<img src="__GHOST_URL__/content/images/2016/10/10-appgateway5.png" alt="HTTP settings configuration" loading="lazy"></p>
<h3 id="test">Test!</h3>
<p>By this point, you should be able to use something like <a href="https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj">ModHeader</a> Chrome extension to open the public IP address/hostname of the Application Gateway in the browser, pass in the Custom Domain you configured on the Web App as a Host Header and the website should come up.<br>
<img src="__GHOST_URL__/content/images/2016/10/11-test.png" alt="Test results" loading="lazy"></p>
<h3 id="setupthecname">Setup the CNAME</h3>
<p>To connect to the custom hostname you setup <strong>protected.sabbour.me</strong>, all what you need to do now is to configure a CNAME on your domain pointing <strong>protected</strong> to the hostname of the Application Gateway.<br>
<img src="__GHOST_URL__/content/images/2016/10/12-cname.png" alt="CNAME setup" loading="lazy"></p>
<h3 id="testtake2">Test - take 2</h3>
<p>Go to <a href="">http://protected.sabbour.me</a> and it should now open up without any Host Header trickery.<br>
<img src="__GHOST_URL__/content/images/2016/10/13-test2.png" alt="Testing the final result" loading="lazy"></p>
<h2 id="summary">Summary</h2>
<p>To summarize, we've setup a Web App in an App Service Environment. This Web App isn't publicly accessible as it is sitting in a subnet inside a Virtual Network and it isn't exposed to the internet. The only way to access the site is through a Web Application Firewall enabled Application Gateway.</p>
<p>And all of it is done in Platform as a Service (well, other than the jump-box server at least!).</p>
<!--kg-card-end: markdown-->
