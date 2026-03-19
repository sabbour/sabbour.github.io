---
layout: post
title: Secure Service Fabric on Linux inside an existing Virtual Network
date: 2018-04-08T13:23:23.000Z
tags:
  - service-fabric
  - linux
  - containers
---

<!--kg-card-begin: markdown--><p>This guide will help you create a Secured Linux Service Fabric cluster that runs inside an <strong>existing</strong> Virtual Network and Subnet using the Azure CLI.</p>
<blockquote>
<p>You can get the <a href="https://github.com/sabbour/service-fabric-linux-vnet">required template and parameters json files</a> from my <a href="https://github.com/sabbour/service-fabric-linux-vnet">GitHub</a>. The template is based on the <a href="https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master">sample published here</a> and is modified to provision into an existing Virtual Network and Subnet.</p>
</blockquote>
<blockquote>
<p>This guide assumes you already have a Virtual Network created with a Subnet where you want to deploy Service Fabric. If not, you need to create the Virtual Network and Subnet first and specify the values below.</p>
</blockquote>
<h3 id="specifyvariablevalues">Specify variable values</h3>
<pre><code class="language-sh">declare rg=sf-rg # Resource Group Name
export location=westeurope # Region
export sfName=sfcluster # Service Fabric cluster name
</code></pre>
<h3 id="createresourcegroup">Create Resource Group</h3>
<pre><code class="language-sh">az group create -n $rg -l $location
</code></pre>
<h3 id="modifytheparametersjsonfileandreplace">Modify the <strong>parameters.json</strong> file and replace:</h3>
<ul>
<li><code>clusterName</code> with your Service Fabric cluster name</li>
<li><code>clusterLocation</code> with your region name</li>
<li><code>adminUserName</code> with your VM admin username</li>
<li><code>adminPassword</code> with your VM admin password</li>
<li><code>existingVirtualNetworkNameRGName</code> with your existing Virtual Network Resource Group name</li>
<li><code>existingVirtualNetworkName</code> with your existing Virtual Network name</li>
<li><code>existingSubnetName</code> with your existing Virtual Network name</li>
<li><code>existingSubnetPrefix</code> with your existing Virtual Network name</li>
</ul>
<h3 id="createthefoldertostorethecertificates">Create the folder to store the certificates</h3>
<pre><code class="language-sh">mkdir -p certs
</code></pre>
<h3 id="createtheclusterandgenerateacertificate">Create the cluster and generate a certificate</h3>
<pre><code class="language-sh">az sf cluster create-n $sfName -g $rg -l $location \
--certificate-output-folder certs \
--certificate-subject-name &quot;$sfName.$location.cloudapp.azure.com&quot; \
--template-file template.json --parameter-file parameters.json
</code></pre>
<h3 id="verifythattheclusterisup">Verify that the cluster is up</h3>
<p>Wait until the command below shows <strong>Ready</strong>. It may take a while.</p>
<pre><code class="language-sh">az sf cluster show -n $sfName -g $location --query clusterState
</code></pre>
<h3 id="connecttothecluster">Connect to the cluster</h3>
<p>Once the cluster is up and running, connect using <a href="https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cli">sfctl</a></p>
<pre><code class="language-sh">sfctl cluster select --endpoint https://&quot;$sfName.$location.cloudapp.azure.com&quot;:19080 --pem /path/to/certificate.pem --no-verify
</code></pre>
<h3 id="verifyclusterhealth">Verify cluster health</h3>
<pre><code class="language-sh">sfctl cluster health
</code></pre>
<h3 id="accesstheservicefabricexplorerinyourbrowser">Access the Service Fabric Explorer in your browser</h3>
<p>Make sure you install either the <code>.pem</code> or the <code>.pfx</code> certificate on your machine, depending on your operating system, then:</p>
<ul>
<li>Go to <a href="https://:19080%5Bclustername%5D.%5Bregion%5D.cloudapp.azure.com/Explorer">https://:19080[clustername].[region].cloudapp.azure.com/Explorer</a></li>
<li>When prompted, select the cluster certificate to authenticate.</li>
</ul>
<!--kg-card-end: markdown-->
