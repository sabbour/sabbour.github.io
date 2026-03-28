---
description: "Enforce Git branching workflow. Create a branch for new posts and substantial edits. Merge with fast-forward only when the user approves."
applyTo: "**"
---

# Git branching workflow for posts

Follow this workflow whenever you create or substantially edit a blog post.

## When to create a branch

- **New post**: Always create a `draft/<slug>` branch before writing.
- **Substantial edit**: If the change goes beyond a typo fix or single-line correction (e.g., rewriting sections, adding content, restructuring), create a `draft/<slug>` branch first.
- **Minor fix**: Typo corrections, fixing a broken link, or small wording tweaks do not require a branch. Commit directly.

## Branch naming

Use `draft/<slug>` where `<slug>` is the lowercase, hyphenated post slug (e.g., `draft/running-llms-on-aks`).

## While on a branch

- Commit early and often. Small, focused commits are fine.
- Do **not** merge the branch automatically. The branch stays open until the user explicitly approves.

## Merging

Only merge when the user says "good to go", "merge it", "ship it", "looks good", or an equivalent approval phrase.

When merging:

1. Switch to `main`.
2. Merge using `git merge --ff-only draft/<slug>`. Fast-forward only. If the merge cannot fast-forward, rebase the branch onto `main` first, then retry.
3. Delete the draft branch locally (`git branch -d draft/<slug>`).
4. Confirm the merge succeeded and report the final post path.

Do **not** push to origin unless the user asks. Do **not** delete remote branches unless the user asks.
