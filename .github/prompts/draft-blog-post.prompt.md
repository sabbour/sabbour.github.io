---
description: "Draft a new blog post from a GitHub repo, bullet points, or a topic. Produces a publish-ready Markdown file following the blog's Microsoft Style Guide conventions."
agent: "agent"
tools: [read, search, edit, web]
argument-hint: "Topic, bullet points, or a GitHub repo URL to base the post on"
---

Draft a blog post for a Jekyll-based technical blog. The post must pass the [blog-reviewer](./../agents/blog-reviewer.agent.md) agent's checks on the first review.

## Inputs (the user will provide one or more)

- **GitHub repo URL(s)**: Fetch the repo README and key files to understand the project, then write a post explaining it.
- **Bullet points / outline**: Expand the points into a full post.
- **Topic description**: Research the topic using available tools and write the post.

## Frontmatter requirements

Every post MUST start with this YAML frontmatter:

```yaml
---
layout: post
title: <Sentence-case title, no trailing period>
date: <YYYY-MM-DDTHH:MM:SS.000Z>
description: <One-to-two sentence summary for social sharing and SEO, under 160 characters>
image: /assets/images/<YYYY-MM-DD-slug>/hero.png
tags:
  - <lowercase-tag>
  - <lowercase-tag>
---
```

- Use today's date if not specified.
- `description` is used for `og:description` and `twitter:description` meta tags. Keep it concise and compelling.
- `image` is used for `og:image` and `twitter:image`. Use the path `/assets/images/<YYYY-MM-DD-slug>/hero.png`. If the user doesn't provide an image, use a placeholder path and tell the user to add one.
- Tags must be lowercase and hyphenated (e.g., `kubernetes`, `ci-cd`, `azure`).
- Include 2–5 relevant tags.

## Writing rules (from the blog style guide)

1. **Voice**: Warm, conversational, second-person ("you"). Use contractions (it's, you're, don't). Get to the point fast.
2. **Structure**: Clear introduction (what and why), body with descriptive subheadings, conclusion with next steps or summary.
3. **Headings**: Sentence-style capitalization. Short, ideally one line. No trailing periods.
4. **Length**: Aim for 800–2,000 words.
5. **Code blocks**: Always specify a language (```yaml, ```bash, ```go, etc.).
6. **Links**: Use descriptive link text. Never use "click here" or bare URLs.
7. **Images**: Include alt text for every image.
8. **Terminology**: Follow Microsoft Style Guide conventions:
   - *Azure* (capitalized), *cloud-native* (hyphenated adjective), *on-premises* (never "on-premise")
   - Kubernetes resources capitalized when referring to the resource type: *Deployment*, *Service*, *Pod* (but generic "pod" lowercase)
   - *sign in* not "log in", *allowlist* not "whitelist", *blocklist* not "blacklist"
   - *set up* (verb) vs. *setup* (noun), *back end* (noun) vs. *back-end* (adjective)
9. **Grammar**: Active voice, present tense. Avoid *you can*, *there is/are*, *in order to*, *utilize*, *leverage*. Use Oxford commas.
10. **Accessibility**: People-first language, inclusive terms, gender-neutral pronouns.
11. **Em dashes**: Never use em dashes. Rewrite with periods, commas, colons, or restructure the sentence.
12. **No AI tells**: Never use these machine-generated patterns:
    - Contrast framing on repeat ("It's not X, it's Y" or "Not X. Y." over and over)
    - Fragmented pseudo-profound sentences stacked for false drama, especially in threes
    - Cheap rhetorical hooks: "And honestly?", "Here's the kicker", "And the best part?", "The worst part?", "The result?", "But here's the thing"
    - Over-explicit signposting: "Here's the key takeaway", "The important part is this", "Here's the breakdown", "Let's unpack this", "Let's break this down"
    - Hollow engagement bait sign-offs: "Curious what others think"
    - Unnecessary reassurances: "You're not alone", "You're not imagining things", "You're not broken"
    - Fake-candor openers: "Full transparency", "Nobody talks about this but", "Genuine question", "Unpopular opinion" before safe takes
    - "Quietly" as drama modifier: "quietly growing", "quiet truth", "X quietly did Y"
    - Drama-shift phrases: "That's when things shift", "And that changes everything"
    - Forced validation: "That's rare", "And that matters", "You're right to push back on that"
    - Buzzword clichés: *dive into*, *dive deep*, *unlock*, *unleash*, *game-changer*, *landscape*, *at the end of the day*, *no fluff*, *let's be real*, *level up*, *signal vs. noise*
    - Rule of three as a crutch: don't compulsively group things into threes. Vary rhythm.

## Template

Use the [blog post template](./../templates/blog-post-template.md) as the structural starting point. Adapt the sections to fit the content:

- **Tutorial or how-to**: Use all sections (prerequisites, steps, verify, clean up, next steps)
- **Conceptual or opinion**: Drop prerequisites and clean up; keep hook → body sections → next steps
- **Announcement or short post**: Hook → what's new → how to try it → next steps

## Process

1. **Create a branch.** Create a new Git branch named `draft/<slug>` (e.g., `draft/running-llms-on-aks`) from the current branch. Switch to it before writing.
2. Read the [blog post template](./../templates/blog-post-template.md) to understand the expected structure.
3. Gather context from the user's input (fetch repo READMEs, read linked files, or work from the provided outline).
4. Draft the post in Markdown following the template structure and all writing rules above.
5. Save the file directly to `_posts/` with the naming convention `YYYY-MM-DD-slug.md` (lowercase, hyphenated slug derived from the title).
6. Commit the new post on the `draft/<slug>` branch.
7. **Merge the branch.** Switch back to the original branch, merge `draft/<slug>` into it, and delete the draft branch.
8. After merging, tell the user they can run `@blog-reviewer` on the post to verify it.

## Output

A single Markdown file saved to `_posts/` on the original branch (merged from `draft/<slug>`). Do not create multiple files. Do not modify existing posts unless asked.
