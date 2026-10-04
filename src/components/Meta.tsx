// Per-page <title>/<meta>. React 19 hoists these into <head> wherever they are rendered, so
// react-snap writes them into each pre-rendered page: every route had the same title and no
// description or share preview before this.
const SITE = import.meta.env.VITE_SITE_URL ?? 'https://2025-portfolio.web.app';

function Meta({ title, description, path, image }: { title: string, description: string, path: string, image?: string }) {
    const url = SITE + path;
    const imageUrl = image ? SITE + image : undefined;

    return (
        <>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />
            <meta property="og:type" content={path.startsWith('/posts/') ? 'article' : 'website'} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            {imageUrl && <meta property="og:image" content={imageUrl} />}
            <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
            {path === '/404' && <meta name="robots" content="noindex" />}
        </>
    );
}

export default Meta;
