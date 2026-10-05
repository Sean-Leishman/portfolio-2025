import { ARCHIVE, getCredit } from '../lib/imageCredits';

// A one-line credit under an image, where the source is known.
function ImageCredit({ src, className = '' }: { src?: string, className?: string }) {
    if (!src) return null;
    const credit = getCredit(src);
    const href = credit?.href ?? ARCHIVE;
    const text = credit ? `${credit.title} · ${credit.artist}, ${credit.year} ↗` : 'Public Domain Image Archive ↗';

    return (
        <p className={`mono text-xs text-muted-foreground ${className}`}>
            <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">{text}</a>
        </p>
    );
}

export default ImageCredit;
