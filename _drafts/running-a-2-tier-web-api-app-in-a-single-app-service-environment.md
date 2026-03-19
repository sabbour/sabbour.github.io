---
layout: post
title: Running a 2-tier Web + API app in a single App Service Environment
date: 2017-01-02T08:04:42.000Z
---

<!--kg-card-begin: markdown--><h1 id="introduction">Introduction</h1>
<p>For some applications, it is necessary to have a 2-tiered application infrastructure where the frontend, typically a website, is publicly accessible over the internet and a backend, maybe some APIs are not publicly accessible and are only callable via the internal network.</p>
<p>Typically, to achieve this on Azure App Service, you need to use 2 App Service Environments isolated within a Virtual Network. The publicly accessible App Service Environment would have a Public Virtual IP (VIP) and the internal App Service Environment would have an Internal Load Balanced IP (ILB) like the diagram below.<br>
<img src="__GHOST_URL__/content/images/2017/01/callsbetweenenvironments-1-1.png" alt="" loading="lazy"></p>
<p>This is the &quot;ideal&quot; architecture, but it comes at a cost of running 2 App Service Environments. What I'll try documenting below is how to get a &quot;good enough&quot;</p>
<!--kg-card-end: markdown-->
