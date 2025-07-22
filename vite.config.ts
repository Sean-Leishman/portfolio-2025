import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import process from 'process';
import { extractLink } from './src/lib/utils';

import mdx from '@mdx-js/rollup';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

interface PostData {
    title: string;
    date: string;
    tags?: string[];
    excerpt?: string;
    [key: string]: any;
}

interface ProcessedItem {
    filename: string;
    slug: string;
    title: string;
    date: string;
    tags: string[];
    excerpt: string;
    compiledMDX: string;
    frontmatter: PostData;
}

async function generateItems(directory: string) {
    const itemsDir = path.join(process.cwd(), "src", directory);
    const filenames = await fs.promises.readdir(itemsDir);

    const items = await Promise.all(
        filenames.filter(filename => filename.endsWith('.mdx') || filename.endsWith('.md'))
            .map(async (filename) => {
                const filePath = path.join(itemsDir, filename);
                const content = await fs.promises.readFile(filePath, 'utf-8');

                const { data, content: fileContent } = matter(content);

                try {
                    const compiledMDX = await compile(content, {
                        outputFormat: 'function-body',
                        remarkPlugins: [remarkGfm],
                        rehypePlugins: [rehypeHighlight, remarkMath],
                        development: false
                    });

                    return {
                        filename: filename,
                        title: data.title,
                        date: data.date,
                        tags: data.tags || [],
                        link: extractLink(directory, data.title, data.date),
                        compiledMdx: compiledMDX,
                    };
                } catch (error) {
                    console.error(`Error compiling ${filename}:`, error);
                    throw error;
                }
            }

            ));

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function contentGeneratorPlugin() {
    return {
        name: 'content-generator',
        async buildStart() {
            const content = {
                posts: await generateItems('posts'),
                projects: await generateItems('projects'),
            }

            const outputPath = path.join(process.cwd(), 'src', 'generated');
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath, { recursive: true });
            }

            fs.writeFileSync(
                path.join(outputPath, 'content.json'),
                JSON.stringify(content, null, 2)
            );

        }
    }
}

export default defineConfig({
    plugins: [
        react(
            { include: ['**/*.tsx', '**/*.jsx', '**/*.ts', '**/*.js', '**/*.mdx', '**/*.md', '**/*.html', '**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp', '**/*.avif'] },
        ),
        tailwindcss(),
        contentGeneratorPlugin(),
        {
            enforce: 'pre',
            ...mdx({
                providerImportSource: '@mdx-js/react',
                remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
                rehypePlugins: [rehypeHighlight, remarkMath],
                development: false,
            }),
        },
    ],
    optimizeDeps: {
        include: ["react/jsx-runtime"]
    }
})
