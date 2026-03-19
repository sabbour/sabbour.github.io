---
layout: post
title: Creating Hashtag Monitor app. A application using Windows Azure Mobile Services
date: 2013-03-12T08:40:00.000Z
tags:
  - Windows Azure Mobile Services
  - Mobile Services
  - iOS
  - Windows Phone 8
  - Windows 8
  - Windows Phone
  - windows azure
  - Android
---

<!--kg-card-begin: markdown--><h2>Introduction</h2>
<p>In this post, I'll be creating an application that registers for monitoring a specific hashtag on twitter for new tweets. When there is a batch of new tweets, the application will be notified via a Push notification. I'll be using <a title="Windows Azure Mobile Services" href="http://www.windowsazure.com/en-us/develop/mobile/">Windows Azure Mobile Services</a>. If you didn't know, you can create up to 10 Mobile Services on Azure for free. So I recommend you <a title="go ahead and sign up right now" href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A6AE67820">go ahead and sign up right now</a>! </p>
<p>For this post, I'll be creating it as a Windows 8 app, but you can do the exact same thing on <a title="Windows Phone 8" href="http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-wp8/">Windows Phone 8</a>, <a title="iOS  " href="http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-ios/">iOS</a> and <a title="Android  " href="http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-android/">Android</a> as well.</p>
<h2>Let's start! </h2>
<p>First, we create a new Mobile Service on Azure.</p>
<p><a href="/content/images/msdn/5287.1.PNG"><img src="/content/images/msdn/5287.1.PNG" alt="" border="0" /></a></p>
<p>Then we need to register the newly created Mobile Service for push notifications using the Windows Notification Service (since we are developing a Windows 8 app). To do that, submit your app to the Windows Store. You must then configure your mobile service to integrate with WNS.</p>
<p>If you have not already registered your app, navigate to the <a href="http://go.microsoft.com/fwlink/p/?linkid=266582&amp;clcid=0x409">Submit an app page</a> at the Dev Center for Windows Store apps, log on with your Microsoft account, and then click <strong>App name</strong>.</p>
<p><img src="http://www.windowsazure.com/media/devcenter/mobile/mobile-services-submit-win8-app.png" alt="" /></p>
<p>Type a name for your app in <strong>App name</strong>, click <strong>Reserve app name</strong>, and then click <strong>Save</strong>.</p>
<p><img src="http://www.windowsazure.com/media/devcenter/mobile/mobile-services-win8-app-name.png" alt="" /></p>
<p>Go to <strong>Advanced features</strong>.</p>
<p><img src="http://www.windowsazure.com/media/devcenter/mobile/mobile-services-win8-edit-app.png" alt="" /></p>
<p>In the Advanced Features page, click <strong>Push notifications and Live Connect services info</strong>, then click <strong>Authenticating your service</strong>.</p>
<p><img src="http://www.windowsazure.com/media/devcenter/mobile/mobile-services-win8-app-push-connect.png" alt="" /></p>
<p>Make a note of the values of <strong>Client secret</strong> and <strong>Package security identifier (SID)</strong>.</p>
<p><img src="http://www.windowsazure.com/media/devcenter/mobile/mobile-services-win8-app-push-auth.png" alt="" /></p>
<p>Go back to the Mobile Service management portal, click on &quot;<strong>PUSH</strong>&quot;, then enter the Client Secret and Package SID</p>
<p><a href="/content/images/msdn/8664.2.PNG"><img src="/content/images/msdn/8664.2.PNG" alt="" border="0" /></a></p>
<h2>The backend</h2>
<p>Now we've configured the push notification integration, let's create a table to save the tags we want to be monitoring. Go to the &quot;<strong>DATA</strong>&quot; tab, click on Create, then name your table &quot;<strong>Tag</strong>&quot;.</p>
<p><a href="/content/images/msdn/5102.3.PNG"><img src="/content/images/msdn/5102.3.PNG" alt="" border="0" /></a></p>
<p>Now you have the basics ready, let's go on with the Windows 8 app.</p>
<h2>The app</h2>
<p>Open up Visual Studio and create a new Windows Store blank application.</p>
<p><a href="/content/images/msdn/8780.4.PNG"><img src="/content/images/msdn/8780.4.PNG" alt="" border="0" /></a></p>
<p>Now create a new Tag.cs class as a datastructure to store in our Table on the Mobile Service</p>
<pre class="scroll"><code class="csharp"> public class Tag<br /> {<br /> public int Id { get; set; }<br /> public string Hashtag { get; set; } // hashtag to monitor<br /> public string Channel { get; set; } // channel to push on, will fill later<br /> public int MaxId { get; set; } // last tweet we've seen on this tag<br /> }</code></pre>
<p>Now we need to connect this app to the Mobile Service we created. If you haven't installed the <a href="https://go.microsoft.com/fwLink/?LinkID=257545&amp;clcid=0x409" data-resource="quickstartInstallZumoSdkWin8">the Mobile Services SDK</a>, install it. In your Visual Studio project, add a reference to the &quot;<code>Windows Azure Mobile Services Client</code>&quot; extension.</p>
<p> </p>
<p> Go back to the Mobile Service dashboard, and click on &quot;Connect an existing Windows Store app&quot;</p>
<p><a href="/content/images/msdn/0728.5.PNG"><img src="/content/images/msdn/0728.5.PNG" alt="" border="0" /></a></p>
<p>then Copy and Past the code snippet you find there into the top of as a field App.xaml.cs</p>
<pre class="scroll"><code class="csharp">public static MobileServiceClient MobileService = new MobileServiceClient(<br /> &quot;https://socialmonitortest.azure-mobile.net/&quot;, <br /> &quot;aRandomKeySecretForYourApp&quot;<br /> );</code></pre>
<p>What this snippet does is that it provides you with an object that you can use to query your Mobile Service.</p>
<p>Now, to be able to use push notifications, the app first has to obtain a &quot;channel&quot; from the Windows Notification Service, then pass this channel to the Mobile Services so that Azure knows which device to push this notification to. This is very easy as well, just put the following code snippet just below the one to initialize the Mobile Service.</p>
<pre class="scroll"><code class="csharp"> // Define a variable to store the channel<br /> public static PushNotificationChannel CurrentChannel { get; set; }<br /> <br /> // When called, this method will obtain a channel and update the variable<br /> private async void AcquirePushChannel()<br /> {<br /> CurrentChannel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();<br /> }</code></pre>
<pre class="scroll"> </pre>
<p>Then call the <code>AcquirePushChannel()</code>method in the <code>OnLaunched()</code>of App.xaml.cs which will get a channel for you.</p>
<p>Update the app manifest to enable &quot;Toast Capable&quot;, so that you can receive the notifications.</p>
<p><img src="http://www.windowsazure.com/media/devcenter/mobile/mobile-app-enable-toast-win8.png" alt="" /></p>
<p>Add a text box and a button to your app, and wire to the Clicked event handler of the button to store the hashtag, the push channel in the Mobile Service</p>
<pre class="scroll"><code class="csharp"> private async void monitorButton_Click(object sender, RoutedEventArgs e)<br /> {<br /> var tag = new Tag {Hashtag = hashtagTextBox.Text, Channel = App.CurrentChannel.Uri};<br /> await App.MobileService.GetTable&lt;Tag&gt;().InsertAsync(tag);<br /> }</code></pre>
<p>Now, your app will store hashtags to be monitored into the Mobile Service</p>
<h2>The scheduler</h2>
<p>Now the app is ready, and the backend is ready, all what is left is to code the scheduler, which is also a part of Mobile Services to regularly query twitter for tweets on all the monitored hashtags, and push notifications to the registered channels.</p>
<p>Go to the &quot;SCHEDULER&quot; tab and create a new Schedule</p>
<p><a href="/content/images/msdn/7268.7.PNG"><img src="/content/images/msdn/7268.7.PNG" alt="" border="0" /></a></p>
<p>In the script, enter the below code</p>
<pre class="scroll"><code class="js">function HashtagMonitor() {<br /> var request = require('request'); <br /> var tagsTable = tables.getTable('tag');<br /> <br /> tagsTable.read({<br /> success: function(results) {<br /> results.forEach(<br /> function(tag) {<br /> var url = &quot;http://search.twitter.com/search.json?q=&quot;+encodeURIComponent(tag.Hashtag)<br /> <br /> // If we have retrieved tweets before, only return tweets later than those<br /> if(tag.MaxId&gt;0)<br /> url += &quot;&amp;since_id=&quot;+tag.MaxId;<br /> <br /> request(url,<br /> function(err, response, body) { <br /> var json = JSON.parse(body); <br /> <br /> // Store the max_id in the tag row<br /> // so that next time, we only return tweets more recent than this one<br /> updateMaxId(tag.id,json.max_id);<br /> <br /> // Get the number of results<br /> // If greater than zero, push a notification<br /> var resultCount = json.results.length;<br /> if(resultCount&gt;0)<br /> sendPushNotification(tag.Channel, tag.Hashtag, resultCount, json.results[0].profile_image_url);<br /> }); <br /> }<br /> ) <br /> }<br /> });<br /> }<br /> <br /> function updateMaxId(tagId, sinceId) {<br /> var tagsTable = tables.getTable('tag');<br /> tagsTable.where({ id: tagId }).read({<br /> success: function(items) {<br /> var item = items[0];<br /> item.MaxId = sinceId;<br /> tagsTable.update(item);<br /> }<br /> });<br /> }<br /> <br /> function sendPushNotification(channel,hashtag,count,imageUrl) {<br /> var bigImageUrl = imageUrl.replace(&quot;_normal&quot;,&quot;&quot;); <br /> // Toast<br /> push.wns.sendToastImageAndText01(channel, {<br /> text1: &quot;There are &quot; + count + &quot; new tweets on &quot; + hashtag,<br /> image1src: bigImageUrl,<br /> image1alt: &quot;profile&quot;<br /> });<br /> }</code></pre>
<pre class="scroll"> </pre>
<p>What this code does is that it queries our Tag table for entries, then for each row, it fires an HTTP request to the twitter API <code><a href="http://search.twitter.com/search.json?q=&quot;+encodeURIComponent(tag.Hashtag">http://search.twitter.com/search.json?q=&quot;+encodeURIComponent(tag.Hashtag</a>)</code> then parses the resulting JSON to extract the number of tweets, the profile picture of the latest tweeter and also the ID of the last tweet.</p>
<p>If there are new tweets (determined by the ID of the latest tweet), then a push notification is pushed to the channel that was stored in the Tag by the client, by calling the <code>push.wns.sendToastImageAndText01()</code> method. And because we configured Windows Notification Service in the Mobile Service configuration, that's all what it takes to push!</p>
<p><a href="/content/images/msdn/3264.8.PNG"><img style="border: 0px currentColor;" src="/content/images/msdn/3264.8.PNG" alt="" width="380" height="533" /></a></p><blockquote class='note original-post'><div><p><strong>Note: </strong>This post originally appeared on my MSDN blog at 		<a href='http://blogs.msdn.com/b/africaapps/archive/2013/03/12/creating-hashtag-monitor-app-a-application-using-windows-azure-mobile-services.aspx'>http://blogs.msdn.com/b/africaapps/archive/2013/03/12/creating-hashtag-monitor-app-a-application-using-windows-azure-mobile-services.aspx</a></p></div></blockquote><!--kg-card-end: markdown-->
