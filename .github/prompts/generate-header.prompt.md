---
description: "Generate a hero/header image for a blog post using an AI image generation model. Reads the post content and creates a prompt for a suitable visual."
agent: "agent"
tools: [read, search, web]
argument-hint: "Path to the blog post (e.g. _drafts/my-post.md or _posts/2026-03-23-my-post.md)"
---

Generate a header image for a blog post.

## Steps

1. **Read the post.** Open the file the user specified (in `_drafts/` or `_posts/`). Extract the title, description, tags, and main content themes.

2. **Determine the image path.** The image should be saved at `/assets/images/<YYYY-MM-DD-slug>/hero.png`, matching the post's filename slug.

3. **Craft an image generation prompt.** Based on the post content, create a detailed prompt for an AI image generator. Follow these guidelines:
   - **Style**: Clean, modern, tech-oriented illustration. Flat or isometric style. No photorealistic faces.
   - **Palette**: Use blues, teals, and whites as primary colors to match the blog's aesthetic.
   - **Content**: Represent the core concept of the post abstractly (e.g., containers for Kubernetes, pipelines for CI/CD, cloud shapes for Azure).
   - **Composition**: Landscape orientation (1200×630px ideal for Open Graph). Central focal point with clean margins.
   - **Text**: Do NOT include any text or lettering in the image.

4. **Generate the image.** Use an available image generation tool or model to create the image from the prompt. If no image generation tool is available, output the prompt so the user can generate it externally (e.g., via DALL-E, Midjourney, or another tool).

5. **Save and update.** If the image was generated:
   - Create the directory `assets/images/<YYYY-MM-DD-slug>/` if it doesn't exist.
   - Save the image as `hero.png` in that directory.
   - Update the post's `image` frontmatter field to `/assets/images/<YYYY-MM-DD-slug>/hero.png`.

6. **Report.** Show the user the generated prompt and the saved image path. If the image couldn't be generated automatically, provide the prompt for manual generation.
