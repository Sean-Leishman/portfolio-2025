import Main from "../components/Main";
import ProjectCard from "../components/ProjectCard";
import Dot from "../components/Dot";
import { EntryList } from "../components/Entry";
import Meta from "../components/Meta";
import getProjects from "../lib/projects";

const projects = getProjects();

function Projects() {
    return (
        <Main imageSrc="/src/assets/pdga/pointing.webp">
            <Meta title="Projects · Sean Leishman" description="Everything I have built: a general-relativistic ray tracer, chess engines in Rust and Zig, a code search engine, and more." path="/projects" />
            <h1 className="text-3xl font-extrabold tracking-tight text-left mb-6">Projects<Dot /></h1>
            <EntryList>
                {projects.map((project) => (
                    <ProjectCard
                        key={project.name}
                        name={project.name}
                        description={project.description}
                        externalLink={project.externalLink}
                        blogLink={project.blogLink}
                        date={project.date}
                        image={project.image}
                        githubLink={project.githubLink}
                        technologies={project.technologies}
                        isFinished={project.isFinished}
                        headingAs="h2"
                    />
                ))}
            </EntryList>
        </Main>
    );
}

export default Projects;
