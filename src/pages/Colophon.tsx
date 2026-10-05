import Main from '../components/Main';
import Dot from '../components/Dot';
import Meta from '../components/Meta';
import LinkTo from '../components/LinkTo';
import { ExternalLink, metaLink } from '../components/Entry';
import { ARCHIVE, credits } from '../lib/imageCredits';

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <section className="mt-10">
            <h2 className="text-lg font-extrabold tracking-tight mb-2">{title}</h2>
            <div className="text-base leading-normal max-w-[68ch] space-y-3">{children}</div>
        </section>
    );
}

function Colophon() {
    return (
        <Main imageSrc="/src/assets/pdga/london_fog.webp">
            <Meta
                title="Colophon · Sean Leishman"
                description="How this site is set, built and illustrated: the typefaces, the public-domain artwork and the toolchain behind it."
                path="/colophon"
            />
            <h1 className="text-3xl font-extrabold tracking-tight text-left mb-6">Colophon<Dot /></h1>
            <p className="text-base leading-normal max-w-[68ch]">
                Notes on how this site is set, built and illustrated.
            </p>

            <Section title="Type">
                <p>
                    Body text is <strong className="font-bold">Merriweather</strong>, a serif drawn for screens, set at 16px with
                    a 1.5 line height and lines capped at about 68 characters. Headings use the same family at heavier
                    weights; dates, venues and other metadata use <strong className="font-bold">JetBrains Mono</strong>, so they read as
                    a different kind of information rather than merely smaller text. Links and section markers are the one
                    accent colour. The files are self-hosted Latin subsets — no third-party font request.
                </p>
            </Section>

            <Section title="Artwork">
                <p>
                    Every image is public domain, from the <ExternalLink href={ARCHIVE} className={metaLink}>Public Domain Image Archive ↗</ExternalLink>.
                    These are the ones I can credit precisely:
                </p>
                <ul className="space-y-1">
                    {Object.values(credits).map((credit) => (
                        <li key={credit.href} className="text-base">
                            <ExternalLink href={credit.href} className="hover:text-accent transition-colors">
                                {`${credit.title} ↗`}
                            </ExternalLink>
                            <span className="text-muted-foreground">{` — ${credit.artist}, ${credit.year}`}</span>
                        </li>
                    ))}
                </ul>
                <p>
                    The older etchings came from the same archive before I kept a record of which page each one came from,
                    so they carry the general credit instead. I would rather say that than guess an attribution.
                </p>
            </Section>

            <Section title="How it is built">
                <p>
                    React and TypeScript, built with Vite and pre-rendered to static HTML, then served by Firebase Hosting.
                    Every page is real HTML before any JavaScript runs; React takes over the existing markup rather than
                    redrawing it. Styling is Tailwind.
                </p>
                <p>
                    Posts are written in <ExternalLink href="https://obsidian.md" className={metaLink}>Obsidian ↗</ExternalLink> and
                    synced here by a script: notes marked public become MDX, and a note that stops being public has its post
                    deleted on the next sync. The dates under each title come from git, not from me remembering to update them.
                </p>
                <p>
                    The source is on <ExternalLink href="https://github.com/Sean-Leishman/portfolio-2025" className={metaLink}>GitHub ↗</ExternalLink>,
                    as are the <LinkTo to="/projects" text="projects" /> it describes.
                </p>
            </Section>
        </Main>
    );
}

export default Colophon;
