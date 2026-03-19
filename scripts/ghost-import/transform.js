const fs = require('fs');
const path = require('path');

/**
 * Transforms Ghost content into Markdown format for the new blog system.
 * @param {Object} ghostPost - The Ghost post object to transform.
 * @returns {String} - The transformed Markdown content.
 */
function transformGhostPost(ghostPost) {
    const frontMatter = `---
title: ${ghostPost.title}
date: ${new Date(ghostPost.published_at).toISOString()}
layout: post
---
`;
    const content = ghostPost.html; // Assuming ghostPost.html contains the HTML content
    return frontMatter + content;
}

/**
 * Transforms an array of Ghost posts into Markdown files.
 * @param {Array} ghostPosts - An array of Ghost post objects.
 * @param {String} outputDir - The directory to save the transformed Markdown files.
 */
function transformGhostPosts(ghostPosts, outputDir) {
    ghostPosts.forEach(post => {
        const markdownContent = transformGhostPost(post);
        const fileName = `${post.slug}.md`; // Use the post slug for the filename
        fs.writeFileSync(path.join(outputDir, fileName), markdownContent);
    });
}

// Example usage
// const ghostPosts = [...]; // Fetch or define your Ghost posts here
// const outputDir = path.join(__dirname, '../../_posts');
// transformGhostPosts(ghostPosts, outputDir);

module.exports = {
    transformGhostPost,
    transformGhostPosts
};