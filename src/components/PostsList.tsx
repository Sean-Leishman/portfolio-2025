import { getPosts } from '../lib/content';

import TableEntry from './TableEntry';
import LinkTo from './LinkTo';

function PostsList({ isHome = false }: { isHome?: boolean }) {
    const posts = getPosts();

    const postsCount = posts.length;
    const postsLink = isHome ? <span>{postsCount} more posts can be found in <LinkTo text="all posts" to="./posts" /></span> : null;

    return (
        <div className="">
            <ul className="list-disc">
                {posts.map((post, index) => (
                    <li key={index} className="my-4 list-none">
                        <TableEntry
                            title={post.title}
                            date={post.date}
                            link={post.link}
                        />
                    </li>
                ))}
            </ul>
            {postsLink}
        </div>
    );
}

export default PostsList;
