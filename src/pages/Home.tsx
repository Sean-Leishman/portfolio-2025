import LinkTo from '../components/LinkTo'
import Main from '../components/Main'

function Home() {
    return (
        <Main>
            <h1 className="text-3xl w-full">Sean Leishman</h1>
            <p className="text-muted-foreground">
                An undergraduate computer science student at the
                University of Edinburgh. Interested in machine learning, software engineering and web
                design.
            </p>

            <h1 className="text-2xl mt-8 font-bold">Projects</h1>
            <h1 className="text-2xl mt-8 font-bold">Experience</h1>
            <h1 className="text-2xl mt-8 font-bold">Posts</h1>
            See all <LinkTo text="posts" link="./posts" />
        </Main>
    )
}

export default Home;
