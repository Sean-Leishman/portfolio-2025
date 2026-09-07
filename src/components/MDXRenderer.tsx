import React from 'react';

import { getMDXComponent } from 'mdx-bundler/client';
import { useMDXComponents } from '../lib/mdxComponents';

// The default entry point registers ~200 languages (refractor + prismjs, ~5 MB on disk) and
// was the single biggest thing in the bundle. The posts use three.
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import kotlin from 'react-syntax-highlighter/dist/esm/languages/hljs/kotlin';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';

SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('cpp', cpp);

import LinkTo from './LinkTo';
import Figure from './Figure';

function code({ className, children, ...properties }: any) {
    const match = /language-\[(\w+)\]/.exec(className || '');
    if (!match) {
        // No language class means inline code (`like this`), which MDX routes through the same
        // component. This was `return <></>`, so every inline span in every post rendered as
        // nothing -- sentences silently lost their subject. It is inline, so <code>, not <pre>.
        return <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10" {...properties}>{children}</code>;
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
