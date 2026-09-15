import { useEffect, useState } from 'react';

import { getLoadedPost, loadPost, type Post } from '../lib/content';

// main.tsx preloads the current post before the first render and prefetches the rest when idle,
// so in practice this renders synchronously; the effect only covers a click that beats the prefetch.
function PostRoute({ post }: { post: Post }) {
    const [entry, setEntry] = useState(() => getLoadedPost(post.link));

    useEffect(() => {
        if (!entry) loadPost(post.link).then(setEntry);
    }, [entry, post.link]);

    if (!entry) return null;
    const { Post: PostView, compiledMdx } = entry;
    return <PostView compiledMDX={compiledMdx} title={post.title} date={post.date} imageSrc={post.imageSrc} imageAlt={post.imageAlt} />;
}

export default PostRoute;
