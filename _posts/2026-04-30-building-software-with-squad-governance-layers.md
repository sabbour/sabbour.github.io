---
layout: post
title: "Building software with Squad, bot identities, review gates, and workflow automation"
date: 2026-04-30T00:00:00.000Z
description: Squad plus three Copilot CLI extensions creates an auditable, human-led delivery flow with clear authorship, review accountability, and lifecycle state.
image: /assets/images/2026-04-30-building-software-with-squad-governance-layers/hero.png
tags:
  - copilot-cli
  - github
  - ai
  - devops
  - automation
---

Copilot CLI can run more than a single coding assistant. With the right setup, it can coordinate a small, human-led software team that works in parallel while keeping governance visible.

This post shows how I use [Squad](https://github.com/bradygaster/squad) with three companion extensions, [squad-identity](https://github.com/sabbour/squad-identity), [squad-reviews](https://github.com/sabbour/squad-reviews), and [squad-workflows](https://github.com/sabbour/squad-workflows), as one integrated delivery system.

## Why this model works

Squad gives you persistent team members in your repository with clear roles and handoffs. In my Kickstart setup, that includes specialists for architecture, front end, back end, testing, security, code review, DevOps, and docs, plus Scribe for memory and Ralph for queue management.

That model solves coordination, but it introduces three governance questions:

1. Who authored this GitHub write?
2. Which reviewer role approved this change?
3. What lifecycle state is this work in right now?

The three extensions map directly to those questions:

- Identity answers authorship.
- Reviews answers approval and feedback closure.
- Workflows answers lifecycle state and merge readiness.

## The stack in one view

```text
┌─────────────────────────────────────────────────────────────┐
│ squad-workflows                                             │
│ issue -> estimate -> design -> review -> merge -> wave      │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ squad-reviews                                               │
│ role gates, native reviews, unresolved-thread discipline    │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ squad-identity                                              │
│ per-role GitHub App bots, short-lived tokens, attestations │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ Squad                                                       │
│ human-led multi-agent team stored in the repository         │
└─────────────────────────────────────────────────────────────┘
```

I think of this as layered control. Squad decides who should do the work. The extensions make that work attributable, reviewable, and merge-safe.

## Layer 1: Bot identities with squad-identity

The [squad-identity README](https://github.com/sabbour/squad-identity) states the core goal clearly: agent-authored GitHub writes should come from role-specific bot identities, not your personal token.

Under the hood, this extension resolves credentials through GitHub App authentication:

- Maps role aliases, such as backend, frontend, security, codereview, docs, and devops, to app registrations.
- Signs an app JWT, exchanges it for an installation token, and caches it only until close to expiration.
- Loads credentials from CI variables or local keychain.
- Fails closed if key material is missing, instead of silently falling back to your account.

The lease model is the part I like most for safety. Leases are role-scoped, operation-limited, and time-bounded. If role mismatch, expiration, revocation, or operation exhaustion occurs, writes stop.

That gives you traceable authorship and constrained blast radius for automated writes.

## Layer 2: Review governance with squad-reviews

[squad-reviews](https://github.com/sabbour/squad-reviews) formalizes review responsibility by role. Instead of ad hoc approvals, each pull request routes through configured reviewer dimensions with explicit pass conditions.

In my local config, security and code review are always required, and docs is conditionally required depending on file impact and bypass labels. Other roles can stay optional.

The review execution flow does more than post comments:

- Resolves reviewer role and loads charter.
- Fetches diff and avoids duplicate reviews on the same head commit.
- Validates review quality.
- Submits a native GitHub review state.
- Appends an audit record.

The quality gate is intentionally strict. Reviews need enough depth, citations to changed files and lines, and clear decisions. Shallow approvals and vague caveats fail validation.

The feedback loop is also strict in a good way. Unresolved thread handling requires a reply and then resolution. You cannot quietly dismiss feedback and move on.

## Layer 3: Lifecycle orchestration with squad-workflows

[squad-workflows](https://github.com/sabbour/squad-workflows) drives issue-to-merge lifecycle state as executable tools, not just policy text in a document.

A typical path looks like this:

1. Estimate work size.
2. Decompose L or XL work into waves.
3. Check fast-lane eligibility.
4. Post design proposal when required.
5. Wait for design approval labels.
6. Implement, open pull request, and run review gates.
7. Enforce merge checks.
8. Merge and advance wave status.

Fast lane keeps small work moving. In my setup, estimate S and `squad:chore-auto` can skip design proposal and design review. Larger work must produce a structured design proposal with required sections like problem, approach, subtasks, security, docs impact, and alternatives.

This creates clear state transitions that humans and agents both understand.

## A representative end-to-end flow

Here is a condensed interaction based on how these tools are designed to work together:

```text
Human:
  Ralph, keep working. Pick up the next urgent bug.

Ralph:
  Scans open issues and pull requests.
  Routes backend/runtime work to Bender.

Bender:
  Runs fast-lane check for the issue.
  If required, posts a design proposal and waits for approval labels.
  Implements the fix, runs focused tests, and adds a changeset.
  Pushes with roleSlug=backend and opens pull request to dev.

Zapp / Nibbler / Amy:
  Execute role-based pull request reviews.
  Use native GitHub review states with substantive feedback.

Bender:
  Acknowledges every feedback thread.
  Replies with addressed or dismissed rationale.
  Resolves each thread after reply.

Coordinator:
  Evaluates review gate status and merge checks.
  Merges only when approvals, thread state, CI, and changeset checks pass.
```

This sequence matters because each step produces durable evidence in GitHub and workflow state, including labels, comments, reviews, thread transitions, and merge decisions.

## What I see in practice

Across the current extension snapshots, the Copilot CLI surface exposes 51 `squad_*` tools:

- 10 identity tools.
- 16 review tools.
- 25 workflow tools.

Current package versions from the repositories are:

- `@sabbour/squad-identity@1.4.5`
- `@sabbour/squad-reviews@1.3.2`
- `@sabbour/squad-workflows@1.2.3`

All three ship as Node.js 18+ ESM packages with dedicated CLI binaries.

The symmetry across the stack is what makes it practical:

| Layer | Primary question | Guardrail |
|---|---|---|
| Squad | Who should do the work? | Roster, charters, routing, queue monitoring |
| squad-workflows | What state is work in? | Estimation, design approval, merge checks, waves |
| squad-reviews | Who approved it? | Role gates, native reviews, unresolved-thread discipline |
| squad-identity | Who authored this write? | Per-role bot auth, token leases, attestation |

## Why I keep using this pattern

Each extension does one job well:

- Identity manages authorship and bot attribution.
- Reviews enforces review quality and closure discipline.
- Workflows orchestrates lifecycle progression and merge safety.

That separation keeps the system understandable. Agents move quickly in parallel, while humans keep priority control and final merge authority.

Most importantly, the process stays inspectable. You can see who authored each write, which role approved, how feedback was addressed, and why merge checks passed. That is the difference between automation that feels risky and automation you can trust.

## Next step

If you want to try this model, start with a small repository and one mandatory review gate. Add role-based bot identity next, then layer in lifecycle automation once your team is comfortable with explicit state transitions.

You do not need to start with full ceremony. Start with attribution and review accountability, then expand as your agent team grows.