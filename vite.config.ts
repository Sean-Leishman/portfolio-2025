import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import fs from 'fs';
import path from 'path';
import process from 'process';
import { extractLink } from './src/lib/utils';

import mdx from '@mdx-js/rollup';
import { bundleMDX } from 'mdx-bundler';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { viteStaticCopy } from 'vite-plugin-static-copy';


let components: { [key: string]: string } = {
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

        }
    }

    const items = await Promise.all(
        filenames.filter((filename: string) => filename.endsWith('.mdx') || filename.endsWith('.md'))
            .map(async (filename: string) => {
                const filePath = path.join(itemsDir, filename);
                const content = await fs.promises.readFile(filePath, 'utf-8');

                const { code, frontmatter } = await bundleMDX({
                    source: content,
                    // globals: globals,
                    files: components,
                    mdxOptions(options, _) {
                        options.remarkPlugin = [
                            remarkGfm,
                            remarkFrontmatter,
                            remarkMdxFrontmatter
                        ];
                        options.rehypePlugins = [remarkMath];
                        return options;
                    }
                });


                return {
                    filename: filename,
                    title: frontmatter.title,
                    date: frontmatter.date,
                    tags: frontmatter.tags || [],
                    imageSrc: frontmatter.imageSrc || '',
                    imageAlt: frontmatter.imageAlt || '',
                    link: extractLink(directory, frontmatter.title, frontmatter.date),
                    compiledMdx: code,
                };

            }

            ));


    return items.sort((a: any, b: any) => { return new Date(b.date).getTime() - new Date(a.date).getTime() });
}

function contentGeneratorPlugin() {
    return {
        name: 'content-generator',
        async buildStart() {
            const content = {
                posts: await generateItems('posts'),
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
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp', '**/*.avif'],
    build: {
        sourcemap: true,
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.svg')) {
                        return 'src/assets/svg/[name][extname]';
                    }
                    if (assetInfo.name && (assetInfo.name.endsWith('.png') || assetInfo.name.endsWith('.jpg') || assetInfo.name.endsWith('.jpeg') || assetInfo.name.endsWith('.gif') || assetInfo.name.endsWith('.webp') || assetInfo.name.endsWith('.avif'))) {
                        return 'src/assets/images/[name][extname]';
                    }
                    return 'src/assets/[name][extname]';
                }
            }
        }
    },
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
        viteStaticCopy({
            targets: [
                {
                    src: 'src/assets/**/*',
                    dest: 'src/assets',
                }
            ]
        }
        ),
    ],
    optimizeDeps: {
        include: ["react/jsx-runtime"]
    },
});
