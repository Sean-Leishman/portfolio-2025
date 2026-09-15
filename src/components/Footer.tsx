// Same small mono as the other metadata on the page.
function Footer() {
    return (
        <footer className="mono text-xs text-muted-foreground text-center py-10 mt-16">
            {`Sean Leishman · ${new Date().getFullYear()} · `}
            <a href="https://github.com/Sean-Leishman" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">GitHub ↗</a>
        </footer>
    )
}

export default Footer;
