import LinkTo from './LinkTo';
import Figure from './Figure';
import ImageCredit from './ImageCredit';
import { Tags } from './Entry';

function PostTopBar({ backLink, title, date, updated, imageSrc, imageAlt, summary, tags, hideSummary }: { backLink?: string; title: string | undefined; date: string | undefined; updated?: string; imageSrc?: string; imageAlt?: string; summary?: string, tags?: string[], hideSummary?: boolean }) {
    let linkto = <LinkTo to={backLink} underline={false} customClassName="btn btn-ghost text-accent font-extrabold mb-8 text-xl" text="❮❮" />;
    if (!backLink) {
        linkto = <></>;
    }

    let summaryText = <p className="text-base italic text-muted-foreground max-w-[68ch]">{summary}</p>;
    if (hideSummary || !summary) {
        summaryText = <></>;
    }

    return (
        <header className="flex flex-col items-start justify-start mb-12">
            {linkto}
            <Figure className="max-h-64 w-auto ml-0 mb-2" src={imageSrc} alt={imageAlt} />
            <ImageCredit src={imageSrc} className="mb-8" />
            <p className="mono text-xs text-muted-foreground mb-3">{updated && updated !== date ? `${date} · updated ${updated}` : date}</p>
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight mb-4">{title}</h1>
            {summaryText}
            <Tags items={tags} />
        </header>

    )
}

export default PostTopBar;
