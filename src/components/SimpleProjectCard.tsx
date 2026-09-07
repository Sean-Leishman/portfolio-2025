import LinkTo from './LinkTo';

function SimpleProjectCard({ name, date, description, blogLink, externalLink, technologies, githubLink }: { name: string, date: string, description: string, blogLink: string | undefined, externalLink: string | undefined, technologies: string[], githubLink: string }) {
    technologies = technologies || [];

    const externalLinkItem = externalLink ? <a href={externalLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">↗</a> : null;
    const blogLinkItem = blogLink ? <LinkTo to={blogLink} text="See More." customClassName="text-accent hover:underline" /> : null;
    const githubLinkItem = githubLink ? <a href={githubLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">GitHub ↗</a> : null;

    return (
        <div className="flex flex-col gap-4 p-4 border-border text-sm justify-start">
            <div className="flex flex-col">
                <div className="flex justify-between items-center gap-4">
                    <div className="flex justify-start items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">{name}
                            <span className="text-muted-foreground text-base">  •  {date}</span></h3>

                        <h3 className="text-lg">{externalLinkItem}</h3>
                    </div>
                    {blogLinkItem}
                </div>
                <p className="text-foreground/80">{description}</p>
                {githubLinkItem}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
                {technologies.map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-muted text-foreground rounded-full text-xs">{tech}</span>
                ))}
            </div>
        </div>
    );
}

export default SimpleProjectCard;
