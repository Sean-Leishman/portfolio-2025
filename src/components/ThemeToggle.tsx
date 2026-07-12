import { useState } from 'react';

// The class is already on <html> before paint (inline script in index.html);
// this just keeps the button label in sync with it.
const isDark = () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

function ThemeToggle() {
    const [dark, setDark] = useState(isDark);

    const toggle = () => {
        const next = !dark;
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
        setDark(next);
    };

    return (
        <button
            onClick={toggle}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Light mode' : 'Dark mode'}
            className="text-muted-foreground hover:text-accent transition-colors cursor-pointer p-1"
        >
            {/* inline SVG: Merriweather/JetBrains have no moon glyph, ☾ falls back to a stray 'c' */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {dark ? (
                    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
                ) : (
                    <>
                        <circle cx="12" cy="12" r="4.2" />
                        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
                    </>
                )}
            </svg>
        </button>
    );
}

export default ThemeToggle;
