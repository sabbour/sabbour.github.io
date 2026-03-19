const fs = require('fs');
const path = require('path');

const EXPORT_FILE = process.argv[2] || path.join(__dirname, 'sabbour.ghost.2026-03-18-22-29-05.json');
const POSTS_DIR = path.join(__dirname, '../../_posts');
const DRAFTS_DIR = path.join(__dirname, '../../_drafts');

function slugify(str) {
    return str.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

function escapeYaml(str) {
    if (!str) return '""';
    if (/[:#\[\]{}&*?|>!%@`]/.test(str) || str.includes('"') || str.includes("'")) {
        return '"' + str.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
    }
    return str;
}

function buildFrontMatter(post, tags) {
    const lines = ['---'];
    lines.push(`layout: post`);
    lines.push(`title: ${escapeYaml(post.title)}`);
    if (post.published_at) {
        lines.push(`date: ${post.published_at}`);
    } else if (post.created_at) {
        lines.push(`date: ${post.created_at}`);
    }
    if (post.custom_excerpt) {
        lines.push(`excerpt: ${escapeYaml(post.custom_excerpt)}`);
    }
    if (tags.length > 0) {
        lines.push(`tags:`);
        tags.forEach(t => lines.push(`  - ${escapeYaml(t)}`));
    }
    if (post.feature_image) {
        lines.push(`image: ${post.feature_image}`);
    }
    lines.push('---');
    return lines.join('\n');
}

function run() {
    if (!fs.existsSync(EXPORT_FILE)) {
        console.error(`Export file not found: ${EXPORT_FILE}`);
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(EXPORT_FILE, 'utf-8'));
    const db = data.db[0].data;

    // Build tag lookup: tag_id -> tag_name
    const tagMap = {};
    (db.tags || []).forEach(t => { tagMap[t.id] = t.name; });

    // Build post->tags lookup
    const postTags = {};
    (db.posts_tags || []).forEach(pt => {
        if (!postTags[pt.post_id]) postTags[pt.post_id] = [];
        postTags[pt.post_id].push(tagMap[pt.tag_id] || 'uncategorized');
    });

    // Ensure output dirs exist
    [POSTS_DIR, DRAFTS_DIR].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    const posts = (db.posts || []).filter(p => p.type === 'post');
    let imported = 0;
    let skipped = 0;

    for (const post of posts) {
        const html = post.html;
        if (!html) {
            console.log(`  Skipped (no content): ${post.slug}`);
            skipped++;
            continue;
        }

        const tags = postTags[post.id] || [];
        const frontMatter = buildFrontMatter(post, tags);
        const content = frontMatter + '\n\n' + html + '\n';

        const isDraft = post.status !== 'published';
        const outDir = isDraft ? DRAFTS_DIR : POSTS_DIR;

        let fileName;
        if (isDraft) {
            fileName = `${post.slug}.md`;
        } else {
            const dateStr = post.published_at
                ? post.published_at.split('T')[0]
                : new Date().toISOString().split('T')[0];
            fileName = `${dateStr}-${post.slug}.md`;
        }

        fs.writeFileSync(path.join(outDir, fileName), content);
        console.log(`  ${isDraft ? 'Draft' : 'Post'}: ${fileName}`);
        imported++;
    }

    console.log(`\nDone. Imported ${imported} posts, skipped ${skipped}.`);
}

run();