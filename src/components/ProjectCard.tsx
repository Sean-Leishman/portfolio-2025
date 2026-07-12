import LinkTo from './LinkTo';
import Figure from './Figure';

import { FaGithub } from "react-icons/fa6";

function ProjectCard({ name, date, description, blogLink, externalLink, githubLink, image, technologies }: { name: string, date: string, description: string, blogLink: string | undefined, externalLink: string | undefined, githubLink: string, image: string, technologies: string[] }) {
    technologies = technologies || [];

    const externalLinkItem = externalLink ? <a href={externalLink} target="_blank" rel="noopener noreferrer" className="text-accent fond-extrabold hover:underline">↗</a> : null;
    const blogLinkItem = blogLink ? <LinkTo to={blogLink} text="Read More" customClassName="text-accent hover:underline" /> : <div></div>;

    const githubText = <FaGithub className="w-5 h-5" />;
    let githubIcon = githubLink ? <a href={githubLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent">{githubText}</a> : <div></div>;
    if (blogLink) {
        githubIcon = <span className="flex gap-2 mr-2">{githubIcon} | </span>;
    }
    else {
        githubIcon = <span className="flex gap-2">{githubIcon}</span>;
    }

    return (
        <div className="flex flex-col gap-4 p-4 mb-2 border-border text-sm justify-start w-full">
            <div className="flex flex-col">
                <div className="flex justify-between items-center gap-4">
                    <div className="flex justify-start items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">{name}
                            <span className="text-muted-foreground text-base">  •  {date}</span></h3>

                        <h3 className="text-lg">{externalLinkItem}</h3>
                    </div>
                    <div className="flex mr-2 pb-2 font-semibold">
                        {githubIcon}
                        {blogLinkItem}
                    </div>
                </div>
                <p className="text-foreground/80">{description}</p>
            </div>
            <div>
                <Figure src={image} alt={`${name} screenshot`} className="w-full h-64 object-cover rounded-md" />
                <div className="flex flex-wrap gap-2 justify-center content-start">
                    {technologies.map((tech, index) => (
                        <span key={index} className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">{tech}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;
