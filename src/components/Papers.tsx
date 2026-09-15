// ponytail: hardcoded like ExperienceList; move to src/lib if it grows past a handful
const papers = [
    {
        title: "Analysing the role of lexical and temporal information in turn-taking through predictability",
        authors: ["Sean Leishman", "Sarenne Wallbridge", "Peter Bell"],
        venue: "EACL 2026 · Long Papers",
        link: "https://aclanthology.org/2026.eacl-long.283/",
        pdf: "https://aclanthology.org/2026.eacl-long.283.pdf",
    },
    {
        title: "PairwiseTurnGPT: a multi-stream turn prediction model for spoken dialogue",
        authors: ["Sean Leishman", "Peter Bell", "Sarenne Wallbridge"],
        venue: "SemDial 2024 · Full Papers",
        link: "https://www.semdial.org/anthology/papers/Z/Z24/Z24-3002/",
        pdf: "http://semdial.org/anthology/Z24-Leishman_semdial_0002.pdf",
    },
];

function Papers() {
    return (
        <ul className="text-left divide-y divide-border">
            {papers.map((paper) => (
                <li key={paper.link} className="py-6 first:pt-0">
                    <a href={paper.link} target="_blank" rel="noopener noreferrer" className="text-lg font-extrabold tracking-tight text-foreground hover:text-accent transition-colors">
                        {paper.title}
                    </a>
                    <p className="text-sm text-foreground/80 mt-1">
                        {paper.authors.map((author, i) => (
                            <span key={author}>
                                {i > 0 && ', '}
                                {author === 'Sean Leishman' ? <span className="font-extrabold text-foreground">{author}</span> : author}
                            </span>
                        ))}
                    </p>
                    <p className="mono text-xs text-muted-foreground mt-2">
                        {paper.venue} · <a href={paper.pdf} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">PDF ↗</a>
                    </p>
                </li>
            ))}
        </ul>
    );
}

export default Papers;
