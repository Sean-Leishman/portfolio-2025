import Main from '../components/Main';
import PostsList from '../components/PostsList';
import Dot from '../components/Dot';

const Posts = () => {
    return (
        <Main imageSrc="/src/assets/pdga/witch_of_york.jpg">
            <h1 className="text-3xl font-extrabold">Posts<Dot /></h1>
            <PostsList />
        </Main>
    )
}

export default Posts;
