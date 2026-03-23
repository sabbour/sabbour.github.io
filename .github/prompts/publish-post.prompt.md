---
description: "Publish a draft blog post by merging its draft branch into main. Reviews the post, updates the date, and merges."
agent: "agent"
tools: [read, search, edit, terminal]
argument-hint: "Branch name or post slug (e.g. draft/running-llms-on-aks)"
---

Publish a blog post by merging its `draft/<slug>` branch into `main`.

## Steps

1. **Identify the draft branch.** The user provides a branch name or slug. If not specified, list branches matching `draft/*` and ask the user to pick. Switch to the draft branch.

2. **Find the post file.** Look for the new or modified `.md` file in `_posts/` on this branch.

3. **Run the blog-reviewer agent.** Review the post against the [blog-reviewer agent](./../agents/blog-reviewer.agent.md) checklist. If there are blocking issues (missing required frontmatter fields, broken code blocks), fix them and commit before proceeding. Report any fixes made.

4. **Update the publish date.** Set the `date` frontmatter field to today's date in ISO 8601 format (`YYYY-MM-DDTHH:MM:SS.000Z`). Keep the time as `00:00:00.000Z` unless the user specifies otherwise. If the filename date prefix doesn't match today, rename the file to use today's date. Commit any changes.

5. **Merge into main.** Switch to `main`, merge the draft branch (use `--no-ff` for a merge commit), and confirm the merge succeeded.

6. **Push.** Push `main` to origin to publish the post.

7. **Clean up.** Delete the draft branch locally and remotely after pushing.

8. **Verify.** Confirm:
   - You are on `main`.
   - The post file exists in `_posts/` with the correct date-prefixed filename.
   - The `date` frontmatter field matches the publish date.
   - The draft branch has been deleted.
   - The push succeeded.

9. **Report.** Tell the user the post has been published and show the final path.
