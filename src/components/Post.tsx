import LinkTo from './LinkTo';
import TopBar from './TopBar';
import Footer from './Footer';
import MDXRenderer from './MDXRenderer';
import Meta from './Meta';
import PostTopBar from './PostTopBar';

function Post({ compiledMDX, title, date, updated, imageSrc, imageAlt, summary, path }: { compiledMDX: string | undefined; title: string | undefined; date: string | undefined; updated?: string; imageSrc?: string; imageAlt?: string, summary?: string, path?: string }) {
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
                />
                <MDXRenderer compiledMDX={compiledMDX} />
                <div className="mt-16 text-base italic text-muted-foreground">
                    <p>{'Thanks for reading — Sean.'}</p>
                    <p className="mt-6 not-italic"><LinkTo to="/posts" text="← All posts" /></p>
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default Post;
