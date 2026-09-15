import { EntryDescription, EntryHeader, EntryList, EntryRow, ExternalLink, metaLink, titleLink } from './Entry';

// ponytail: hardcoded like ExperienceList; move to src/lib if it grows past a handful
const papers = [
    {
        title: "Analysing the role of lexical and temporal information in turn-taking through predictability",
        authors: ["Sean Leishman", "Sarenne Wallbridge", "Peter Bell"],
        venue: "EACL 2026",
        link: "https://aclanthology.org/2026.eacl-long.283/",
        pdf: "https://aclanthology.org/2026.eacl-long.283.pdf",
    },
    {
        title: "PairwiseTurnGPT: a multi-stream turn prediction model for spoken dialogue",
        authors: ["Sean Leishman", "Peter Bell", "Sarenne Wallbridge"],
        venue: "SemDial 2024",
        link: "https://www.semdial.org/anthology/papers/Z/Z24/Z24-3002/",
        pdf: "http://semdial.org/anthology/Z24-Leishman_semdial_0002.pdf",
    },
];

function Papers() {
    return (
        <EntryList>
            {papers.map((paper) => (
                <EntryRow key={paper.link}>
                    <EntryHeader
                        title={<ExternalLink href={paper.link} className={titleLink}>{paper.title}</ExternalLink>}
                        meta={<><span>{paper.venue}</span><ExternalLink href={paper.pdf} className={metaLink}>PDF ↗</ExternalLink></>}
                    />
                    <EntryDescription>
                        {paper.authors.map((author, i) => (
                            <span key={author}>
                                {i > 0 && ', '}
                                {author === 'Sean Leishman' ? <span className="font-extrabold text-foreground">{author}</span> : author}
                            </span>
                        ))}
                    </EntryDescription>
                </EntryRow>
            ))}
        </EntryList>
    );
}

export default Papers;
