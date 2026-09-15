import { useState, type ReactNode } from 'react';

// Wraps a rendered code block so it can be copied. The button is hidden from the pre-rendered
// HTML's text, and its state starts false on both sides, so hydration matches.
function CodeBlock({ code, children }: { code: string, children: ReactNode }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
        } catch {
            return; // clipboard blocked (insecure origin, denied permission): leave the label alone
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="code-block group">
            <button
                type="button"
                onClick={copy}
                aria-label="Copy code"
                className="code-copy mono text-xs px-2 py-1 rounded border border-border bg-background text-muted-foreground hover:text-accent"
            >
                {copied ? 'copied' : 'copy'}
            </button>
            {children}
        </div>
    );
}

export default CodeBlock;
