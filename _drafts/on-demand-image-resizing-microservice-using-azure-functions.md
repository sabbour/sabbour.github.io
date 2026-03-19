---
layout: post
title: On-demand image resizing microservice using Azure Functions
date: 2017-03-15T14:38:26.000Z
---

<!--kg-card-begin: markdown--><h1 id="introduction">Introduction</h1>
<p>What I'll show you here is how to create a &quot;microservice&quot;, since this appears to be the latest buzzword these days, to resize images on the fly.<br>
Yes there are multiple online services that you can pay for to do the same thing, but why do that when you can do it practically for free using Azure Functions!</p>
<h1 id="azurefunctions">Azure Functions</h1>
<p>Azure functions you say? Yes! Azure Functions is Azure's take at serverless, event driven compute. No servers to manage, no choosing instance sizing, no worrying about scaling, etc. You should read up about it on the <a href="https://azure.microsoft.com/en-us/services/functions/">Azure Functions</a> page.<br>
It is also much more than simply an event driven serverless platform. You can bind against a multitude of Azure services, such as Blob Storage, Queues, Event Hubs, et. as well as 3rd party services such as Box, OneDrive, etc.</p>
<h1 id="gettingstarted">Getting started</h1>
<h2 id="createanazurefunctionapp">Create an Azure Function &quot;App&quot;</h2>
<p>A Function App can run with 2 billing models based on the kind of <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-scale">hosting plan</a> you use. This <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-scale">article</a> talks extensively about that, so I won't go into much details here.<br>
Additionally, think about the Function App as a container for your different functions that make up your microservice.</p>
<p>In short, you can host your Function App in:</p>
<ol>
<li><strong>Consumption Plan</strong> -  which is the default and preferred model, where the apps are assigned to compute instances that are dynamically added/removed based on processing needs. Functions would also execute in parallel. You are charged by the total number of seconds your function are executing as well as the memory allocated.</li>
<li><strong>App Service Plan</strong> - which is your good old App Service Plan that is used to host your Web Apps and API Apps. In this model, you need to plan a bit for the resources that your function needs. You can host the function in an existing App Service Plan, or create a standalone plan for that.</li>
</ol>
<p>I'll use a <strong>Consumption Plan</strong>. Remember if you choose otherwise, you'll have to be responsible for scaling.</p>
<h1 id="cdnintegration">CDN integration</h1>
<!--kg-card-end: markdown-->
