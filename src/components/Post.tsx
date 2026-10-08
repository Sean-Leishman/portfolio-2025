import LinkTo from './LinkTo';
import type { Post as PostMeta } from '../lib/content';
import TopBar from './TopBar';
import Footer from './Footer';
import MDXRenderer from './MDXRenderer';
import Meta from './Meta';
import PostTopBar from './PostTopBar';

function Neighbour({ post, direction }: { post?: PostMeta, direction: 'newer' | 'older' }) {
    if (!post) return <span />;
    const alignment = direction === 'older' ? 'text-right items-end' : 'items-start';
    return (
        <span className={`flex flex-col gap-1 max-w-[48%] ${alignment}`}>
            <span className="mono text-xs text-muted-foreground">{direction === 'newer' ? 'Newer' : 'Older'}</span>
            <LinkTo to={post.link} text={direction === 'newer' ? `← ${post.title}` : `${post.title} →`} customClassName="font-semibold" />
        </span>
    );
}

function Post({ compiledMDX, title, date, updated, imageSrc, imageAlt, summary, tags, path, newer, older }: { compiledMDX: string | undefined; title: string | undefined; date: string | undefined; updated?: string; imageSrc?: string; imageAlt?: string, summary?: string, tags?: string[], path?: string, newer?: PostMeta, older?: PostMeta }) {
    return (
        <main>
            <div className="max-w-2xl mx-auto px-4 text-left">
                <TopBar />
                {path && <Meta title={`${title} · Sean Leishman`} description={summary || `${title}, written ${date}.`} path={path} image={imageSrc} />}
                {/* no back arrow here: the nav above and "All posts" below already cover it */}
                <PostTopBar
                    title={title}
                    date={date}
                    updated={updated}
                    imageSrc={imageSrc}
                    imageAlt={imageAlt}
                    summary={summary}
                    tags={tags}
                />
                <MDXRenderer compiledMDX={compiledMDX} />
                <div className="mt-16 text-base italic text-muted-foreground">
                    <p>{'Thanks for reading — Sean.'}</p>
                    <p className="mt-6 not-italic"><LinkTo to="/posts" text="← All posts" /></p>
                </div>
                {(newer || older) && (
                    <nav className="mt-12 flex justify-between gap-6 text-base">
                        <Neighbour post={newer} direction="newer" />
                        <Neighbour post={older} direction="older" />
                    </nav>
                )}
            </div>
            <Footer />
        </main>
    );
}

export default Post;
