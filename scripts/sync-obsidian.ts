#!/usr/bin/env npx tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OBSIDIAN_VAULT = '/mnt/c/Users/leish/OneDrive/Documents/Obsidian Vault';
const PORTFOLIO_POSTS = path.join(__dirname, '..', 'src', 'posts');
const PORTFOLIO_ASSETS = path.join(__dirname, '..', 'src', 'assets', 'blog');

// Cache of public posts for link resolution
const publicPosts: Map<string, { title: string; slug: string }> = new Map();

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
function processFile(filePath: string): { success: boolean; outputPath?: string; images?: string[] } {
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

    const markdownFiles = findMarkdownFiles(OBSIDIAN_VAULT);
    console.log(`Found ${markdownFiles.length} markdown files in vault\n`);

    // First pass: build index of all public posts for link resolution
    console.log('Building public posts index...');
    buildPublicPostsIndex(markdownFiles);
    console.log(`Found ${publicPosts.size / 2} public posts\n`);

    // Second pass: process and convert files
    let synced = 0;
    const allImages: string[] = [];

    for (const file of markdownFiles) {
        const result = processFile(file);

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

    console.log(`\nSync complete: ${synced} post(s) synced`);
}

// Run sync
sync();
