import { getPosts } from '../lib/content';

import TableEntry from './TableEntry';

function PostsList() {
    const posts = getPosts();

    return (
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
    );
}

export default PostsList;
