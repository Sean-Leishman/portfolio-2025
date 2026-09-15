// The class is already on <html> before paint (inline script in index.html). The icon follows it
// via dark: variants rather than React state, so react-snap's light-mode HTML hydrates cleanly for
// dark-mode visitors instead of mismatching and forcing a client re-render.
function ThemeToggle() {
    const toggle = () => {
        const dark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
            className="text-muted-foreground hover:text-accent transition-colors cursor-pointer p-1"
        >
            {/* inline SVG: Merriweather/JetBrains have no moon glyph, ☾ falls back to a stray 'c' */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path className="hidden dark:inline" d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
                <g className="dark:hidden">
                    <circle cx="12" cy="12" r="4.2" />
                    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
                </g>
            </svg>
        </button>
    );
}

export default ThemeToggle;
