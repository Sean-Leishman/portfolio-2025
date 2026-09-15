import { FaGithub } from "react-icons/fa6";

import LinkTo from './LinkTo';
import Figure from './Figure';
import { EntryDescription, EntryHeader, EntryRow, ExternalLink, Tags, metaLink, titleLink } from './Entry';

function ProjectCard({ name, date, description, blogLink, externalLink, githubLink, image, technologies }: { name: string, date: string, description: string, blogLink: string | undefined, externalLink: string | undefined, githubLink: string, image?: string, technologies: string[] }) {
    const title = externalLink ? <ExternalLink href={externalLink} className={titleLink}>{name} ↗</ExternalLink> : name;

    const meta = (
        <>
            <span>{date}</span>
            {blogLink && <LinkTo to={blogLink} text="Read more" underline={false} customClassName={metaLink} />}
            {githubLink && <ExternalLink href={githubLink} className={titleLink} label={`${name} on GitHub`}><FaGithub className="w-4 h-4" /></ExternalLink>}
        </>
    );

    return (
        <EntryRow>
            <EntryHeader title={title} meta={meta} />
            <EntryDescription>{description}</EntryDescription>
            {image && <div className="mt-4"><Figure src={image} alt={`${name} screenshot`} className="w-full h-64 object-cover rounded-md" /></div>}
            <Tags items={technologies} />
        </EntryRow>
    );
}

export default ProjectCard;
