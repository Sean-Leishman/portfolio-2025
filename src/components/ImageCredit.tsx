import { getCredit } from '../lib/imageCredits';

// A one-line credit under an image, where the source is known.
function ImageCredit({ src, className = '' }: { src?: string, className?: string }) {
    const credit = getCredit(src);
    if (!credit) return null;

    return (
        <p className={`mono text-xs text-muted-foreground ${className}`}>
            <a href={credit.href} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                {`${credit.title} · ${credit.artist}, ${credit.year} ↗`}
            </a>
        </p>
    );
}

export default ImageCredit;
