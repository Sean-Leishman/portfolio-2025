import { getPosts } from '../lib/content';

import Main from '../components/Main';
import TableEntry from '../components/TableEntry';

const Posts = () => {
    const posts = getPosts();

    return (
        <Main>
            <h2 className="text-2xl font-semibold">Posts</h2>
            <ul className="list-disc pl-5">
                {posts.map((post, index) => (
                    <li key={index} className="my-2 list-none">
                        <TableEntry
                            title={post.title}
                            date={post.date}
                            link={post.link}
                        />
                    </li>
                ))}
            </ul>
        </Main>
    )
}

export default Posts;
