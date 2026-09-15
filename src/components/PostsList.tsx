import { getPosts } from '../lib/content';

import TableEntry from './TableEntry';
import LinkTo from './LinkTo';

function PostsList({ isHome = false }: { isHome?: boolean }) {
    const allPosts = getPosts();
    // Home shows the newest few; the link counts only the ones left out (it used to say "6 more" under all 6).
    const posts = isHome ? allPosts.slice(0, 5) : allPosts;

    const remaining = allPosts.length - posts.length;
    const postsLink = remaining > 0 ? <span>{remaining} more {remaining === 1 ? 'post' : 'posts'} in <LinkTo text="all posts" to="/posts" /></span> : null;

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
