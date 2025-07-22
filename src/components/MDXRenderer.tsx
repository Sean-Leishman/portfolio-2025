import React from 'react';
import { getMDXComponent } from 'mdx-bundler/client';

const MDXRenderer = ({ compiledMDX, components = {} }) => {
    const Component = React.useMemo(() => getMDXComponent(compiledMDX), [compiledMDX]);
    return (
        <Component />
    )
};

export default MDXRenderer;
