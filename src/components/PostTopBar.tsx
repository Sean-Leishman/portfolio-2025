import LinkTo from './LinkTo';
import Figure from './Figure';

function PostTopBar({ backLink, title, date, imageSrc, imageAlt, summary, hideSummary }: { backLink?: string; title: string | undefined; date: string | undefined; imageSrc?: string; imageAlt?: string; summary?: string, hideSummary?: boolean }) {
    let linkto = <LinkTo to={backLink} underline={false} customClassName="btn btn-ghost text-accent font-extrabold mb-8 text-xl" text="❮❮" />;
    if (!backLink) {
        linkto = <></>;
    }

    let summaryText = <span className="text-muted-foreground italic">{summary}</span>;
    if (hideSummary || !summary) {
        summaryText = <></>;
    }

    return (
        <div className="flex flex-col items-start justify-start">
            {linkto}
            <Figure className="max-w-64 h-auto ml-0" src={imageSrc} alt={imageAlt} />
            <p className="mono text-xs text-muted-foreground mt-2">{date}</p>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">{title}</h1>
            {summaryText}
        </div>

    )
}

export default PostTopBar;
