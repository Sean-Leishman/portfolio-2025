import LinkTo from '../components/LinkTo'
import Main from '../components/Main'
import Experience from '../components/Experience'
import PostsList from '../components/PostsList'
import ProjectCard from '../components/ProjectCard'
import Dot from '../components/Dot'

function Home() {
    return (
        <Main imageSrc="/src/assets/pdga/daily_life_russian.jpg">
            <p className="text-base m-4">
                An undergraduate computer science student at the
                University of Edinburgh. Interested in machine learning, software engineering and web
                design
            </p>
            <div className="flex justify-evenly items-center mt-4 max-w-60 mx-auto">
                <a href="https://github.com/Sean-Leishman" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-sans font-bold">GitHub ↗</a>
                <a href="https://www.linkedin.com/in/sean-leishman-755766202/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-sans font-bold">LinkedIn ↗</a>

            </div>

            <h1 className="text-2xl mt-8 font-bold text-center">PROJECTS<Dot /></h1>
            <div className="flex flex-col items-center">
                <ProjectCard name="CodeMe" description="Search engine developed to efficiently find relevant code snippets and discussions built using the StackOverflow dataset. Employs advanced information retrieval techniques across 59 million posts" externalLink="./portfolio" date="2024-2025" image="/src/assets/CodeMe.png" technologies={["Python", "React", "PostgreSQL"]} />
                <ProjectCard name="PairwiseTurnGPT" description="A timing-aware lexical-only turn-taking model developed and evaluated as part of my undergraduate dissertation and a subsequent publication at SemDial. Uses a dual-stream transformer model" link="./portfolio" date="2023-2025" image="/src/assets/pairwise_turngpt.png" externalLink="https://www.semdial.org/anthology/papers/Z/Z24/Z24-3002/" technologies={["Python", "Torch"]} />
                <ProjectCard name="Portfolio" description="My personal portfolio website." link="./portfolio" date="2025" image="/src/assets/Portfolio.png" technologies={["Typescript", "three.js"]} />
                <div className="mt-8 text-center text-muted-foreground">
                    <p>And many more projects ...</p>
                    <LinkTo className="text-center" to="/projects" text=" View all projects here" />
                </div>
            </div>
            <h1 className="text-2xl mt-16 font-bold text-center">EXPERIENCE<Dot /></h1>
            <div>
                <Experience company="University of Edinburgh" role="Undergraduate Student" date="2020 - Present" logo="/src/assets/uoe.jpg" />
                <Experience company="Squarepoint Capital" role="Software Engineer Intern" date="Summer 2024" logo="/src/assets/sqpc.png" />
                <Experience company="Coretech Security" role="Software Engineer Intern" date="Summer 2023" logo="/src/assets/coretech.png" />
                <Experience company="Singapore Management University" role="Exchange Student" date="2023-2024" logo="/src/assets/smu.png" />
            </div>
            <div className="">
                <h1 className="text-2xl mt-8 font-bold text-center">POSTS<Dot /></h1>
                <PostsList isHome={true} />
            </div>
        </Main >
    )
}

export default Home;
