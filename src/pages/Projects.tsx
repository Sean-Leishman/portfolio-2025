import Main from "../components/Main";
import ProjectCard from "../components/ProjectCard";
import SimpleProjectCard from "../components/SimpleProjectCard";
import Dot from "../components/Dot";
import getProjects from "../lib/projects";


import { useState } from "react";

const projects = getProjects();

function Projects() {
    const [simpleMode, _] = useState(false);

    let projectComponents = projects.map((project, index) => {
        return <ProjectCard
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
    });

    if (simpleMode) {
        projectComponents = projects.map((project, index) => {
            return <SimpleProjectCard
                key={index}
                name={project.name}
                description={project.description}
                externalLink={project.externalLink}
                blogLink={project.blogLink}
                date={project.date}
                githubLink={project.githubLink}
                technologies={project.technologies}
            />
        });
    }

    /*
        *                 <button className="mb-2 px-4 py-2 text-white border border-border rounded-lg bg-accent" onClick={() => setSimpleMode(!simpleMode)}>Switch to {simpleMode ? "Detailed" : "Simple"} View</button>
        */

    return (
        <Main imageSrc="/src/assets/pdga/pointing.webp">
            <div className="flex justify-between align-center">
                <h1 className="text-3xl font-extrabold">Projects<Dot /></h1>
            </div>
            {projectComponents}
        </Main>
    );
}

export default Projects;
