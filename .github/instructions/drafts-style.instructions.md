---
description: "Enforce blog style rules when editing draft posts. Covers Microsoft Style Guide voice, terminology, frontmatter, headings, code blocks, and accessibility."
applyTo: "_drafts/**"
---

# Draft blog post style rules

Apply these rules whenever you edit or suggest changes to a draft.

## Frontmatter (required fields)

- `layout: post`
- `title`: sentence-case, no trailing period
- `date`: ISO 8601 (`YYYY-MM-DDTHH:MM:SS.000Z`)
- `description`: one-to-two sentences, under 160 characters, used for `og:description`
- `image`: path to hero image (`/assets/images/<YYYY-MM-DD-slug>/hero.png`)
- `tags`: 2–5 lowercase, hyphenated tags

## Voice and tone

- Warm, conversational, second-person ("you").
- Use contractions (it's, you're, don't). Get to the point fast.
- Active voice, present tense. Use Oxford commas.
- Avoid filler: *you can*, *there is/are*, *in order to*, *utilize*, *leverage*.
- **Never use em dashes.** Rewrite with periods, commas, colons, or restructure the sentence instead.

## Avoid AI tells

These patterns make writing sound machine-generated. Never use them:

- **Contrast framing on repeat.** Don't write "It's not X, it's Y" or "Not X. Y." over and over.
- **Fragmented pseudo-profound sentences.** Don't stack short dramatic fragments for false weight. ("Short. Isolated. Reflective.") Especially not in threes.
- **Cheap rhetorical hooks.** Don't use "And honestly?", "Here's the kicker", "And the best part?", "The worst part?", "The result?", "But here's the thing", "The real question is". Just state the point.
- **Over-explicit signposting.** Don't lean on transition crutches like "Here's the key takeaway", "The important part is this", "It's worth noting that", "Here's the breakdown", "Firstly... Secondly... Thirdly...", "Let's unpack this", "Let's break this down". Let the structure carry the flow.
- **Hollow engagement bait.** Don't end with "Curious what others think" or "What do you think?" unless you genuinely mean it and will engage.
- **Unnecessary reassurances.** Don't tell the reader they're "not alone", "not imagining things", "not broken", or "not crazy" unprompted.
- **Fake-candor openers.** Don't use "Full transparency", "Nobody talks about this but", "Genuine question", or "Unpopular opinion" before a safe take everyone already agrees with.
- **The word "quietly" as a drama modifier.** Don't write "quietly growing", "quiet truth", "quiet confidence", "X quietly did Y". Just say the thing.
- **Drama-shift phrases.** Don't write "That's when things shift", "And that changes everything", "You said the quiet part out loud".
- **Forced validation.** Don't write "That's rare", "Now you're asking the right questions", "That's a smart observation", "And that matters", "You're right to push back on that".
- **Buzzword clichés.** Never use *dive into*, *dive deep*, *unlock*, *unleash*, *game-changer*, *landscape*, *at the end of the day*, *no fluff*, *shouting into the void*, *let's be real*, *level up*, *signal vs. noise*.
- **Rule of three as a crutch.** Don't compulsively group things into threes (three examples, three adjectives, three fragments). Vary your rhythm.

## Headings

- Sentence-style capitalization (capitalize only the first word and proper nouns).
- Keep headings short. Ideally one line.
- No trailing periods.

## Terminology

- *Azure* (capitalized), *cloud-native* (hyphenated adjective), *on-premises* (never "on-premise").
- Kubernetes resource types capitalized: *Deployment*, *Service*, *Pod*. Generic "pod" stays lowercase.
- *sign in* not "log in", *allowlist* not "whitelist", *blocklist* not "blacklist".
- *set up* (verb) vs. *setup* (noun), *back end* (noun) vs. *back-end* (adjective).
- *open source* (noun), *open-source* (adjective).
- *data center* (two words), *serverless* (one word), *multicloud* (one word).

## Code blocks

- Always specify a language (```yaml, ```bash, ```go, etc.).
- Keep snippets focused. Show only what's relevant.

## Links and images

- Use descriptive link text. Never use "click here" or bare URLs.
- Include alt text for every image.

## Accessibility and inclusion

- People-first language, inclusive terms, gender-neutral pronouns.
