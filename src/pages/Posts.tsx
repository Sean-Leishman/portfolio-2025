import { getPosts } from '../lib/content';

import Main from '../components/Main';
import PostsList from '../components/PostsList';
import TopBar from '../components/TopBar';

const Posts = () => {
    return (
        <Main imageSrc="/src/assets/pdga/witch_of_york.jpg">
            <h1 className="text-3xl font-bold">Posts</h1>
            <PostsList />
        </Main>
    )
}

export default Posts;
