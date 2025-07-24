import LinkTo from '../components/LinkTo'
import Main from '../components/Main'
import Experience from '../components/Experience'
import PostsList from '../components/PostsList'
import ProjectCard from '../components/ProjectCard'

function Home() {
    return (
        <Main imageSrc="/src/assets/maze.jpg">
            <p className="text-muted-foreground">
                An undergraduate computer science student at the
                University of Edinburgh. Interested in machine learning, software engineering and web
                design
            </p>

            <h1 className="text-2xl mt-8 font-bold text-center">PROJECTS</h1>
            <div>
                <ProjectCard name="Portfolio" description="My personal portfolio website." link="./portfolio" image="/images/logos/portfolio.png" />
            </div>
            <h1 className="text-2xl mt-8 font-bold text-center">EXPERIENCE</h1>
            <div>
                <Experience company="University of Edinburgh" role="Undergraduate Student" date="2020 - Present" logo="/src/assets/uoe.jpg" />
                <Experience company="Squarepoint Capital" role="Software Engineer Intern" date="Summer 2024" logo="/src/assets/sqpc.png" />
                <Experience company="Coretech Security" role="Software Engineer Intern" date="Summer 2023" logo="/src/assets/coretech.png" />
                <Experience company="Singapore Management University" role="Exchange Student" date="2023-2024" logo="/src/assets/smu.png" />
            </div>
            <h1 className="text-2xl mt-8 font-bold text-center">POSTS</h1>
            <PostsList />
            See all <LinkTo text="posts" to="./posts" />
        </Main>
    )
}

export default Home;
