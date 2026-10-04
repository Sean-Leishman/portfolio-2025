import Main from '../components/Main';
import LinkTo from '../components/LinkTo';
import Dot from '../components/Dot';
import Meta from '../components/Meta';

// firebase.json rewrites every unmatched path to index.html, so the SPA has to answer for them.
// Without this route they rendered an empty page.
function NotFound() {
    return (
        <Main imageSrc="/src/assets/pdga/maze.webp">
            <Meta title="Not found · Sean Leishman" description="That page does not exist." path="/404" />
            <h1 className="text-3xl font-extrabold tracking-tight text-left mb-6">Not found<Dot /></h1>
            <p className="text-base leading-normal max-w-[68ch]">
                That page does not exist. Try the <LinkTo to="/posts" text="posts" /> or the <LinkTo to="/projects" text="projects" />, or go back <LinkTo to="/" text="home" />.
            </p>
        </Main>
    );
}

export default NotFound;
