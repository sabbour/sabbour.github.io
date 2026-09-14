---
layout: post
title: "Introducing Agentweaver: an experiment in multi-agent orchestration on Kubernetes"
date: 2026-09-13T22:00:00.000Z
description: "Why I'm building Agentweaver: to make agent teams useful beyond my terminal and learn what Kubernetes should handle for the people building with them."
image: /assets/images/2026-09-13-introducing-agentweaver/hero.png
tags:
  - ai
  - agents
  - devops
  - open-source
---

I spent time giving [Squad](https://github.com/bradygaster/squad) and Copilot instructions for my preferred workflow. They followed it well, until they didn't. I still had to notice when the process drifted and remind the agents what was supposed to happen next.

About four months ago, I started building [Agentweaver](https://github.com/sabbour/agentweaver) to give agent teams a workflow that could run without me supervising every handoff.

My [earlier work with Squad](/2026/04/30/building-software-with-squad-governance-layers.html) had shown me the appeal of multi-agent orchestration: divide a job among agents, coordinate their handoffs, and bring the results together. One agent implements a change while another writes tests or reviews it. For complex work, focused assignments and independent review can help.

I needed a deterministic, yet dynamic, workflow. The runtime would enforce dependencies and approval gates, while agents could decide how to approach their tasks. I could revise the plan without relying on the model to remember the process at every turn.

## From an idea to something I can try

Suppose you have an idea for a small app. It probably doesn't arrive as a complete specification. In Agentweaver, capture it on the board, add context, and prioritize it alongside other ideas. Move it to Ready when it's defined well enough for the team to pick up.

You don't have to assemble the team from scratch. A [project blueprint](https://sabbour.me/agentweaver/guide/blueprints) brings together specialized roles, workflows, and review rules. Start with a familiar setup, then adapt the team and its skills. For unfamiliar work, describe the goal and generate a blueprint to review before applying it.

The workflows are inspectable and editable too. Generate a draft, adjust its steps and gates, and save it once it passes validation. Pick a workflow yourself or let the coordinator choose from the project's available options.

The coordinator helps clarify the goal, with a chance to confirm or revise its understanding before execution. It stores a plan and dispatches work as dependencies finish. The planning conversation doesn't have to stay alive to keep the team moving.

[![A person describes the work, reviews the coordinator's proposed plan and gates, and confirms or revises it. The coordinator dispatches ready work to a sandbox, collects results, and returns for approval.](/assets/images/2026-09-13-introducing-agentweaver/blog-agentweaver-coordinator.png)](/assets/images/2026-09-13-introducing-agentweaver/blog-agentweaver-coordinator.png)


For software, this is the "inner agentic developer lifecycle" I wanted: planning, implementation, testing, review, and revision before publishing to GitHub. The default workflow applies safety and human review before attempting a merge and pull request, then records the outcome. GitHub CI and team review still apply afterward.

## Why self-hosting matters

I wanted to choose where the agents run and which models they use. That choice matters even more when a team's code and data have to stay inside its own environment.

Agentweaver supports GitHub Copilot and bring-your-own OpenAI-compatible endpoints. That could mean a Microsoft Foundry endpoint or a compatible model in your own cluster. You choose model access separately from where commands execute.

In the [Azure Kubernetes Service (AKS) deployment](https://sabbour.me/agentweaver/deep-dive/infra-deployment), the API and background services own orchestration and durable state. AgentHost runs model sessions in isolated sandbox pods, with separate command execution and scoped credentials. Permission to run a build shouldn't grant access to another project's files or the platform's secrets.

I build Agentweaver with [Squad](https://github.com/bradygaster/squad). [Microsoft Agent Framework](https://github.com/microsoft/agent-framework) runs the workflows, the [GitHub Copilot SDK](https://github.com/github/copilot-sdk) powers agent sessions, and the [Agent Governance Toolkit](https://github.com/microsoft/agent-governance-toolkit) enforces tool-use policies. On Kubernetes, [agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox) supplies sandbox claims and warm pools. [Microsoft Execution Containers](https://github.com/microsoft/mxc) (MXC) provides command-execution sandboxes on laptops and adds defense in depth inside Kubernetes sandboxes.

## What I want Kubernetes to take over

Building Agentweaver has made me spend more time on what happens between agent turns. Kubernetes can keep the agent's processes running, but Agentweaver still has to preserve what they're working on: the plan, completed steps, pending approvals, and context needed to continue. Much of that work would be useful to any application running agents.

Today, [PostgreSQL holds much of Agentweaver's state](https://sabbour.me/agentweaver/deep-dive/data-persistence): runs, plans, review history, events, memory, and workflow checkpoints, including conversations. Workspaces and Git worktrees live on Azure Files. PostgreSQL got the system working, but coordinating tasks, replaying events, and retrieving useful memories have different needs. It might not be the best fit for all of them.

Run storage, event streams, checkpoints, workspace access, and sandbox execution already sit behind interfaces. Those give specialized providers places to take over while preserving the guarantees the workflow relies on. The picture below captures that broader direction, including capabilities still to be built.

[![Platform view linking Agentweaver's control plane to workflow, model, and governance components; isolated execution sits above durable events, workspaces, memory, and connected services. The execution-container and snapshot path is conceptual.](/assets/images/2026-09-13-introducing-agentweaver/blog-agentweaver-microsoft-agent-platform.png)](/assets/images/2026-09-13-introducing-agentweaver/blog-agentweaver-microsoft-agent-platform.png)

Agentweaver already uses [agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox) claims and warm pools on AKS. I'd like to build on that toward an agent substrate that assigns ready work to suitable compute and releases capacity when agents are waiting.

That needs filesystems and context that follow the work. Workflow checkpoints aren't live pod snapshots; Agentweaver doesn't snapshot its running pods today. Restoring a whole execution environment is something I'd like the underlying platform to handle.

I'd also like the platform to handle agent identity and authentication to protected resources, such as private repositories, internal APIs, and MCP servers. An agent should have only the access delegated for its task, using short-lived credentials kept out of its context. That identity should follow the work when it moves between pods, with access checked again before execution resumes.

I'm excited about upcoming projects in this space because they could make these common Kubernetes platform capabilities. Where specialized providers do the job better, they should replace the implementations in Agentweaver.

## What success would look like for me

Agentweaver is still alpha software, it is an experiment. To try it, follow the [getting started guide](https://sabbour.me/agentweaver/guide/getting-started) with a disposable project and a task small enough to judge. I also want to continue developing Agentweaver using Agentweaver itself, so its own development tests the workflow.

The larger goal is to move as much of what Agentweaver does today as possible into the underlying Kubernetes platform. I'd be happy if that made half my orchestration and sandboxing code unnecessary. A team building software and a team writing content should be able to use the same platform capabilities, each with its own process. Agentweaver is how I'm learning what those capabilities need to be.
