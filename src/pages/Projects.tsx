import Main from "../components/Main";
import ProjectCard from "../components/ProjectCard";
import SimpleProjectCard from "../components/SimpleProjectCard";

import { useEffect, useState } from "react";

const projects = [
    {
        name: "CodeMe",
        description: "Search engine developed to efficiently find relevant code snippets and discussions built using the StackOverflow dataset. Employs advanced information retrieval techniques across 59 million posts",
        externalLink: "./portfolio",
        date: "2024-2025",
        image: "/src/assets/CodeMe.png",
        technologies: ["Python", "React", "PostgreSQL"],
        isFinished: true,
    },
    {
        name: "PairwiseTurnGPT",
        description: "A timing-aware lexical-only turn-taking model developed and evaluated as part of my undergraduate dissertation and a subsequent publication at SemDial. Uses a dual-stream transformer model",
        link: "./portfolio",
        date: "2023-2025",
        image: "/src/assets/pairwise_turngpt.png",
        externalLink: "https://www.semdial.org/anthology/papers/Z/Z24/Z24-3002/",
        technologies: ["Python", "Torch"],
        isFinished: true,
    },
    {
        name: "Portfolio v2",
        description: "",
        externalLink: "",
        blogLink: "",
        date: "2025",
        image: "/src/assets/pdga/london_fog.jpg",
        technologies: ["Typescript", "React"],
        isFinished: true,
    },
    {
        name: "Portfolio v1",
        description: "My personal portfolio website.",
        link: "./portfolio",
        date: "2023",
        image: "/src/assets/Portfolio.png",
        technologies: ["Typescript", "three.js"],
        isFinished: true,
    },
    {
        name: "Turtle Chess",
        description: "",
        externalLink: "",
        blogLink: "/posts/TurtleChess: Adventures in Chess Engines/2023-06-24",
        date: "2025",
        image: "/src/assets/chess.png",
        technologies: ["Python", "PyGame"],
        isFinished: true,
    },
    {
        name: "FlapRL",
        description: "",
        externalLink: "",
        blogLink: "",
        date: "2022",
        image: "/src/assets/FlappyBirdRL.png",
        technologies: ["TypeScript", "RL"],
        isFinished: true,
    },
    {
        name: "Orchy",
        description: "Hobby Interpreter (WIP)",
        externalLink: "",
        blogLink: "",
        date: "2024-2025",
        image: "/src/assets/pdga/london_fog.jpg",
        technologies: ["TypeScript", "RL"],
        isFinished: true,
    },
    {
        name: "Pathtracer",
        description: "",
        externalLink: "",
        blogLink: "",
        date: "2022",
        image: "/src/assets/Raytracer.png",
        technologies: ["C++", "Graphics"],
        isFinished: true,
    },
    {
        name: "Film Wizard",
        description: "",
        externalLink: "",
        blogLink: "",
        date: "2022",
        image: "/src/assets/pdga/london_fog.jpg",
        technologies: ["Python", "NLP"],
        isFinished: true,
    },
    {
        name: "StockTrend",
        description: "",
        externalLink: "",
        blogLink: "/posts/StockTrend:%20 Unveiling the Power of Twitter Data/2023-06-20",
        date: "2022",
        image: "/src/assets/stocktrend.png",
        technologies: ["Python"],
        isFinished: true,
    },
    {
        name: "GyroSound",
        description: "",
        externalLink: "",
        blogLink: "/posts/GyroSound: Handheld Music Playing/2023-07-16",
        date: "2022",
        image: "/src/assets/gyro_system.png",
        technologies: ["Python"],
        isFinished: true,
    },
    {
        name: "Et Tu UV",
        description: "",
        externalLink: "",
        blogLink: "/posts/Et Tu UV: Designing Wearables/2023-07-03",
        date: "2022",
        image: "/src/assets/et-tu-uv.png",
        technologies: ["Python"],
        isFinished: true,
    },
    {
        name: "Path Finding Algorithm Visualiser",
        description: "",
        externalLink: "",
        blogLink: "",
        date: "2022",
        image: "/src/assets/pf.png",
        technologies: ["Python"],
        isFinished: true,
    },
    {
        name: "Sort Algorithm Visualiser",
        description: "",
        externalLink: "",
        blogLink: "",
        date: "2022",
        image: "/src/assets/sort-algorithm-2.png",
        technologies: ["Python"],
        isFinished: true,
    }
]

function Projects() {
    const [simpleMode, setSimpleMode] = useState(false);

    let projectComponents = projects.map((project, index) => {
        return <ProjectCard
            key={index}
            name={project.name}
            description={project.description}
            externalLink={project.externalLink}
            blogLink={project.blogLink}
            date={project.date}
            image={project.image}
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
                image={project.image}
                technologies={project.technologies}
            />
        });
    }

    return (
        <Main imageSrc="/src/assets/pdga/pointing.jpg">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Projects</h1>
                <button className="mt-4 mb-2 px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200" onClick={() => setSimpleMode(!simpleMode)}>Switch to {simpleMode ? "Detailed" : "Simple"} View</button>
            </div>
            {projectComponents}
        </Main>
    );
}

export default Projects;
