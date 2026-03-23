---
description: "Move a reviewed draft from _drafts/ to _posts/ with today's date. Renames the file, updates the frontmatter date, and verifies the result."
agent: "agent"
tools: [read, search, edit, terminal]
argument-hint: "Filename of the draft to publish (e.g. my-new-post.md)"
---

Publish a blog post by moving it from `_drafts/` to `_posts/`.

## Steps

1. **Identify the draft.** The user provides a draft filename (with or without `.md`). Find it in the `_drafts/` directory. If the user doesn't specify a file and there is only one draft, use that one. If multiple drafts exist, list them and ask the user to pick.

2. **Run the blog-reviewer agent.** Before publishing, review the draft against the [blog-reviewer agent](./../agents/blog-reviewer.agent.md) checklist. If there are blocking issues (missing required frontmatter fields, broken code blocks), fix them before proceeding. Report any fixes made.

3. **Determine the publish date.** Use today's date (`YYYY-MM-DD`) unless the user specifies a different date. If the draft filename already starts with a date (`YYYY-MM-DD-`), strip it and re-add today's date.

4. **Build the target filename.** Format: `YYYY-MM-DD-slug.md` where `slug` is the slug portion of the draft filename (lowercase, hyphenated). Place the file in `_posts/`.

5. **Update frontmatter.** Set the `date` field in the YAML frontmatter to the publish date in ISO 8601 format (`YYYY-MM-DDTHH:MM:SS.000Z`). Keep the time as `00:00:00.000Z` unless the user specifies otherwise.

6. **Move the file.** Terminal `mv` can silently fail. Use this reliable approach instead:
   a. Read the full contents of `_drafts/<old-name>.md`.
   b. Create `_posts/<YYYY-MM-DD-slug>.md` with the exact same contents (use the create_file tool).
   c. Verify the new file exists in `_posts/` using file_search.
   d. Delete the original draft. Try `rm _drafts/<old-name>.md` via terminal. If the terminal is unavailable, ask the user to delete it manually.

7. **Verify.** Confirm using file_search (not terminal):
   - The file exists in `_posts/` with the correct name.
   - The `date` frontmatter field matches the target date.
   - The original file no longer exists in `_drafts/`.

8. **Report.** Tell the user the post has been published and show the final path.
