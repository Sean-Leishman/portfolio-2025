import react from 'react';

import MDXRenderer from './MDXRenderer';
import PostTopBar from './PostTopBar';

function Post({ compiledMDX }: { compiledMDX: string; }) {
    return (
        <div className="max-w-2xl mx-auto px-4 text-left">
            <PostTopBar
                backLink="/posts"
                imageSrc="/images/icons/back.svg" />
            <MDXRenderer compiledMDX={compiledMDX} />
        </div>
    );
}

export default Post;
