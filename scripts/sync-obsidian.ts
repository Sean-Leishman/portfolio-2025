#!/usr/bin/env npx tsx

import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
// Was a hardcoded WSL path (/mnt/c/.../Obsidian Vault); it died silently on the move to Linux
// and took the pre-commit hook down with it. Override with OBSIDIAN_VAULT if the vault moves again.
const OBSIDIAN_VAULT = process.env.OBSIDIAN_VAULT ?? path.join(os.homedir(), 'Projects', 'Nordorn');
// Overridable so the leak-gate test can run against a throwaway vault and output dir
// instead of writing fixtures into the real repo.
const PORTFOLIO_POSTS = process.env.PORTFOLIO_POSTS ?? path.join(__dirname, '..', 'src', 'posts');
const PORTFOLIO_ASSETS = process.env.PORTFOLIO_ASSETS ?? path.join(__dirname, '..', 'src', 'assets', 'blog');

// Cache of public posts for link resolution
const publicPosts: Map<string, { title: string; slug: string }> = new Map();

// --- Leak gate ---------------------------------------------------------------
// This publishes vault notes to a public website, and until now the only thing between
// the two was one frontmatter field. The denylist deliberately does NOT live in this file:
// portfolio-2025 is a PUBLIC repo, so a list of private project names committed here would
// publish exactly what it exists to protect. It lives in the private vault and is shared
// with the vault's own `sync-template`, because two copies of a denylist is two denylists
// and the one nobody edits is the one that leaks.
//
// Only `ventures` + `people` apply here. `own` (the author's name, their published work) is
// the byline on their own site, and `domain` is template-repo-specific -- blocking either
// would fire on every post and the gate would be switched off within a day.
//
// A hit BLOCKS the post rather than scrubbing it: these are the user's own words, and a
// silently mangled essay is worse than one that didn't publish.
let privatePatterns: RegExp[] = [];

function loadLeakGate(): void {
    const file = path.join(OBSIDIAN_VAULT, 'scripts', 'private-names.json');
    if (!fs.existsSync(file)) {
        console.error(`Leak gate missing: ${file}`);
        console.error('Refusing to publish anything that cannot be checked.');
        process.exit(1);
    }
    const lists = JSON.parse(fs.readFileSync(file, 'utf-8'));
    privatePatterns = ['ventures', 'people'].flatMap((c) => [
        ...lists[c].any.map((p: string) => new RegExp(p, 'gi')),
        ...lists[c].cased.map((p: string) => new RegExp(p, 'g')),
    ]);
}

function leaks(text: string): string[] {
    const hits = privatePatterns.flatMap((re) => [...text.matchAll(re)].map((m) => m[0]));
    return [...new Set(hits)].sort();
}

// Find all markdown files in the vault
function findMarkdownFiles(dir: string): string[] {
    const files: string[] = [];

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        // Skip hidden folders, templates, and common non-content folders
        if (entry.name.startsWith('.') ||
            entry.name === 'node_modules' ||
            entry.name === '99 Templates' ||
            entry.name === '99 Archive') {
            continue;
        }

        if (entry.isDirectory()) {
            files.push(...findMarkdownFiles(fullPath));
        } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
            files.push(fullPath);
        }
    }

    return files;
}

// Generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Build index of all public posts for link resolution
function buildPublicPostsIndex(files: string[]): void {
    for (const filePath of files) {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data: frontmatter } = matter(fileContent);

            if (frontmatter.visibility === 'public' && frontmatter.title) {
                const filename = path.basename(filePath, path.extname(filePath));
                const slug = generateSlug(frontmatter.title);

                // Index by filename (without extension) for wikilink resolution
                publicPosts.set(filename.toLowerCase(), {
                    title: frontmatter.title,
                    slug: slug
                });

                // Also index by title
                publicPosts.set(frontmatter.title.toLowerCase(), {
                    title: frontmatter.title,
                    slug: slug
                });
            }
        } catch (error) {
            // Skip files that can't be parsed
        }
    }
}

// Convert Obsidian wikilinks to MDX-compatible links
function convertWikilinks(content: string): string {
    // [[link|display]] format
    content = content.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (match, link, display) => {
        const lookupKey = link.toLowerCase().trim();
        const post = publicPosts.get(lookupKey);

        if (post) {
            // Link exists as a public post - convert to LinkTo component
            return `<LinkTo to="/posts/${post.slug}" text="${display}" />`;
        }

        // Not a public post - just show display text
        return display;
    });

    // [[link]] format
    content = content.replace(/\[\[([^\]]+)\]\]/g, (match, link) => {
        const lookupKey = link.toLowerCase().trim();
        const post = publicPosts.get(lookupKey);

        if (post) {
            // Link exists as a public post - convert to LinkTo component
            return `<LinkTo to="/posts/${post.slug}" text="${post.title}" />`;
        }

        // Not a public post - just show link text
        return link;
    });

    return content;
}

// Convert Obsidian image embeds to MDX Figure components
function convertImageEmbeds(content: string, sourceDir: string): { content: string; images: string[] } {
    const images: string[] = [];

    // Pattern: ![[image.png]] or ![[image.png|alt text]]
    const imagePattern = /!\[\[([^\]|]+\.(png|jpg|jpeg|gif|webp|svg))(\|([^\]]+))?\]\]/gi;

    const newContent = content.replace(imagePattern, (match, imagePath, ext, _, altText) => {
        // Find the image in the vault
        const possiblePaths = [
            path.join(sourceDir, imagePath),
            path.join(OBSIDIAN_VAULT, imagePath),
            path.join(OBSIDIAN_VAULT, 'Attachments', imagePath),
            path.join(OBSIDIAN_VAULT, 'assets', imagePath),
            path.join(OBSIDIAN_VAULT, 'Excalidraw', imagePath),
            path.join(OBSIDIAN_VAULT, '99 Archive', 'Images', imagePath),
        ];

        let foundPath: string | null = null;
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                foundPath = p;
                break;
            }
        }

        if (foundPath) {
            images.push(foundPath);
            const filename = path.basename(imagePath);
            const alt = altText || filename;
            return `<Figure className="w-auto max-h-128" src="/src/assets/blog/${filename}" alt="${alt}" />`;
        }

        // If image not found, convert to standard markdown
        return `![${altText || imagePath}](${imagePath})`;
    });

    // Also handle standard markdown images
    const mdImagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const finalContent = newContent.replace(mdImagePattern, (match, alt, src) => {
        // Check if it's a local image
        if (!src.startsWith('http')) {
            const possiblePaths = [
                path.join(sourceDir, src),
                path.join(OBSIDIAN_VAULT, src),
            ];

            for (const p of possiblePaths) {
                if (fs.existsSync(p)) {
                    images.push(p);
                    const filename = path.basename(src);
                    return `<Figure className="w-auto max-h-128" src="/src/assets/blog/${filename}" alt="${alt || filename}" />`;
                }
            }
        }

        return match; // Keep external URLs as-is
    });

    return { content: finalContent, images };
}

// Convert Obsidian callouts to MDX-compatible blockquotes
function convertCallouts(content: string): string {
    // Pattern: > [!type]+ title\n> content
    return content.replace(
        /> \[!(\w+)\]\+?\s*([^\n]*)\n((?:>.*\n?)*)/g,
        (match, type, title, body) => {
            const cleanBody = body.replace(/^> ?/gm, '').trim();
            const heading = title || type.charAt(0).toUpperCase() + type.slice(1);
            return `> **${heading}**\n>\n> ${cleanBody.split('\n').join('\n> ')}`;
        }
    );
}

// Convert Obsidian-specific syntax to MDX
function convertToMDX(content: string, sourceFile: string): { content: string; images: string[] } {
    const sourceDir = path.dirname(sourceFile);

    // Convert image embeds FIRST (before wikilinks, as ![[]] would be matched by [[]])
    const { content: withImages, images } = convertImageEmbeds(content, sourceDir);
    let converted = withImages;

    // Convert wikilinks (uses the public posts index)
    converted = convertWikilinks(converted);

    // Convert callouts
    converted = convertCallouts(converted);

    // Remove Obsidian-specific HTML blocks
    converted = converted
        // Remove status tags div blocks
        .replace(/<div class="status-tag-container">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '')
        // Remove properties callouts
        .replace(/> \[!note\]\+\s*\*\*Properties\*\*[\s\S]*?---/g, '')
        // Clean up multiple consecutive newlines
        .replace(/\n{3,}/g, '\n\n');

    return { content: converted.trim(), images };
}

// Process a single file
function processFile(filePath: string): { success: boolean; outputPath?: string; images?: string[]; blocked?: string[] } {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontmatter, content } = matter(fileContent);

        // Check if this is a public post (default to private if not set)
        if (frontmatter.visibility !== 'public') {
            return { success: false };
        }

        // Validate required frontmatter
        if (!frontmatter.title) {
            console.warn(`Skipping ${filePath}: missing title`);
            return { success: false };
        }

        // Convert content
        const { content: mdxContent, images } = convertToMDX(content, filePath);

        // Parse tags - handle both array and string formats
        let tags: string[] = [];
        if (Array.isArray(frontmatter.tags)) {
            tags = frontmatter.tags.filter((t: string) =>
                t !== 'blog' && t !== 'public' && t !== 'private'
            );
        } else if (typeof frontmatter.tags === 'string') {
            tags = frontmatter.tags.split(',').map((t: string) => t.trim()).filter((t: string) =>
                t && t !== 'blog' && t !== 'public' && t !== 'private'
            );
        }

        // Handle date - could be Date object, string, or undefined
        let dateStr: string;
        if (frontmatter.created instanceof Date) {
            dateStr = frontmatter.created.toISOString().split('T')[0];
        } else if (typeof frontmatter.created === 'string') {
            dateStr = frontmatter.created.split('T')[0];
        } else {
            dateStr = new Date().toISOString().split('T')[0];
        }

        // Build new frontmatter for portfolio
        const newFrontmatter: Record<string, any> = {
            author: 'Sean Leishman',
            title: frontmatter.title,
            date: dateStr,
            tags: tags,
            ShowBreadCrumbs: true,
            ShowToc: false,
            hideMeta: false,
            Summary: frontmatter.summary || '',
            weight: 1,
        };

        if (frontmatter.imageSrc) {
            newFrontmatter.imageSrc = frontmatter.imageSrc;
        }
        if (frontmatter.imageAlt) {
            newFrontmatter.imageAlt = frontmatter.imageAlt;
        }

        // Generate output filename
        const slug = generateSlug(frontmatter.title);
        const outputPath = path.join(PORTFOLIO_POSTS, `${slug}.mdx`);

        // Build final MDX file
        const mdxFile = matter.stringify(mdxContent, newFrontmatter);

        // Gate the finished artifact -- title, summary and tags are published too.
        const found = leaks(mdxFile);
        if (found.length > 0) {
            return { success: false, blocked: found };
        }

        // Ensure output directory exists
        if (!fs.existsSync(PORTFOLIO_POSTS)) {
            fs.mkdirSync(PORTFOLIO_POSTS, { recursive: true });
        }

        fs.writeFileSync(outputPath, mdxFile);

        return { success: true, outputPath, images };
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
        return { success: false };
    }
}

// Copy images to portfolio assets
function copyImages(images: string[]): void {
    if (images.length === 0) return;

    if (!fs.existsSync(PORTFOLIO_ASSETS)) {
        fs.mkdirSync(PORTFOLIO_ASSETS, { recursive: true });
    }

    const uniqueImages = [...new Set(images)];

    for (const imagePath of uniqueImages) {
        const filename = path.basename(imagePath);
        const destPath = path.join(PORTFOLIO_ASSETS, filename);

        try {
            fs.copyFileSync(imagePath, destPath);
            console.log(`  Copied: ${filename}`);
        } catch (error) {
            console.error(`  Failed to copy ${filename}:`, error);
        }
    }
}

// Main sync function
function sync(): void {
    console.log('Syncing Obsidian vault to portfolio...\n');

    if (!fs.existsSync(OBSIDIAN_VAULT)) {
        console.error(`Vault not found: ${OBSIDIAN_VAULT}\nSet OBSIDIAN_VAULT to the vault root.`);
        process.exit(1);
    }

    loadLeakGate();

    const markdownFiles = findMarkdownFiles(OBSIDIAN_VAULT);
    console.log(`Found ${markdownFiles.length} markdown files in vault\n`);

    // First pass: build index of all public posts for link resolution
    console.log('Building public posts index...');
    buildPublicPostsIndex(markdownFiles);
    console.log(`Found ${publicPosts.size / 2} public posts\n`);

    // Second pass: process and convert files
    let synced = 0;
    const allImages: string[] = [];

    const blocked: Array<{ file: string; found: string[] }> = [];

    for (const file of markdownFiles) {
        const result = processFile(file);

        if (result.blocked) {
            blocked.push({ file: path.relative(OBSIDIAN_VAULT, file), found: result.blocked });
        }

        if (result.success) {
            const relativePath = path.relative(OBSIDIAN_VAULT, file);
            console.log(`Synced: ${relativePath}`);
            console.log(`    -> ${path.basename(result.outputPath!)}`);
            synced++;

            if (result.images && result.images.length > 0) {
                allImages.push(...result.images);
            }
        }
    }

    // Copy all images
    if (allImages.length > 0) {
        console.log(`\nCopying ${allImages.length} image(s)...`);
        copyImages(allImages);
    }

    // Reported last, so it is the final thing on screen after a pre-commit run.
    // NOT a non-zero exit: nothing leaked (the file simply wasn't written), and a sync that
    // fails the commit is how this pipeline froze the repo for two months once already.
    if (blocked.length > 0) {
        console.log(`\nBLOCKED ${blocked.length} post(s) — private names would have been published:`);
        for (const b of blocked) {
            console.log(`  ${b.file}`);
            console.log(`      ${b.found.join(', ')}`);
        }
        console.log('  Not written. Edit the note or widen it, then re-run.');
    }

    console.log(`\nSync complete: ${synced} post(s) synced${blocked.length ? `, ${blocked.length} blocked` : ''}`);
}

// Run sync
sync();
