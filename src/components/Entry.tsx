import type { HTMLAttributes, ReactNode } from 'react';

// One row anatomy for projects, experience, papers and posts: bold title left, mono meta right,
// muted description below, mono tag pills last. Change the look here, not per list.

export function EntryList({ children }: { children: ReactNode }) {
    return <ul className="divide-y divide-border text-left">{children}</ul>;
}

export function EntryRow({ children }: { children: ReactNode }) {
    return <li className="py-6 first:pt-0 last:pb-0 list-none">{children}</li>;
}

export function EntryHeader({ title, meta, className = '', ...rest }: { title: ReactNode, meta?: ReactNode } & Omit<HTMLAttributes<HTMLDivElement>, 'title'>) {
    return (
        <div {...rest} className={`flex items-baseline justify-between gap-x-6 gap-y-1 flex-wrap ${className}`}>
            <h3 className="text-lg font-extrabold tracking-tight text-foreground">{title}</h3>
            {meta && <div className="mono text-xs text-muted-foreground flex items-center gap-3 shrink-0">{meta}</div>}
        </div>
    );
}

export function EntryDescription({ children }: { children: ReactNode }) {
    return <p className="text-sm leading-relaxed text-foreground/80 mt-1">{children}</p>;
}

export function Tags({ items }: { items?: string[] }) {
    if (!items?.length) return null;
    return (
        <div className="flex flex-wrap gap-2 mt-3">
            {items.map((item) => (
                <span key={item} className="mono px-2.5 py-1 text-xs text-muted-foreground border border-border rounded-full">{item}</span>
            ))}
        </div>
    );
}

// Title and meta links share these so every list hovers the same way.
export const titleLink = 'hover:text-accent transition-colors';
export const metaLink = 'text-accent hover:underline';

export function ExternalLink({ href, className, children, label }: { href: string, className: string, children: ReactNode, label?: string }) {
    return <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={className}>{children}</a>;
}
