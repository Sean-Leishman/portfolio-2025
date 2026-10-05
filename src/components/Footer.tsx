import { ARCHIVE } from '../lib/imageCredits';
import { getSiteUpdated } from '../lib/content';

// Same small mono as the other metadata on the page.
function Footer() {
    const updated = getSiteUpdated();

    return (
        <footer className="mono text-xs text-muted-foreground text-center py-10 mt-16 space-y-1">
            <p>
                {`Sean Leishman · ${new Date().getFullYear()} · `}
                <a href="https://github.com/Sean-Leishman" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">GitHub ↗</a>
                {updated ? ` · updated ${updated}` : ''}
            </p>
            <p>
                {'Artwork from the '}
                <a href={ARCHIVE} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Public Domain Image Archive ↗</a>
            </p>
        </footer>
    )
}

export default Footer;
