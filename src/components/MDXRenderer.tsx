import React from 'react';

import { getMDXComponent } from 'mdx-bundler/client';
import { useMDXComponents } from '../lib/mdxComponents';

import SyntaxHighlighter from 'react-syntax-highlighter';

import LinkTo from './LinkTo';
import Figure from './Figure';

function code({ className, children, ...properties }: any) {
    const match = /language-\[(\w+)\]/.exec(className || '');
    if (!match) {
        return <></>;
    }
    return <SyntaxHighlighter
        language={match[1]}
        PreTag="div"
        className="mb-4"
        {...properties}>
        {children} </SyntaxHighlighter>

}

function MDXRenderer({ compiledMDX, components = {} }: {
    compiledMDX: string | undefined, components?: Record<string, any>
}) {
    const Component = React.useMemo(() => {
        try {
            if (!compiledMDX) {
                return () => <div>No content available</div>;
            }
            return getMDXComponent(compiledMDX)
        } catch (error) {
            console.error('Error getting MDX component:', error);
            return () => <div>Error loading content</div>;
        }
    }, [compiledMDX]);

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
