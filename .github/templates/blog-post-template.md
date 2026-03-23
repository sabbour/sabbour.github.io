---
layout: post
title: Sentence-case title that describes the post
date: 2026-01-15T09:00:00.000Z
description: A one-to-two sentence summary of the post for social sharing and SEO. Keep it under 160 characters.
image: /assets/images/YYYY-MM-DD-slug/hero.png
tags:
  - azure
  - kubernetes
---

Start with a one-to-two sentence hook that tells the reader what this post covers and why it matters to them. Get to the point fast. Don't waste the opening on background.

## The problem

Describe the challenge or scenario. Keep it short (two to three paragraphs). Use second person ("you") and present tense. Show empathy for the reader's situation.

## Prerequisites

List what the reader needs before starting:

- An Azure subscription ([create a free account](https://azure.microsoft.com/free/))
- Azure CLI installed
- A working Azure Kubernetes Service (AKS) cluster

## How it works

Explain the concept or architecture at a high level. Use a diagram or image if it helps:

![Architecture diagram showing traffic flow from Ingress to the back-end Service](images/architecture.png)

Break complex ideas into short paragraphs (three to seven lines each). Define acronyms on first use. For example, Container Network Interface (CNI).

## Set up the environment

Walk through the steps. Use numbered lists for sequential procedures and keep each list to seven steps or fewer.

1. Sign in to the Azure portal.
2. Open Azure Cloud Shell or your local terminal.
3. Create a resource group:

   ```bash
   az group create --name myResourceGroup --location eastus
   ```

4. Create an AKS cluster with a managed identity:

   ```bash
   az aks create \
     --resource-group myResourceGroup \
     --name myAKSCluster \
     --node-count 3 \
     --generate-ssh-keys
   ```

5. Get the cluster credentials:

   ```bash
   az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
   ```

## Deploy the application

Continue with the next logical phase. Each major section should have a clear heading in sentence case.

Apply the Deployment manifest:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: myregistry.azurecr.io/myapp:latest
          ports:
            - containerPort: 8080
```

```bash
kubectl apply -f deployment.yaml
```

Verify the pods are running:

```bash
kubectl get pods -l app=myapp
```

## Verify the results

Show the reader how to confirm everything works. Include expected output when it helps:

```text
NAME                     READY   STATUS    RESTARTS   AGE
myapp-6d4f7b8c9-abc12   1/1     Running   0          45s
myapp-6d4f7b8c9-def34   1/1     Running   0          45s
myapp-6d4f7b8c9-ghi56   1/1     Running   0          45s
```

## Clean up resources

Help the reader avoid unexpected charges:

```bash
az group delete --name myResourceGroup --yes --no-wait
```

## Next steps

Wrap up with two to four concrete next steps. Link to relevant docs or related posts:

- Learn more about [AKS networking concepts](https://learn.microsoft.com/azure/aks/concepts-network)
- Try [scaling your cluster with KEDA](https://learn.microsoft.com/azure/aks/keda-about)
- Read about [Helm charts for Kubernetes deployments](/2018/12/13/kubernetes-ci-cd-pipelines-using-azure-devops/)
