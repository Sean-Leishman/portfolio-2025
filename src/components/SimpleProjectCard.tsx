import LinkTo from './LinkTo';

function SimpleProjectCard({ name, date, description, blogLink, externalLink, image, technologies }: { name: string, date: string, description: string, blogLink: string, externalLink: string, image: string, technologies: string[] }) {
    technologies = technologies || [];

    const externalLinkItem = externalLink ? <a href={externalLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">↗</a> : null;
    const blogLinkItem = blogLink ? <LinkTo to={blogLink} text="See More." className="text-blue-600 hover:underline" /> : null;

    return (
        <div className="flex flex-col gap-4 p-4 border-gray-200 text-sm justify-start">
            <div className="flex flex-col">
                <div className="flex justify-between items-center gap-4">
                    <div className="flex justify-start items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{name}
                            <span className="text-gray-500 text-base">  •  {date}</span></h3>

                        <h3 className="text-lg">{externalLinkItem}</h3>
                    </div>
                    {blogLinkItem}
                </div>
                <p className="text-gray-700">{description}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
                {technologies.map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs">{tech}</span>
                ))}
            </div>
        </div>
    );
}

export default SimpleProjectCard;
