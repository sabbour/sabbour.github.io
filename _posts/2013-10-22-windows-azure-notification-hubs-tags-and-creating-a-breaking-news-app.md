---
layout: post
title: "Windows Azure Notification Hubs: Tags and creating a breaking news app"
date: 2013-10-22T05:13:00.000Z
tags:
  - Windows 8
  - notification hub
  - azure
---

<!--kg-card-begin: markdown--><div style="padding: 12px; background-color: rgb(255, 255, 153);">   <p>This is part 2 of a 3 part series where we will get to know how Notification Hubs work and why they are a cool feature of Windows Azure.</p>    <p>You can get the source code of the projects in this blog post here: <a href="http://github.com/sabbour/breakingnews">http://github.com/sabbour/breakingnews</a></p> </div>  <h1>Recap</h1>  <p>In the <a href="__GHOST_URL__/windows-azure-notification-hubs-getting-started" target="_blank">first part</a> of this blog series, we created a Notification Hub, a server side app to push notifications as well as a Windows 8 app to consume notifications. In this post, we will see a neat feature of Notification Hubs which is Tags.</p>  <h1>What are tags?</h1>  <p>In the first part, we used the hub to broadcast a notification to all the users on our hub. But what if we want more granular control? Say what if we are building an application like <a href="http://www.windowsphone.com/en-us/store/app/bing-news/9c3e8cad-6702-4842-8f61-b8b33cc9caf1" target="_blank">Bing</a> <a href="http://apps.microsoft.com/windows/en-us/app/eaaf2ce3-d5a3-4a59-ae31-276fbc44a7cd" target="_blank">News</a> and we want to push breaking news notifications to only people who are subscribed to a specific category? Tags give you the power to do exactly so.</p>  <p>Tags can act as “interest groups and frees you from maintaining the tag registrations, as the devices themselves handle that. They are simple strings, so they can be anything. Any of the tags below would work:</p>  <ul>   <li>followband:Beatles</li>    <li>followuser:Alice</li>    <li><a href="news:windowsazure">news:windowsazure</a></li>    <li>12345</li>    <li>sabbour</li> </ul>  <p><a href="__GHOST_URL__/content/images/msdn/1033.image_5F00_3ED5202D.png"><img title="image" style="display: inline;" border="0" alt="image" src="__GHOST_URL__/content/images/msdn/8422.image_5F00_thumb_5F00_77825AEB.png" width="513" height="484" /></a> </p>  <h1>Building the Breaking News app</h1>  <p>The source code of the app is available on GitHub here: <a href="http://github.com/sabbour/breakingnews">http://github.com/sabbour/breakingnews</a> so I won’t be going in details of creating the app, but will highlight the interesting bits of code.</p>  <p><a href="__GHOST_URL__/content/images/msdn/3250.image_5F00_024242F2.png"><img title="image" style="display: inline;" border="0" alt="image" src="__GHOST_URL__/content/images/msdn/7725.image_5F00_thumb_5F00_38B2F4F4.png" width="644" height="364" /></a> </p>  <p>Just like we did in part 1, registrations expire, so you should renew your registration with the Notification Hub upon app launch</p>  <div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; height: 290px; text-align: left; line-height: 12pt; overflow: auto; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: rgb(244, 244, 244);">   <div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);">     <pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;"><span style="color: rgb(0, 128, 0);">// Create the notification hub</span></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);&quot;&gt;NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString(&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;&quot;&gt;    &lt;span style=&quot;color: rgb(0, 96, 128);&quot;&gt;&amp;quot;Endpoint=sb://[service bus name space].servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=[notification hub full key]&amp;quot;&lt;/span&gt;,&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);&quot;&gt;    &lt;span style=&quot;color: rgb(0, 96, 128);&quot;&gt;&amp;quot;[notification hub name]&amp;quot;&lt;/span&gt;&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;&quot;&gt;);&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);&quot;&gt;&amp;amp;#160;&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;&quot;&gt;&lt;span style=&quot;color: rgb(0, 128, 0);&quot;&gt;// Get a Push Notification channel from the PushNotificationChannelManager&lt;/span&gt;&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);&quot;&gt;var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;&quot;&gt;&amp;amp;#160;&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);&quot;&gt;&lt;span style=&quot;color: rgb(0, 128, 0);&quot;&gt;// This is over simplification. In a real world app, you would probably be getting those through the app and loading them here&lt;/span&gt;&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;&quot;&gt;&lt;span style=&quot;color: rgb(0, 0, 255);&quot;&gt;string&lt;/span&gt;[] tagsToSubscribeTo = { &lt;span style=&quot;color: rgb(0, 96, 128);&quot;&gt;&amp;quot;sports&amp;quot;&lt;/span&gt;, &lt;span style=&quot;color: rgb(0, 96, 128);&quot;&gt;&amp;quot;politics&amp;quot;&lt;/span&gt; };&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);&quot;&gt;&amp;amp;#160;&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;&quot;&gt;&lt;span style=&quot;color: rgb(0, 128, 0);&quot;&gt;// Register with the Notification Hub, passing the push channel uri and the string array of tags&lt;/span&gt;&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);&quot;&gt;await hub.RegisterNativeAsync(channel.Uri, tagsToSubscribeTo);&lt;/pre&gt;
</code></pre>
<!--CRLF --></div>
</div>
<h1></h1>
<h1>Building the Breaking News backend</h1>
<p>Regardless of how you build your backend, it can be an MVC website, a Web API, a WCF Service or even a console app, this is how you send the notification. Note that we specified the tag name “sports” when sending the notification. We didn’t have to loop over any records on our database to see who is interested in receiving sports update. It is all handled by the Notification Hub</p>
<div id="codeSnippetWrapper" style="margin: 20px 0px 10px; padding: 4px; border: 1px solid silver; width: 97.5%; text-align: left; line-height: 12pt; overflow: auto; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; cursor: text; direction: ltr; max-height: 200px; background-color: rgb(244, 244, 244);">
  <div id="codeSnippet" style="padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);">
    <pre style="margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &quot;Courier New&quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;"><span style="color: rgb(0, 128, 0);">// Create a hub client using the DefaultFullSharedAccessSignature</span></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);&quot;&gt;NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString(&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;&quot;&gt;    &lt;span style=&quot;color: rgb(0, 96, 128);&quot;&gt;&amp;quot;Endpoint=sb://[your service bus name].servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=[your DefaultFullSharedAccessSignature]&amp;quot;&lt;/span&gt;,&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);&quot;&gt;    &lt;span style=&quot;color: rgb(0, 96, 128);&quot;&gt;&amp;quot;[notification hub name]&amp;quot;&lt;/span&gt;&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;&quot;&gt;);&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);&quot;&gt;&amp;amp;#160;&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;&quot;&gt;&lt;span style=&quot;color: rgb(0, 128, 0);&quot;&gt;// Since we are using native notifications, we have to construct the payload in the format&lt;/span&gt;&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);&quot;&gt;&lt;span style=&quot;color: rgb(0, 128, 0);&quot;&gt;// the service is expecting. The example below is for sending a Toast notification on Windows 8&lt;/span&gt;&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;&quot;&gt;&lt;span style=&quot;color: rgb(0, 0, 255);&quot;&gt;string&lt;/span&gt; toastTemplate = &lt;span style=&quot;color: rgb(0, 96, 128);&quot;&gt;@&amp;quot;&amp;lt;toast&amp;gt;&amp;lt;visual&amp;gt;&amp;lt;binding template=&amp;quot;&lt;/span&gt;&lt;span style=&quot;color: rgb(0, 96, 128);&quot;&gt;&amp;quot;ToastText01&amp;quot;&lt;/span&gt;&lt;span style=&quot;color: rgb(0, 96, 128);&quot;&gt;&amp;quot;&amp;gt;&amp;lt;text id=&amp;quot;&lt;/span&gt;&lt;span style=&quot;color: rgb(0, 96, 128);&quot;&gt;&amp;quot;1&amp;quot;&lt;/span&gt;&lt;span style=&quot;color: rgb(0, 96, 128);&quot;&gt;&amp;quot;&amp;gt;{0}&amp;lt;/text&amp;gt;&amp;lt;/binding&amp;gt;&amp;lt;/visual&amp;gt;&amp;lt;/toast&amp;gt;&amp;quot;&lt;/span&gt;;&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);&quot;&gt;&amp;amp;#160;&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;&quot;&gt;&lt;span style=&quot;color: rgb(0, 128, 0);&quot;&gt;// This call essentialy broadcasts a push notification to ALL Windows 8 devices that are registered with the service&lt;/span&gt;&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);&quot;&gt;&lt;span style=&quot;color: rgb(0, 128, 0);&quot;&gt;// and registered to receive &amp;quot;sports&amp;quot; notifications&lt;/span&gt;&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: white;&quot;&gt;var payload = &lt;span style=&quot;color: rgb(0, 0, 255);&quot;&gt;string&lt;/span&gt;.Format(toastTemplate, &lt;span style=&quot;color: rgb(0, 96, 128);&quot;&gt;&amp;quot;Messi scored a goal against Brazil in the World Cup Finals&amp;quot;&lt;/span&gt;);&lt;/pre&gt;
</code></pre>
<!--CRLF -->
<pre><code>&lt;pre style=&quot;margin: 0em; padding: 0px; width: 100%; text-align: left; color: black; line-height: 12pt; overflow: visible; font-family: &amp;quot;Courier New&amp;quot;, courier, monospace; font-size: 8pt; direction: ltr; background-color: rgb(244, 244, 244);&quot;&gt;hub.SendWindowsNativeNotificationAsync(payload,&lt;span style=&quot;color: rgb(0, 96, 128);&quot;&gt;&amp;quot;sports&amp;quot;&lt;/span&gt;);&lt;/pre&gt;
</code></pre>
<!--CRLF --></div>
</div>
<p />
<h1>Closing</h1>
<p><a href="http://github.com/sabbour/breakingnews" target="_blank">Download the app</a> from GitHub and play around with it. In the next post, we’ll be covering an exciting feature called Templates. Until then!</p>
<div id="scid:0767317B-992E-4b12-91E0-4F059A8CECA8:bb40ac2e-944f-4eee-9997-1a079fbdc400" class="wlWriterEditableSmartContent" style="margin: 0px; padding: 0px; float: none; display: inline;">Technorati Tags: <a href="http://technorati.com/tags/notification+hub" rel="tag">notification hub</a>,<a href="http://technorati.com/tags/azure" rel="tag">azure</a>,<a href="http://technorati.com/tags/windows+azure" rel="tag">windows azure</a>,<a href="http://technorati.com/tags/windows+8" rel="tag">windows 8</a></div><blockquote class='note original-post'><div><p><strong>Note: </strong>This post originally appeared on my MSDN blog at 		<a href='http://blogs.msdn.com/b/africaapps/archive/2013/10/22/windows-azure-notification-hubs-tags-and-creating-a-breaking-news-app.aspx'>http://blogs.msdn.com/b/africaapps/archive/2013/10/22/w<!--kg-card-end: markdown-->
