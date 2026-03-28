---
layout: post
title: Teaching my coding agent to do PM work
date: 2026-03-28T00:00:00.000Z
description: I built a set of reusable GitHub Copilot skills that encode PM workflows so a coding agent can research, write PRDs, design UX, and prototype features.
image: /assets/images/2026-03-28-pm-skills-workflow/hero.png
tags:
  - ai
  - product-management
  - github-copilot
  - azure
---

Product management involves a lot of structured, repeatable work. Gather customer signals. Write a PRD. Get it reviewed. Name the feature. Design the Portal UX. Build a prototype. Write a blog post about it. Each step has a predictable shape, and I kept noticing that I was giving my coding agent the same instructions over and over.

So I turned those instructions into reusable skills.

## What are agent skills?

GitHub Copilot's agent mode can follow instructions packaged as skill files. A skill is a Markdown file (`SKILL.md`) with YAML frontmatter that describes when the skill should trigger, plus structured instructions the agent follows to complete a task. You can bundle skills into plugins, install them from a marketplace, and invoke them by name.

The key insight: skills aren't just prompts. They're executable knowledge. They encode a workflow, including what tools to call, what research to do first, what structure the output should follow, and what guardrails to enforce. A well-written skill makes the agent produce consistent, high-quality output without you babysitting it.

## The PM workflow I automated

I packaged my PM workflows into a repo called [aks-pm-skills](https://github.com/azure-management-and-platforms/aks-pm-skills), organized into two plugins: one for PM workflows and one for dev workflows.

The core PM workflow chains five skills together to take a feature from initial research to a clickable prototype:

1. **Gather customer signals** — Searches 10+ sources (GitHub issues, Stack Overflow, Reddit, Microsoft Q&A, internal channels, IcM incidents, support cases, Kusto telemetry) to build a comprehensive picture of customer pain.

2. **Write a PRD** — Takes the customer signals and a problem statement, runs parallel deep research (competitive analysis against GKE and EKS, Azure API surface, RBAC permissions, ecosystem context), then writes a structured PRD in sections using subagents.

3. **Name the feature** — Runs a structured naming process with creative ideation: 7-5-2 word compression warm-ups, grounding terms, benefit mapping, and 20+ candidate names across wayfinding, storytelling, and fanciful styles.

4. **Design Portal UX** — Translates the PRD into high-fidelity Portal UX mocks following Azure's Fluent UI design system: wireframes, multi-step wizards, dashboards, user flows, and state transitions with accessibility annotations.

5. **Build a Portal prototype** — Generates an interactive HTML/CSS/JS prototype that behaves like the Azure Portal, complete with sidebar navigation, list blades, create wizards, panels, and realistic sample data.

There's also a meta-skill called `prototype-feature` that chains steps 2 through 5 in sequence, pausing after the PRD for your approval before continuing.

## How a skill works under the hood

Each skill is a directory containing a `SKILL.md` file. The frontmatter tells the agent when to activate:

```yaml
---
name: write-prd
description: >
  Generate a PRD for an AKS feature from a problem statement.
  Use when user wants to write a new Product Requirements Document,
  feature spec, or requirements doc.
---
```

The body of the file contains the instructions. For `write-prd`, those instructions include:

- **Input handling**: Accept a problem statement, an existing PRD to revise, or customer signals as input.
- **Research phase**: Launch parallel subagents to gather competitive analysis, check Azure API surfaces, review RBAC models, and assess ecosystem context.
- **Writing phase**: Write the PRD incrementally in section groups, saving to disk as it goes so you can see progress in real time.
- **Guardrails**: Never fabricate customer quotes. Never make unverified claims about competitors. Flag assumptions explicitly.

The result is a 15-to-20-page PRD written in the time it takes you to get coffee.

## Beyond the core workflow

The repo includes twelve PM skills and five dev skills. Here's what the rest of the PM skills cover:

| Skill | What it does |
|-------|-------------|
| `review-prd` | Critical review focusing on UX complexity, proposal soundness, and evidence quality |
| `review-security` | STRIDE threat modeling: authentication, data protection, network, supply chain, compliance |
| `create-pitch-deck` | Converts a PRD into a 12-slide customer pitch deck with Mermaid diagrams |
| `draft-technical-post` | Writes a blog post from a repo, outline, or topic following your project's conventions |
| `generate-header-image-prompt` | Creates AI image generation prompts for blog hero images |
| `generate-social-media-blurb` | Writes platform-specific social copy for LinkedIn and Twitter/X |

The dev skills handle the maintenance side: `create-issues` breaks features into GitHub issues, `release` bumps versions and updates changelogs, `resolve-conflicts` rebases and fixes merge conflicts, `review-codebase` audits for bugs and security issues, and `work-issues` picks up open issues and starts implementing them.

## What makes a skill good

After building and iterating on these skills, a few patterns emerged.

**Be specific about research.** Vague instructions like "research the topic" produce vague results. The `gather-customer-signals` skill lists exactly which sources to search, in what order, and what to extract from each. It launches parallel subagents per source so a slow Reddit search doesn't block the GitHub issues scan.

**Use incremental output.** The `write-prd` skill doesn't build the entire document in memory and dump it at the end. It writes section by section, saving to disk after each group. You can watch the PRD take shape and catch problems early.

**Encode guardrails, not just instructions.** The `review-prd` skill doesn't just say "review this PRD." It says: flag any workflow with more than five steps, demand evidence for quantitative claims, check that failure modes are addressed, never rewrite the document yourself. The guardrails prevent the agent from going off-script.

**Chain skills with checkpoints.** The `prototype-feature` skill runs three other skills in sequence but pauses after the PRD phase for human approval. The prototype would be wasted work if the PRD is wrong. Designing in pause points makes the workflow collaborative rather than fully autonomous.

## Getting started

You can install the skills as GitHub Copilot plugins. Add the marketplace and install the plugins:

```bash
copilot plugin marketplace add azure-management-and-platforms/aks-pm-skills
copilot plugin install aks-pm@aks-pm-skills
copilot plugin install aks-pm-dev@aks-pm-skills
```

Or, in VS Code, add `azure-management-and-platforms/aks-pm-skills` as a plugin marketplace in your settings, then install the plugins from the Agent Plugins view.

Once installed, invoke skills directly:

```text
/write-prd Write a PRD for adding AI inference serving to AKS Fleet Manager
/gather-customer-signals Gather signals about AKS cluster upgrade success rates
/prototype-feature Prototype a GPU quota management feature for AKS Fleet
```

The companion [AKS skills plugin](https://github.com/azure-management-and-platforms/aks-skills) adds operational skills like Kusto queries, IcM incident management, and support case analysis. Those integrate with the PM skills so `gather-customer-signals` can pull from internal telemetry and `write-prd` can reference real IcM data.

## Writing your own skills

A skill is just a directory with a `SKILL.md` file:

```text
my-skill/
├── SKILL.md              # Frontmatter + agent instructions
├── references/           # Terminology lists, templates, style guides
└── scripts/              # Helper scripts
```

The `SKILL.md` frontmatter needs a `name` and a `description` with trigger phrases so the agent knows when to activate it. The body contains your instructions. Reference files let you bundle supporting material (writing style guides, terminology lists, templates) so the skill is self-contained.

You can start simple. Write down the instructions you'd give a colleague for one specific task. Structure them with clear inputs, a step-by-step process, expected output format, and explicit guardrails. That's a skill.

## What I've learned so far

This workflow won't replace PM judgment. The agent can't tell you whether a feature is worth building. It can't read the room in a design review or navigate org politics.

What it does replace is the mechanical overhead: the hours spent formatting PRDs, searching forums for customer quotes, mocking up wireframes in Figma, or writing the same boilerplate pitch deck. By encoding that work as skills, I spend more time on the decisions that actually matter and less time on the artifacts that communicate those decisions.

The skills are open source and evolving. Check out the [aks-pm-skills repo](https://github.com/azure-management-and-platforms/aks-pm-skills) and try them out.
