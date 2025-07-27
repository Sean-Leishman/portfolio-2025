import MDXRenderer from './MDXRenderer';
import PostTopBar from './PostTopBar';

function Post({ compiledMDX, title, date, imageSrc, imageAlt, summary }: { compiledMDX: string | undefined; title: string | undefined; date: string | undefined; imageSrc?: string; imageAlt?: string, summary?: string }) {
    return (
        <div className="max-w-2xl mx-auto px-4 text-left">
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
