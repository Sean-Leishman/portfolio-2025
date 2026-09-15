import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
        h1: (props) => <h1 className="text-2xl font-extrabold tracking-tight mt-12 mb-3" {...props} />,
        h2: (props) => <h2 className="text-xl font-extrabold tracking-tight mt-12 mb-3" {...props} />,
        h3: (props) => <h3 className="text-lg font-bold mt-8 mb-2" {...props} />,
        h4: (props) => <h4 className="eyebrow mt-6 mb-2" {...props} />,
        li: (props) => (
            <li className="text-base my-2 list-decimal list-inside ml-4" {...props} />
        ),
        ol: (props) => <ol className="list-decimal my-8" {...props} />,
        ul: (props) => <ul className="list-disc mb-6" {...props} />,
        a: (props) => <a {...props} />,
        pre: (props) => <pre className="code-block" {...props} />,
        p: (props) => <p className="text-base leading-relaxed mb-4 max-w-[68ch]" {...props} />,
        strong: (props) => <strong className="font-bold" {...props} />,
        code: (props) => {
            const isInline =
                typeof props.children === 'string' && !props.children.includes('\n')
            return (
                <code
                    className={`text-xs bg-card mb-4 px-1 py-0.5 rounded-md ${isInline ? 'inline' : 'block'
                        }`}
                    {...props}
                />
            )
        },
        em: (props) => <em className="italic" {...props} />,
        blockquote: (props) => (
            <blockquote className="border-l-4 pl-4 border-accent" {...props} />
        ),
    }
}
