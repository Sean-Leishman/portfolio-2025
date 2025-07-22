import react from 'react';
import MDXRenderer from './MDXRenderer';

function Post({ compiledMDX }: { compiledMDX: string; }) {
    return (
        <div className="prose">
            <MDXRenderer compiledMDX={compiledMDX} />
        </div>
    );
}

export default Post;
