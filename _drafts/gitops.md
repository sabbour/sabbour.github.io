---
layout: post
title: GitOps for containers on Azure
date: 2018-05-13T12:42:33.000Z
---

<!--kg-card-begin: markdown--><h2 id="concepts">Concepts</h2>
<ul>
<li>Using <a href="https://datasift.github.io/gitflow/IntroducingGitFlow.html">GitFlow</a> branching model.</li>
<li>More information on <a href="http://nvie.com/posts/a-successful-git-branching-model/">GitFlow</a>.</li>
<li>This is biased towards using Azure services (VSTS, Azure Container Build) but many of those can be replaced with other services (Jenkins, etc.)</li>
</ul>
<p>Check In -&gt; Build Docker -&gt; Verify image using Anchore -&gt; Build Helm chart<br>
Release -&gt; Deploy Helm Chart -&gt; Pull Secrets from Key Vault</p>
<p><a href="https://github.com/demo42">https://github.com/demo42</a><br>
docker tagging best practices: <a href="https://blogs.msdn.microsoft.com/stevelasker/2018/03/01/docker-tagging-best-practices-for-tagging-and-versioning-docker-images/">https://blogs.msdn.microsoft.com/stevelasker/2018/03/01/docker-tagging-best-practices-for-tagging-and-versioning-docker-images/</a></p>
<p><a href="https://blog.turbinelabs.io/deploy-not-equal-release-part-one-4724bc1e726b">https://blog.turbinelabs.io/deploy-not-equal-release-part-one-4724bc1e726b</a></p>
<h2 id="ideas">Ideas</h2>
<ul>
<li>Why is this important?
<ul>
<li>Developers like code</li>
<li>It isn't a good idea to expose kubectl for everyone</li>
</ul>
</li>
<li>Seperate cluster per organization. Probably easier than RBAC and groups.</li>
<li>Multiple environments</li>
<li>Web Hooks</li>
<li>Chart Museum</li>
<li>Monocular</li>
<li>Branch policies on master to build for CI <a href="https://docs.microsoft.com/en-us/vsts/git/branch-policies?view=vsts">https://docs.microsoft.com/en-us/vsts/git/branch-policies?view=vsts</a></li>
<li>Secrets from Azure Key Vault <a href="https://docs.microsoft.com/en-us/vsts/build-release/concepts/library/variable-groups?view=vsts">https://docs.microsoft.com/en-us/vsts/build-release/concepts/library/variable-groups?view=vsts</a></li>
<li>URLs (xip/nip.io? azure dns?)</li>
<li>Provision the cluster itself via ARM/Terraform</li>
<li>Maintain the YAML files on Git and declaratively apply them</li>
<li>Docker/Helm?</li>
<li>Helm test</li>
<li>Tests</li>
<li>Build branches into their own namespace</li>
<li>Pull requests, tags</li>
<li>ACR build (later)</li>
<li>Anchore integration <a href="https://anchore.freshdesk.com/support/solutions/articles/36000060726-installing-anchore-using-helm">https://anchore.freshdesk.com/support/solutions/articles/36000060726-installing-anchore-using-helm</a></li>
</ul>
<h2 id="guide">Guide</h2>
<ul>
<li>Create Storage Account for artifacts</li>
<li>
<h2 id="repositoryforinfrastructureviaarm">Repository for infrastructure via ARM</h2>
</li>
</ul>
<!--kg-card-end: markdown-->
