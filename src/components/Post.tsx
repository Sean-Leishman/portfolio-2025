import react from 'react';
import MDXRenderer from './MDXRenderer';

function Post({ compiledMDX }: { compiledMDX: string; }) {
    return (
        <div className="max-w-2xl mx-auto px-4 text-left">
            <MDXRenderer compiledMDX={compiledMDX} />
        </div>
    );
}

export default Post;
