import React, { use } from 'react';

import { MDXProvider } from '@mdx-js/react';
import { getMDXComponent } from 'mdx-bundler/client';
import { useMDXComponents } from '../lib/mdxComponents';

const MDXRenderer = ({ compiledMDX, components = {} }) => {
    console.log('MDXRenderer compiledMDX:', typeof compiledMDX);
    const Component = React.useMemo(() => {
        try {
            return getMDXComponent(compiledMDX)
        } catch (error) {
            console.error('Error getting MDX component:', error);
            return () => <div>Error loading content</div>;
        }
    }, [compiledMDX]);

    console.log('Component type:', typeof Component);
    console.log('Component source:', Component.toString().substring(0, 200));

    return (
        <div>
            <Component components={useMDXComponents(components)} />
        </div>
    );

};

export default MDXRenderer;
