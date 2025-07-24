function ProjectCard({ name, description, link, image }: { name: string, description: string, link: string, image: string }) {
    return (
        <div className="flex flex-col justify-between gap-4 p-4 border-b border-gray-200 text-sm">
            <div className="flex justify-start items-center gap-4">
                <img src={image} alt={`${name} logo`} className="project-logo" />
                <h3>{name}</h3>
            </div>
            <div className="flex flex-col justify-end items-start gap-2 text-xs text-gray-500">
                <p className="project-description">{description}</p>
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Project</a>
            </div>
        </div>
    );
}

export default ProjectCard;
