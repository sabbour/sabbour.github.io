---
layout: post
title: Kubernetes CI/CD pipelines using Azure DevOps
date: 2018-12-13T03:05:17.000Z
tags:
  - devops
  - kubernetes
  - cicd
---

<p>If you're doing Kubernetes, you should definitely be doing Continuous Integration and Continuous Deployment (CI/CD) and the tools to help you do so are a dime a dozen.</p><p>I work at Microsoft, so I obviously have some bias to our tools, but regardless, I find that <a href="https://azure.microsoft.com/en-us/services/devops/">Azure DevOps</a> is actually a great suite of tools that you should certainly consider, and you know what, <strong>you can use it for free</strong>. So, in this post, I'm going to document how I would do a CI/CD pipeline using Azure DevOps, Azure Kubernetes Service and Azure Container Registry to build, package and deploy apps.</p><h2 id="one-repo-two-repos">One repo, two repos?</h2><p>There are multiple opinions on whether you should store code and configuration in the same repository, with everything that is needed to deploy a "service" in a single place, or if it would be better to split them up into two repositories.</p><p>In my approach, I chose the latter, that is splitting them up in two repositories for two main reasons:</p><!--kg-card-begin: markdown--><ol>
<li>Seperation of concerns - the source code of the application doesn't need to know or be concerned with how it is deployed. You could be deploying it on Kubernetes using YAML files, using Helm charts, or using Terraform. It doesn't need to know and you can manage this separately.</li>
<li>Having code and config in the same repository assumes that they are tightly coupled. If you changed the configuration of Kubernetes to add an ingress or increase the replica count, you would end up building a redundant Docker image and pushing that into your repository, unless you get fancy with path filters and your build system supports this.</li>
</ol>
<!--kg-card-end: markdown--><figure class="kg-card kg-image-card kg-card-hascaption"><img src="__GHOST_URL__/content/images/2018/12/cicd-1.png" class="kg-image" alt loading="lazy"><figcaption>CI/CD pipeline</figcaption></figure><p>Alright, let's get into the details. I'm going to be using <a href="https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started-yaml?view=vsts">Azure Pipelines (YAML)</a> for the <em>build</em> pipelines. At the time of this writing, the <em>release </em>pipelines YAML support is <a href="https://docs.microsoft.com/en-us/azure/devops/release-notes/">on the roadmap</a>, so I'll have to revert to using the graphical designer for that.</p><p>I'm also going to assume the code lives in a Git repo on Azure Repos but it doesn't have to be. Azure Pipelines can run builds on a variety of sources, including GitHub, BitBucket and others.</p><h2 id="application">Application</h2><p>The application is a microservice, written in Go with a Dockerfile to build the application into a container.</p><h2 id="code-build-pipeline">Code build pipeline</h2><p>For the build pipeline, create an <code>azure-pipelines.yml</code> file in the repository with the content below.</p><p>The pipeline is really simple, it runs <code>docker build</code> and <code>docker push</code>.</p><!--kg-card-begin: markdown--><pre><code class="language-yaml">pool:
  vmImage: 'Ubuntu 16.04'

variables:
  imageName: 'captureorder:$(Build.BuildId)'
  # define three more variables acrName, dockerId and dockerPassword in the build pipeline in UI

steps:
- script: docker build -f Dockerfile -t $(acrName).azurecr.io/$(imageName) .
  displayName: 'docker build'

- script: docker login -u $(dockerId) -p $(dockerPassword) $(acrName).azurecr.io
  displayName: 'docker login'

- script: docker push $(acrName).azurecr.io/$(imageName)
  displayName: 'docker push'
</code></pre>
<!--kg-card-end: markdown--><p>From your code repository, click <strong>Set up build.</strong></p><figure class="kg-card kg-image-card"><img src="__GHOST_URL__/content/images/2018/12/2-setup-build.png" class="kg-image" alt loading="lazy"></figure><p>Select the <strong>YAML</strong> from <strong>Configuration as code.</strong></p><figure class="kg-card kg-image-card"><img src="__GHOST_URL__/content/images/2018/12/2-config-as-code.png" class="kg-image" alt loading="lazy"></figure><p>Browse to and select the <code>azure-pipelines.yml</code> file in your repository. You should also change the agent to be <code>Hosted Ubuntu 16.04</code>.</p><figure class="kg-card kg-image-card"><img src="__GHOST_URL__/content/images/2018/12/2-agent-yaml.png" class="kg-image" alt loading="lazy"></figure><p>Notice the variables like <code>$(Build.BuildId)</code>, <code>$(acrName)</code>, <code>$(dockerId)</code> and <code>$(dockerPassword)</code>.</p><p>The first one is a <a href="https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables">pre-defined build variable</a> that will map to the current generated build ID, essentially allowing you to have a unique ID per build that we append to the image name that gets pushed to Azure Container Registry. </p><p>The other 3 variables will need to be defined in the pipeline UI.</p><!--kg-card-begin: markdown--><ul>
<li><code>dockerId</code>: The admin user name/Service Principal ID for the Azure Container Registry.</li>
<li><code>acrName</code>: The Azure Container Registry name.</li>
<li><code>dockerPassword</code>: The admin password/Service Principal password for Azure Container Registry.</li>
</ul>
<!--kg-card-end: markdown--><p>Refer to <a href="https://docs.microsoft.com/en-us/azure/container-registry/container-registry-auth-aks#access-with-kubernetes-secret">https://docs.microsoft.com/en-us/azure/container-registry/container-registry-auth-aks#access-with-kubernetes-secret</a> to obtain the Service Principal ID/Service Principal Password or enable the Azure Container Registry admin user.</p><figure class="kg-card kg-image-card kg-card-hascaption"><img src="__GHOST_URL__/content/images/2018/12/2-variable-group.png" class="kg-image" alt loading="lazy"><figcaption>Define acrName, dockerId and dockerPassword as pipeline variables</figcaption></figure><p>Run the build pipeline and verify that it works.</p><figure class="kg-card kg-image-card"><img src="__GHOST_URL__/content/images/2018/12/2-build-pipeline-log.png" class="kg-image" alt loading="lazy"></figure><p>Confirm that the image ends up in your Azure Container Registry.</p><figure class="kg-card kg-image-card"><img src="__GHOST_URL__/content/images/2018/12/2-image-acr-2.png" class="kg-image" alt loading="lazy"></figure><h2 id="config-build-pipeline">Config build pipeline</h2><p>As mentioned earlier, I chose to store YAML config data in its own repository. For simplicity's sake, I'll start with one big monolith YAML file called <code>kubernetes.yaml</code> stored in the <code>yaml</code> directory. In a later post, I'll break this down into a Helm chart.</p><p>The <code>kubernetes.yaml</code> content looks like the below. The interesting part is the <code>##BUILD_ID##</code> placeholder in the file. This placeholder will get replaced in the deployment pipeline with the actual image build ID that triggered the deployment.</p><!--kg-card-begin: markdown--><pre><code class="language-yaml">apiVersion: apps/v1
kind: Deployment
metadata:
  name: captureorder
spec:
  selector:
    matchLabels:
      app: captureorder
  template:
    metadata:
      labels:
        app: captureorder
    spec:
      containers:
      - name: captureorder
        image: akschallengeregistry.azurecr.io/captureorder:##BUILD_ID##
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: captureorder
spec:
  selector:
    app: captureorder
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
</code></pre>
<!--kg-card-end: markdown--><p>Similar to the code pipeline, I also have a <code>azure-pipelines.yml</code> file defining the build pipeline for the config repository. The steps here are really simple, just publish the <code>yaml</code> folder which includes the <code>kubernetes.yaml</code> file as a built artifact.</p><!--kg-card-begin: markdown--><pre><code class="language-yaml">pool:
  vmImage: 'Ubuntu 16.04'

steps:
- task: PublishBuildArtifacts@1
  displayName: 'publish yaml folder as an artifact'
  inputs:
    artifactName: 'yaml'
    pathToPublish: 'yaml'
</code></pre>
<!--kg-card-end: markdown--><h2 id="deployment-pipeline">Deployment pipeline</h2><p>Create a continuous deployment pipeline that triggers upon <strong>either new container images</strong> or <strong>new YAML configuration artifacts</strong> to deploy the changes to your cluster.</p><p>Configure a <strong>Service Connection</strong> so that Azure DevOps can access resources in your Azure Resource Group for deployment and configuration purposes.</p><figure class="kg-card kg-image-card"><img src="__GHOST_URL__/content/images/2018/12/3-create-service-connection.png" class="kg-image" alt loading="lazy"></figure><p>Pick the Azure Resource Group you're using.</p><figure class="kg-card kg-image-card"><img src="__GHOST_URL__/content/images/2018/12/3-resource-group-service-connection.png" class="kg-image" alt loading="lazy"></figure><p>Create a Release Pipeline, start with an Empty template. Add an <strong>Azure Container Registry</strong> artifact as a trigger and enable the continuous deployment trigger. </p><p>Make sure to configure it to point to the Azure Container Registry repository where the build pipeline is pushing the <code>captureorder</code> image.</p><p>This means that for every image that gets pushed into Azure Container Registry that match the repository configuration, the release pipeline will get triggered and it will have in its release variables the actual image tag that triggered the release.</p><figure class="kg-card kg-image-card"><img src="__GHOST_URL__/content/images/2018/12/3-artifact.png" class="kg-image" alt loading="lazy"></figure><p>Add another Build artifact coming from the configuration build pipeline as a trigger and enable the continuous deployment trigger. This is the trigger for changes in the YAML configuration.</p><figure class="kg-card kg-image-card"><img src="__GHOST_URL__/content/images/2018/12/3-artifact-2-1.png" class="kg-image" alt loading="lazy"></figure><p>Now, start adding tasks to the default stage. Make sure the agent pool is <strong>Hosted Ubuntu 16.04</strong> then add an <em>inline</em> <strong>Bash Script</strong> task that will do a token replacement to replace <code>##BUILD_ID##</code> in the <code>kubernetes.yaml</code> file coming from the artifact with the actual build being released. Remember that <code>kubernetes.yaml</code> was published as a build artifact.</p><!--kg-card-begin: markdown--><p>You'll want to get the Docker container tag incoming from the Azure Container Registry trigger to replace the <code>##BUILD_ID##</code> token.</p>
<p>If you named that artifact <strong>_captureorder</strong>, the build number will be in an environment variable called <code>RELEASE_ARTIFACTS__CAPTUREORDER_BUILDNUMBER</code>. Similarly for the other artifact <strong>_azch-captureorder-kubernetes</strong>, its build ID would be stored in <code>RELEASE_ARTIFACTS__AZCH-CAPTUREORDER-KUBERNETES-CI_BUILDID</code>.</p>
<p>You can use the following inline script that uses the <code>sed</code> tool.</p>
<pre><code class="language-sh">sed -i &quot;s/##BUILD_ID##/${RELEASE_ARTIFACTS__CAPTUREORDER_BUILDNUMBER}/g&quot; &quot;$SYSTEM_ARTIFACTSDIRECTORY/_azch-captureorder-kubernetes-CI/yaml/kubernetes.yaml&quot;
</code></pre>
<!--kg-card-end: markdown--><figure class="kg-card kg-image-card"><img src="__GHOST_URL__/content/images/2018/12/3-bash-task.png" class="kg-image" alt loading="lazy"></figure><p>Add a <strong>Deploy to Kubernetes</strong> task, switch to the latest version (1.0 at the time of writing). Configure access to your AKS cluster using the service connection created earlier.</p><figure class="kg-card kg-image-card"><img src="__GHOST_URL__/content/images/2018/12/3-kubernetes-task.png" class="kg-image" alt loading="lazy"></figure><p>Scroll down and check <strong>Use configuration files</strong> and use the following value <code>$(System.DefaultWorkingDirectory)/_azch-captureorder-kubernetes-CI/yaml/kubernetes.yaml</code> or select it from the browse button. You are essentially picking the <code>kubernetes.yaml</code> file from the build artifact.</p><figure class="kg-card kg-image-card"><img src="__GHOST_URL__/content/images/2018/12/3-kubernetes-task-browse.png" class="kg-image" alt loading="lazy"></figure><p>Create a manual release and pick the latest build as the source. Verify the release runs and that the <code>captureorder</code> service is deployed.</p><figure class="kg-card kg-image-card"><img src="__GHOST_URL__/content/images/2018/12/3-create-release-2.png" class="kg-image" alt loading="lazy"></figure><p>Make a change to the application source code, commit the change and watch the pipelines build and release the new version. Make a change to the configuration (for example, change the number of replicas), commit the change and watch the pipelines update your configuration.</p><h2 id="closing">Closing</h2><p>I hope you found this useful. It certainly isn't the only way to create a CI/CD pipeline for Kubernetes, but it is a way that I found really convenient and flexible. In a future post, I'll replace the YAML config with a Helm chart.</p>
