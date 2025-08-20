import LinkTo from '../components/LinkTo'
import Main from '../components/Main'
import PostsList from '../components/PostsList'
import ProjectCard from '../components/ProjectCard'
import Dot from '../components/Dot'
import ExperienceList from '../components/ExperienceList'
import EmailLink from '../components/EmailLink'

import getProjects from '../lib/projects'

const projects = getProjects();
const subsetProjects = projects.slice(0, 3);


function Home() {
    return (
        <Main imageSrc="/src/assets/pdga/daily_life_russian.jpg">
            <div className="text-base font-semibold block mx-8">
                <span className="mb-2 clear-none">
                    <img src="/src/assets/pdga/dr-w.jpg" alt="W" className="w-24 h-auto mr-2 clear-none float-left" />
                    elcome to my corner of the internet. I'm <span className="text-accent italic">Sean</span>.
                    This is where I discuss my projects, share my thoughts, and document my journey.
                    I have recently graduated with a degree in Computer Science from the University of Edinburgh and will be working as a Graduate Software Engineer at Squarepoint Capital.
                    I have a passion for software engineering and natural language processing but I love to explore new technologies and ideas.
                </span>
                <span className="block mt-6">
                    Feel free to explore, look through my <LinkTo to="/projects" text="projects" customClassName='italic font-semibold' />, read my <LinkTo to="/posts" text="posts" customClassName='italic font-semibold' />, or just have a look around!
                </span>
            </div>
            <div className="flex justify-evenly items-center mt-4 mb-16 max-w-85 mx-auto">
                <a href="https://github.com/Sean-Leishman" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-sans font-bold">GitHub ↗</a>
                <a href="https://www.linkedin.com/in/sean-leishman-755766202/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-sans font-bold">LinkedIn ↗</a>
                <EmailLink />

            </div>

            <h1 className="text-2xl mt-8 font-bold text-center">PROJECTS<Dot /></h1>
            <div className="flex flex-col items-center mb-16">
                {subsetProjects.map((project, index) => (
                    <ProjectCard
                        key={index}
                        name={project.name}
                        description={project.description}
                        externalLink={project.externalLink}
                        blogLink={project.blogLink}
                        date={project.date}
                        image={project.image}
                        githubLink={project.githubLink}
                        technologies={project.technologies}
                    />
                ))}
                <div className="mt-6 text-center text-muted-foreground italic">
                    <p>And many more projects ...</p>
                    <LinkTo customClassName="text-center" to="/projects" text=" View all projects here" />
                </div>
            </div>
            <div className="mb-16">
                <h1 className="text-2xl font-bold text-center">EXPERIENCE<Dot /></h1>
                <ExperienceList />
            </div>
            <div className="">
                <h1 className="text-2xl font-bold text-center">POSTS<Dot /></h1>
                <PostsList isHome={true} />
            </div>
        </Main >
    )
}

export default Home;
