---
layout: post
title: Introducing Adaptive UI, a framework for building conversational AI interfaces
date: 2026-03-28T00:00:00.000Z
description: Adaptive UI is a React framework where an LLM agent drives the UI, generating forms, choices, and interactive components in a multi-turn conversation.
image: /assets/images/2026-03-28-adaptive-ui-framework/hero.png
tags:
  - ai
  - react
  - open-source
  - azure
---

Most AI-powered apps bolt a chat window onto an existing interface. You type something, the model responds with text, and you copy-paste the result somewhere useful. The rest of the UI sits there, unchanged.

What if the AI could control the UI itself? Instead of returning plain text, the model would return buttons, forms, dropdowns, maps, and code blocks, all assembled on the fly based on what you just said.

![Adaptive UI Framework logo](https://raw.githubusercontent.com/sabbour/adaptive-ui-framework/main/assets/logo.svg)

That's the idea behind [Adaptive UI](https://github.com/sabbour/adaptive-ui-framework), an experimental React + TypeScript framework for building conversational, agent-driven interfaces.

## How it works

In a traditional app, you design screens ahead of time. Every button, every form field, every layout is hardcoded. Adaptive UI flips that model: an LLM agent drives a multi-turn conversation, and each turn produces a JSON spec called `AdaptiveUISpec` that the framework renders into real React components.

A simplified spec looks like this:

```json
{
  "version": "1",
  "title": "Choose your region",
  "agentMessage": "Pick the Azure region closest to your users.",
  "layout": {
    "type": "container",
    "children": [
      {
        "type": "select",
        "bind": "region",
        "label": "Region",
        "options": ["eastus", "westeurope", "southeastasia"]
      },
      {
        "type": "button",
        "label": "Continue",
        "onClick": { "type": "sendPrompt", "prompt": "Selected region: {{state.region}}" }
      }
    ]
  },
  "state": { "region": "" }
}
```

The framework takes this JSON, renders it as interactive UI, and when the user interacts (clicks a button, submits a form, picks an option), it sends the result back to the LLM as the next prompt. The LLM then generates the next spec. Each interaction is a "turn" in the conversation: past turns collapse, and the latest turn stays interactive.

You don't write screen layouts. The agent figures out what to show next.

## 24 built-in components

The framework ships with 24 components across four categories:

**Layout** includes containers, cards, tabs, dividers, and accordions for structuring content.

**Text and media** covers headings, body text, markdown blocks, images, syntax-highlighted code blocks, links, and badges.

**Inputs** provides text fields, dropdowns, radio groups, multi-select checkboxes, toggles, sliders, and a chat input for free-text prompts.

**Actions and data** includes buttons, forms, dynamic lists, data tables, progress bars, and alert messages in four severity levels.

The LLM knows about all of these through a system prompt that describes each component's type and props. When the model needs a dropdown, it emits `{ "type": "select", "bind": "region", "options": [...] }`. The framework's component registry maps that type string to the actual React component and renders it.

## Extending with packs

Built-in components cover a lot of ground, but real apps need domain-specific UI. Adaptive UI handles this through **component packs**: bundles of custom components, LLM knowledge, and settings UI that plug into the framework.

A pack can provide four things:

- **Components.** Custom UI types the LLM can use (Azure resource pickers, Google Maps embeds, flight search results).
- **System prompt extensions.** Extra instructions that teach the LLM about the pack's capabilities so it knows when and how to use the new components.
- **Knowledge skills.** Context fetched on demand based on what the user is asking about (Azure documentation, GitHub API details).
- **Settings UI.** Configuration panels injected into the settings drawer (sign-in buttons, API key inputs).

Registering a pack is a few lines:

```typescript
import { registerPackWithSkills } from './framework/registry';
import { createAzurePack } from './packs/azure';

registerPackWithSkills(createAzurePack());
```

Five packs ship with the project today:

| Pack | What it adds |
|------|-------------|
| Azure | ARM API integration, MSAL sign-in, resource forms, region/SKU pickers, Azure docs knowledge |
| GitHub | OAuth Device Flow sign-in, org/repo/branch pickers, PR creation, GitHub API tools |
| Google Maps | Embedded maps (directions, street view, search), place search, nearby places with photos |
| Google Flights | Live flight search results, itinerary cards with deep links |
| Travel Data | Weather forecasts, country info cards, currency converters, packing checklists |

## A minimal app

Getting started requires very little code:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AdaptiveApp, OpenAIAdapter } from './framework';

const adapter = new OpenAIAdapter({
  apiKey: 'sk-...',
  model: 'gpt-4o',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AdaptiveApp adapter={adapter} />
);
```

This gives you a working chat interface where the LLM drives the conversation and generates UI on every turn. The `OpenAIAdapter` works with any OpenAI-compatible endpoint: OpenAI directly, Azure OpenAI, Azure AI Foundry, or local models through Ollama and LM Studio.

The framework also handles crash recovery. Conversation turns persist to `localStorage` with a 24-hour TTL, so users can reload the page without losing progress.

## Two demo apps

The repo includes two fully built demo apps that show what's possible when you combine the framework with packs.

**Solution Architect** loads the Azure and GitHub packs. You describe the system you want to build, and the agent walks you through architecture decisions, generates Bicep infrastructure-as-code, sets up CI/CD pipelines, and commits everything to a GitHub repo through a pull request. The entire flow happens conversationally: the agent asks questions, presents options as radio groups and forms, and adapts based on your answers.

**Travel Concierge** loads the Travel Data, Google Maps, and Google Flights packs. You tell it where you want to go, and it pulls real weather forecasts, embeds interactive maps, searches for flights with actual prices, shows nearby restaurants and attractions with photos, and builds a packing checklist. All of the data is live, fetched through pack tools during the conversation.

## What makes this different

Plenty of frameworks let you build chatbots. The difference here is that the LLM controls the UI structure, not just the text content. The model decides whether to show a dropdown or a text field, whether to present three options or seven, whether the next step needs a confirmation dialog or a progress bar.

This means the interface adapts to the conversation. A simple request might get a single card with a button. A complex configuration might get a tabbed layout with nested forms. The agent picks the right components for the situation because it understands them through the system prompt.

The pack system makes this practical for real applications. You don't have to teach one model about everything. Install the packs you need, and each one brings its own components, knowledge, and tools.

## How it relates to A2UI

After building Adaptive UI, I came across [A2UI](https://a2ui.org/), an open protocol from Google for agent-driven interfaces. The core idea overlaps: agents send declarative component descriptions instead of plain text, and a client renders them as real UI. The execution is different.

A2UI is a **protocol with client libraries**. It defines a JSON message format (surfaces, components, data binding) and ships maintained renderers for React, Angular, Lit, and Flutter, plus sample agents you can learn from. Because A2UI sits at the protocol layer, it works across trust boundaries: an agent running on one server can send UI descriptions to a client on another, and the client renders them using its own native widgets.

Adaptive UI is an **experimental framework**. It's React and TypeScript all the way down. The `AdaptiveUISpec` JSON format, the component registry, the turn-based conversation loop, and the pack system are all part of one package. You get something running fast, but it's a learning project, not a production-grade platform.

A few specific differences:

- **Component model.** A2UI uses a flat adjacency list where components reference each other by ID. Adaptive UI uses nested JSON trees. The flat model is better for streaming (you can send components as they're generated). The nested model is simpler to author.
- **Multi-platform.** A2UI renders on web, mobile, and desktop through different renderer implementations. Adaptive UI targets React on the web.
- **Multi-agent.** A2UI is designed for systems where multiple agents from different organizations contribute UI to the same surface. Adaptive UI assumes a single agent driving one conversation.
- **Transport.** A2UI is transport-agnostic and integrates with [A2A](https://github.com/google/A2A) and [AG UI](https://ag-ui.com/). Adaptive UI uses direct LLM API calls through its adapter layer.
- **Extensibility.** A2UI uses catalogs (the client advertises which component types it supports). Adaptive UI uses packs (bundles of components, knowledge, and tools that extend both the client and the agent).

## Try it out

Clone the repo and run the demo with no API key needed (it starts with a mock adapter):

```bash
git clone --recurse-submodules https://github.com/sabbour/adaptive-ui.git
cd adaptive-ui
npm install
npm run dev
```

Click the gear icon to connect your own OpenAI-compatible endpoint.

The framework, packs, and demo apps are all open source under the MIT license. The [README](https://github.com/sabbour/adaptive-ui-framework) covers the full component reference, pack authoring guide, and extension points.
