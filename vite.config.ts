import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import fs from 'fs';
import path from 'path';
import process from 'process';

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
                    // Was extractLink(directory, title, date), which put the raw title -- spaces,
                    // colons and all -- straight into the URL. react-snap then wrote those routes to
                    // disk with literal %20 in the directory name, so a browser asking for
                    // /posts/Welcome%20Post decoded it to "Welcome Post", found nothing, and fell
                    // through to the SPA shell. Every per-post pre-render was unreachable.
                    // The sync script already computes this exact slug; the filename carries it.
                    link: `/${directory}/${filename.replace(/\.mdx?$/, '')}`,
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
        // react-snap pins puppeteer 1.20 (Chromium ~78), which predates `??` and `?.` (Chrome 80).
        // Without this the pre-render throws `SyntaxError: Unexpected token '?'` on every route and
        // silently emits empty <div id="root"></div> shells -- which is what the live site served.
        target: 'es2019',
        // Was `true`, which shipped a 5 MB .js.map to production on every deploy.
        sourcemap: false,
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
                    // Was `**/*`, which also copied 78 WSL `:Zone.Identifier` turds into dist/.
                    src: 'src/assets/**/*.{png,jpg,jpeg,gif,webp,avif,svg}',
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
