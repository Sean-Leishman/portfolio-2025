import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import process from 'process';
import { extractLink } from './src/lib/utils';

import mdx from '@mdx-js/rollup';
import { bundleMDX } from 'mdx-bundler';
import remarkGfm from 'remark-gfm';
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

const globals = {
    '@mdx-js/react': {
        varName: 'MdxJsReact',
        namedExports: ['useMDXComponents'],
        defaultExport: false,
    },
    'react-router-dom': {
        varName: 'ReactRouterDom',
        namedExports: ['Link', 'useParams', 'useLocation'],
        defaultExport: false,
    },
};

let components = {
    "./src/components/LinkTo.tsx": "",
    "./src/components/Figure.tsx": "",
}

async function generateItems(directory: string) {
    const itemsDir = path.join(process.cwd(), "src", directory);
    const filenames = await fs.promises.readdir(itemsDir);

    for (const componentPath of Object.keys(components)) {
        const componentFullPath = path.join(process.cwd(), componentPath);
        if (fs.existsSync(componentFullPath)) {
            components[componentPath] = await fs.promises.readFile(componentFullPath, 'utf-8');
        } else {
            console.warn(`Component file not found: ${componentFullPath}`);
        }
    }

    const items = await Promise.all(
        filenames.filter(filename => filename.endsWith('.mdx') || filename.endsWith('.md'))
            .map(async (filename) => {
                const filePath = path.join(itemsDir, filename);
                const content = await fs.promises.readFile(filePath, 'utf-8');

                const { code, frontmatter } = await bundleMDX({
                    source: content,
                    // globals: globals,
                    files: components,
                    mdxOptions(options, frontmatter) {
                        options.remarkPlugin = [
                            remarkGfm,
                            remarkFrontmatter,
                            remarkMdxFrontmatter
                        ];
                        options.rehypePlugins = [remarkMath];
                        return options;
                    }
                });


                console.log(`Processing file: ${filename}`);
                return {
                    filename: filename,
                    title: frontmatter.title,
                    date: frontmatter.date,
                    tags: frontmatter.tags || [],
                    link: extractLink(directory, frontmatter.title, frontmatter.date),
                    compiledMdx: code,
                };

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
                rehypePlugins: [remarkMath],
                development: false,
            }),
        },
    ],
    optimizeDeps: {
        include: ["react/jsx-runtime"]
    }
})
