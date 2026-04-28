---
layout: post
title: Simulating user conversations to evolve agent prompts
date: 2026-04-28T00:00:00.000Z
description: I role-played 12 user conversations against a multi-agent system before rewriting a single prompt. The transcripts became the spec, the regression suite, and the case for the system.
image: /assets/images/2026-04-28-simulating-user-conversations/hero.png
tags:
  - ai
  - agents
  - prompt-engineering
  - copilot-cli
---

I sat down to rewrite a system prompt for one of my agents and realized I had no idea whether the new prompt would actually produce the conversation I wanted. The framework documents said what the agent *should* do. The current prompt said what the agent currently *did*. But the gap between the two was where every interesting failure lives, and I couldn't see it just by reading either.

So before touching any prompts, I role-played 12 conversations.

## The problem with rewriting agent prompts blindly

I'm building a multi-agent system: a triage agent routes to architects, which consult specialists, which hand off to a code generator, which hands off to a publisher. Each agent has a system prompt. Those prompts have to fit together. Change one and you can break three.

The tempting move is to take the design docs you've written for the agent (the patterns it should emit, the rules for when to ask questions, the decision trees for routing) and translate them straight into a longer system prompt. The agent's specification gets encoded, the prompt grows, you ship. Then a real user opens with "deploy this" and the agent does something nobody anticipated, because the prompt encoded what the design docs *said* the agent should do, not what the agent would *actually* face in flow.

Three problems compound:

1. You can't see the whole conversation while writing the prompt. You're optimizing for one turn at a time.
2. You can't test the prompt against turns that don't exist yet. Real users push back. Authored examples don't.
3. Different agent prompts evolve in isolation. The triage agent doesn't know what the architect now expects.

## Where this started

I didn't sit down with a methodology in mind. The technique came out of a working session where I was mid-way through a multi-agent rewrite and asked the agent I was working with:

> Put on the hats of two people, a developer trying to deploy an app, and you, the system. Imagine the conversation, simulate multiple ones, and use that as guidance for the prompts.

The first response was a stack of authored sample dialogues. They read fine. They were also useless. The agent had written both sides of each conversation top-down, with the design docs as the input, so the personas always asked the questions the system was good at answering. Nothing surprising came out.

I pushed back: "Did you actually run the conversation sims?" The honest answer was no. The fix was to make each simulation a separate sub-agent invocation with strict turn-by-turn rules and a persona who had to push back at least twice. Same setup, different mechanics. The transcripts that came back were emergent, and they surfaced patterns the authored examples had hidden.

## The technique: role-play first, rewrite second

Before touching prompts, I ran 12 simulations. Each was a complete user-system dialogue across a different persona: a hobbyist deploying their first frontend app, a startup engineer migrating from one cloud platform to another, a platform engineer integrating into an enterprise infrastructure-as-code monorepo, a data scientist wrapping a fine-tuned model, and so on.

Each simulation ran as a separate background sub-agent with a fresh context window and a strict prompt:

- The sub-agent role-plays both sides of the conversation, but **one turn at a time**. When generating the persona's turn, it doesn't pre-write the system's response. When generating the system's response, it simulates which tools the system would call, what those tools would return, and only then writes the reply.
- The persona must push back at least twice during the simulation. Pick natural moments where a real user would object, ask a clarifying question, or change their mind.
- Every system turn is annotated with two metadata fields: what intent is being communicated, and what UI composition is being emitted.
- Every three to five turns, the simulation adds a value-add callout: "A generic prompt would have done X here; this system did Y because Z."

The output is a transcript document: an emergent dialogue, not a scripted one.

## What a transcript looks like

Here's a slice of one. The persona is "Side-Project Sam," a hobbyist who has shipped a handful of side projects on platform-as-a-service hosts, never touched Kubernetes, just wants a URL to share. He opens with one sentence:

> **Sam:** Deploy this to Azure please: https://github.com/sam/portfolio

The simulation calls a repo-inspection tool on the URL, then composes a single confirm-and-go plan card. Each system turn is bracketed by metadata:

```text
// INTENT: Zero-question routing. Inspect the repo silently, infer
//   the plan, present a single confirm-and-go card with every default
//   visible in-line. The plan card IS the gate, not a question.

// COMPOSITION: Plan-summary card + cost card + "what I'm doing for
//   you" card, composed as a Column of three Cards. Pure primitives
//   from the catalog, no specialized component.
```

The system emits the plan card with every default in-line: region, branch, identity model, ingress, observability. Sam can object to any of them without being asked. Then comes the value-add callout:

```text
// ⭐ VALUE-ADD vs generic prompt: A generic "deploy this Next.js to
//   Azure" prompt in VS Code would dump a deployment.yaml with a
//   hard-coded image tag and tell the user to run kubectl. Here the
//   system inferred the whole plan from one inspect call, surfaced
//   every default in the plan card, and attached a live-priced cost
//   card before generating any code.
```

Two turns later, Sam pushes back:

> **Sam:** Wait, $163/mo? Hobby hosting is usually free. Why am I paying $73/mo just to *exist* before I serve a single request?

The system's response is a "what you actually want / how this system does it" table. Honest about the cost, naming the levers Sam can pull: drop server-side rendering for a static export and skip the workload node, or tear down between demo cycles and only pay while the cluster exists. The transcript records both Sam's pushback and the system's reasoning, so the eventual prompt rewrite has a concrete example to encode rather than a hypothetical one.

## Why turn-by-turn matters

Authoring a sample dialogue top-down is fast, but the author's bias creeps in. You make the persona ask the question your prompt is good at answering. You skip the inconvenient pushback. You smooth over the moments where the system would have to make a real decision under uncertainty.

Turn-by-turn role-play forces honesty. When the simulation has to decide what tool the system would call before it writes the response, you catch the moments where the existing prompt has no rule for the situation. When the persona is required to push back, you discover the prompts that work only when the user agrees with everything the system says.

Three patterns emerged that authored examples rarely catch:

- **Silent scope creep.** The framework says "ask up to three questions"; the simulation has the persona say something ambiguous on turn one, and the system asks a fourth. The prompt didn't encode the cap-of-three rule explicitly. It relied on the model to remember.
- **Drift between prompt and tool surface.** The prompt says "call the quota tool when needed"; the simulation reveals there isn't a quota tool, only a general resource lookup. The prompt referenced a capability the system doesn't have.
- **Unfortunate defaults.** The prompt says "default to the cheapest tier"; the simulation has the persona mention paying customers; the system silently picks the cheapest tier for a paying-customer workload. The default wasn't wrong. The prompt didn't encode when to override it.

## Annotations that make transcripts reusable

A simulation transcript is more useful than a list of fixes if you annotate it well. I required three annotation types per turn:

1. **Intent.** One line per system turn describing the goal of the response. "Confirm-and-go plan summary" is useful. "Reply to the user" is not.
2. **Composition.** The structural shape of any UI emitted, written as a primitive expression. `Card[Text(h2)+List+Row[Button(approve)+Button(revise)]]` is a recipe. "Show a card" is not.
3. **Value-add callout.** Every few turns, an explicit comparison to what a generic prompt would have done in the same spot. These callouts are what you point at when someone asks what the system does that a generic prompt can't. They're free if you require them during the simulation rather than retrofitting them afterward.

The annotations turn transcripts into three artifacts at once:

- **Behavioral specifications** for the agents. After the prompt is rewritten, replay the persona's opener and check whether the new agent produces the annotated structure.
- **A recipe catalog** for the composition library. Patterns that recur across multiple transcripts are candidates for first-class components.
- **Evidence for stakeholders** that the system delivers something a generic prompt can't. The value-add callouts become bullet points in your next product review.

## What the simulations gave me

12 simulations, ~95,000 words of transcripts, about 2 hours of background sub-agent runtime (plus another 40 minutes for a meta-aggregation pass that synthesized the findings). The output was 37 discrete work items in the issue tracker, each tied to one or more transcripts that motivated it.

Three categories dominated:

**Recurring patterns.** The simulations validated 16 conversational patterns I'd already named and surfaced 26 new ones I hadn't. Some are response shapes: when a user shows up saying "I'm moving from another platform," the system now opens with a side-by-side mapping of their current setup to the equivalent on the new one before showing any plan; when a user asks for the wrong tool ("can I just use Lambda?"), the system surfaces a table comparing what they actually want done against what the requested tool delivers, then proposes the right-fit alternative. Some are handover patterns: when a user wants to hand the work to a colleague, the system bundles a self-contained review pack with the plan, rationale, cost estimate, rollback steps, and open questions, ready to drop into a code review or chat thread. Five of the new patterns appeared in five or more simulations, which made them candidates for promotion to standard system behaviors rather than ad-hoc rules buried in individual prompts.

**Tool gaps.** The transcripts revealed 22 new tools the agents could have used if they existed. Five were rated high priority. The rest got documented and queued. Without the simulations, these would have been discovered one by one as users hit them later.

**Drift.** Existing prompts had drifted from the rest of the system. One agent referenced a deprecated networking pattern. Another was 39 lines long and would have failed 8 of the 12 transcripts as written. The transcripts surfaced specific drift items with specific evidence, which converted directly into one-line fix issues.

The single most useful finding came from cross-referencing surprises across transcripts. 12 patterns held in every simulation. Those became the system invariants: things every agent must do (close with a next-action handover, generate identity wiring as discrete resources rather than one, surface defaults transparently in the plan card). 10 patterns diverged across simulations. Those became the prompt-author-judgment moments: places where the new prompts have to encode a decision rule rather than a fixed behavior.

## How I ran it

The orchestration ran in [GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli) with Claude Opus 4.7 as the main agent. Each simulation was a separate background sub-agent spawned via the `task` tool, with its own context window. Sub-agents ran on Claude Sonnet (the Copilot CLI default for general-purpose agents). I prompted each sub-agent with a persona brief, scenario constraints, the strict turn-by-turn methodology described above, and the annotation rules.

The multi-agent system the simulations targeted is one I've been developing in parallel as a custom setup I call [**Squad**](https://github.com/sabbour/squad): a roster of named role-bound agents (lead, frontend, backend, security reviewer, code reviewer, devops, docs, monitor) with explicit handoff and consultation wiring. Squad sits inside a project repo as a `.squad/` directory and the agents are invoked via Copilot CLI's custom-agents mechanism. The simulations exercised the Squad agents' system prompts in flow, then a meta-aggregation pass synthesized findings into discrete GitHub issues that Squad members could pick up.

A separate post about Squad itself, including the conventions and the wiring graph, is on the way.

## Limits worth naming

The technique has costs.

It's slow for what it is, but cheaper than getting it wrong after shipping. Each substantive simulation took six to fifteen minutes of sub-agent runtime; two simulations with very wide scopes ran for ninety minutes before I aborted and restarted with tighter prompts. Plan for a long-tail and write tighter persona briefs the second time.

It's not free. Each sub-agent run consumes tokens, and a dozen simulations plus a meta-aggregation pass over the transcripts is a noticeable cost.

It requires discipline. The temptation to short-circuit ("the persona obviously wouldn't push back here") destroys the technique's value. Every simulation needs at least two genuine pushbacks. Without them, you get a scripted example in disguise.

It does not validate the prompts you eventually write. The transcripts tell you what conversations the system needs to support. They do not run themselves against your new prompts. You either build a regression harness that compares new agent output to the transcripts, or you accept that the transcripts are specifications and a human reviewer judges fit.

## How to start small

You don't need 12 simulations to get value. Three sims covering the corners of your matrix (the simplest case, the most complex case, and one cross-cutting concern like a track flip or a handover to a human) will surface most of the patterns. Add more as the system grows.

Two ground rules:

- Each simulation is a separate sub-agent invocation. Different context windows, no cross-contamination.
- The persona briefs are written as constraint-and-voice descriptions, not scripts. The persona must be free to react.

The simulations are the input. The agent prompts are the output. Treat them as separate artifacts. Maintain the simulations the way you maintain integration tests, and you will catch system-level drift the same way.

## Next steps

- Read about [GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli) and how its custom-agents mechanism extends agent mode in the terminal.
- Learn how to write [system prompts for multi-agent workflows](https://platform.openai.com/docs/guides/agents) on the OpenAI Agents SDK.
- A future post will cover [**Squad**](https://github.com/sabbour/squad), the multi-agent setup the simulations targeted, including the role conventions, handoff wiring, and ceremony patterns.
