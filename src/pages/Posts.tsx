import Main from '../components/Main';
import PostsList from '../components/PostsList';
import Dot from '../components/Dot';
import Meta from '../components/Meta';

const Posts = () => {
    return (
        <Main imageSrc="/src/assets/pdga/witch_of_york.webp">
            <Meta title="Posts · Sean Leishman" description="Writing about the projects I build: chess engines, renderers, wearables and the occasional lesson learnt." path="/posts" />
            <h1 className="text-3xl font-extrabold tracking-tight text-left mb-6">Posts<Dot /></h1>
            <PostsList />
        </Main>
    )
}

export default Posts;
