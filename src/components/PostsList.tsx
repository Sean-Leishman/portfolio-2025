import { getPosts } from '../lib/content';

import LinkTo from './LinkTo';
import MoreLink from './MoreLink';

function PostsList({ isHome = false }: { isHome?: boolean }) {
    const allPosts = getPosts();
    // Home shows the newest few; the link counts only the ones left out (it used to say "6 more" under all 6).
    const posts = isHome ? allPosts.slice(0, 5) : allPosts;

    return (
        <div className="text-left">
            <ul>
                {posts.map((post) => (
                    <li key={post.link} className="my-4 first:mt-0 flex items-center gap-2">
                        <span className="text-muted-foreground italic">{post.date}</span>
                        <LinkTo to={post.link} text={post.title} customClassName="font-semibold" />
                    </li>
                ))}
            </ul>
            <MoreLink remaining={allPosts.length - posts.length} noun="post" to="/posts" />
        </div>
    );
}

export default PostsList;
