import type { ReactNode } from 'react'
import LinkTo from '../components/LinkTo'
import Main from '../components/Main'
import PostsList from '../components/PostsList'
import ProjectCard from '../components/ProjectCard'
import MoreLink from '../components/MoreLink'
import { EntryList } from '../components/Entry'
import Dot from '../components/Dot'
import ExperienceList from '../components/ExperienceList'
import EmailLink from '../components/EmailLink'
import Papers from '../components/Papers'

import getProjects from '../lib/projects'

const projects = getProjects();
const subsetProjects = projects.slice(0, 3);


// One shape for every home section: heading, fixed gap, a single rule, content. Lists draw their
// own dividers only between rows, so no rule ever sits against a heading or doubles up.
function Section({ title, children }: { title: string, children: ReactNode }) {
    return (
        <section className="mt-16">
            <h1 className="text-2xl font-extrabold text-center mb-6">{title}<Dot /></h1>
            <div className="border-t border-border pt-6">{children}</div>
        </section>
    )
}

function Home() {
    return (
        <Main imageSrc="/src/assets/pdga/daily_life_russian.webp">
            <div className="text-base block mx-8">
                <span className="mb-2 clear-none">
                    <img src="/src/assets/pdga/dr-w.webp" alt="W" className="w-24 h-auto mr-2 clear-none float-left" />
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

            <Section title="PROJECTS">
            <EntryList>
                {subsetProjects.map((project, index) => (
                    <ProjectCard
                        key={index}
                        name={project.name}
                        description={project.description}
                        externalLink={project.externalLink}
                        blogLink={project.blogLink}
                        date={project.date}
                        githubLink={project.githubLink}
                        technologies={project.technologies}
                    />
                ))}
            </EntryList>
            <MoreLink remaining={projects.length - subsetProjects.length} noun="project" to="/projects" centered />
            </Section>
            <Section title="EXPERIENCE"><ExperienceList /></Section>
            <Section title="PAPERS"><Papers /></Section>
            <Section title="POSTS"><PostsList isHome={true} /></Section>
        </Main >
    )
}

export default Home;
