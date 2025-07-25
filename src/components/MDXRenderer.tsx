import React, { use } from 'react';

import { MDXProvider } from '@mdx-js/react';
import { getMDXComponent } from 'mdx-bundler/client';
import { useMDXComponents } from '../lib/mdxComponents';

import SyntaxHighlighter from 'react-syntax-highlighter';

import LinkTo from './LinkTo';
import Figure from './Figure';

function code({ className, ...properties }) {
    const match = /language-\[(\w+)\]/.exec(className || '');
    console.log('code className:', className, 'match', match);
    return match ? (
        <SyntaxHighlighter
            language={match[1]}
            PreTag="div"
            {...properties}
        />
    ) : (
        <code {...properties} />
    );

}

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

    const MDXComponents = {
        ...useMDXComponents(components),
        LinkTo,
        Figure,
        code,
    }

    return (
        <div>
            <Component components={MDXComponents} />
        </div>
    );

};

export default MDXRenderer;
