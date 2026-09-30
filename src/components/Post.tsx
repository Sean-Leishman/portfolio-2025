import MDXRenderer from './MDXRenderer';
import Meta from './Meta';
import PostTopBar from './PostTopBar';

function Post({ compiledMDX, title, date, imageSrc, imageAlt, summary, path }: { compiledMDX: string | undefined; title: string | undefined; date: string | undefined; imageSrc?: string; imageAlt?: string, summary?: string, path?: string }) {
    return (
        <div className="max-w-2xl mx-auto px-4 text-left">
            {path && <Meta title={`${title} · Sean Leishman`} description={summary || `${title}, written ${date}.`} path={path} image={imageSrc} />}
            <PostTopBar
                backLink="/posts"
                title={title}
                date={date}
                imageSrc={imageSrc}
                imageAlt={imageAlt}
                summary={summary}
            />
            <MDXRenderer compiledMDX={compiledMDX} />
        </div>
    );
}

export default Post;
