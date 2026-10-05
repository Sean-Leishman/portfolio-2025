import { useEffect, useState } from 'react';

import { getLoadedPost, getPosts, loadPost, type Post } from '../lib/content';

// main.tsx preloads the current post before the first render and prefetches the rest when idle,
// so in practice this renders synchronously; the effect only covers a click that beats the prefetch.
function PostRoute({ post }: { post: Post }) {
    const [entry, setEntry] = useState(() => getLoadedPost(post.link));
    const all = getPosts();
    const index = all.findIndex((p) => p.link === post.link);
    const newer = index > 0 ? all[index - 1] : undefined;
    const older = index >= 0 && index < all.length - 1 ? all[index + 1] : undefined;

    useEffect(() => {
        if (!entry) loadPost(post.link).then(setEntry);
    }, [entry, post.link]);

    if (!entry) return null;
    const { Post: PostView, compiledMdx } = entry;
    return <PostView compiledMDX={compiledMdx} title={post.title} date={post.date} updated={post.updated} imageSrc={post.imageSrc} imageAlt={post.imageAlt} summary={post.summary} path={post.link} newer={newer} older={older} />;
}

export default PostRoute;
