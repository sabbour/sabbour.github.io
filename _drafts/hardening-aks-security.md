---
layout: post
title: Hardening your Azure Kubernetes Service (AKS) cluster security
date: 2018-10-07T10:39:51.000Z
---

<p>When it comes to securing your cluster for production, it is an evolving aspect of Kubernetes and my intention is to document those best practices that tackle multiple aspects of your cluster's security and keep it updated.</p><h2 id="authentication-authorization">Authentication/Authorization</h2><p>One of the things that most developers/admins start with is passing around the <code>~/.kube/config</code> file they get from running <code>az aks get-credentials</code> to connect to the Kubernetes cluster. This is a bad security practice because the credentials of that user allow super-user access to perform any action on any resource. It has full control over every resource in the cluster and in all namespaces.</p><p>The most obvious fix is to use <a href="https://kubernetes.io/docs/reference/access-authn-authz/rbac/">Kubernetes RBAC</a> and fortunatley, new AKS clusters come with RBAC enabled by default. You could <a href="https://www.cncf.io/blog/2018/08/01/demystifying-rbac-in-kubernetes/">manage users and groups on Kubernetes directly</a><a> </a>but there is a better way.</p><p>AKS can be configured to use Azure Active Directory (AD) for user authentication. In this configuration, you can log into an AKS cluster using your Azure Active Directory authentication token. Additionally, cluster administrators are able to configure Kubernetes role-based access control (RBAC) based on a users identity or directory group membership.</p><p>Follow the instructions on the Azure documentation to <a href="https://docs.microsoft.com/en-us/azure/aks/aad-integration">integrate Azure Active Directory with Azure Kubernetes Service</a>.</p><h2 id="namespace-isolation-and-limits">Namespace isolation and limits</h2><p>Once you have setup RBAC, it is a good idea to create separate namespaces per project/environment. It is not a good idea to deploy anything to the <code>default</code> namespace.</p><h3 id="isolation">Isolation</h3><p><a href="https://github.com/Azure/k8s-best-practices/blob/master/securing_a_cluster/role_deployment_manager.yaml">https://github.com/Azure/k8s-best-practices/blob/master/securing_a_cluster/role_deployment_manager.yaml</a></p><h3 id="limits">Limits</h3><p>The default Kubernetes behavior is that a pod will run with unbounded CPU and memory requests/limits. To avoid pods taking over the cluster resources and starving other deployments, it is recommended to configure default limits and resource quotas over namespaces.</p><p>Here is an example <code>LimitRange</code> config that specifies the default, minimum and maximum CPU/memory and storage for pods created in the <code>dev</code> namespace.</p><pre><code>apiVersion: v1
kind: LimitRange
metadata:
  name: dev-limit-range
  namespace: dev
spec:
  limits:
  - default:
      cpu: 0.5
      memory: 512Mi
    defaultRequest:
      cpu: 0.25
      memory: 256Mi
    max:
      cpu: 1
      memory: 1Gi
    min:
      cpu: 200m
      memory: 256Mi
    type: Container
  - max:
      storage: 2Gi
    min:
      storage: 1Gi
    type: PersistentVolumeClaim</code></pre><p>Here is an example <code>ResourceQuota</code> that limits the maximum agregate CPU/memory and storage created in the <code>dev</code> namespace.</p><pre><code>apiVersion: v1
kind: ResourceQuota
metadata:
  name: dev-resource-quota
  namespace: dev
spec:
  hard:
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
    persistentvolumeclaims: "5"
    requests.storage: "10Gi"</code></pre><h2 id="prevent-privilege-escalation">Prevent privilege escalation</h2><p>Pods breaking out of the sandbox and accessing the host are a grave security risk and can wreak havoc in your cluster. Unless you explicitly deny it, any pod can be deployed to run as root.</p>
