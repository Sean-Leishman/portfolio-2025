import { getPosts } from '../lib/content';

import LinkTo from './LinkTo';
import MoreLink from './MoreLink';
import { EntryHeader, EntryList, EntryRow, titleLink } from './Entry';

function PostsList({ isHome = false }: { isHome?: boolean }) {
    const allPosts = getPosts();
    // Home shows the newest few; the link counts only the ones left out (it used to say "6 more" under all 6).
    const posts = isHome ? allPosts.slice(0, 5) : allPosts;

    return (
        <div>
            <EntryList>
                {posts.map((post) => (
                    <EntryRow key={post.link}>
                        <EntryHeader
                            title={<LinkTo to={post.link} text={post.title} underline={false} customClassName={titleLink} />}
                            meta={<span>{post.date}</span>}
                        />
                    </EntryRow>
                ))}
            </EntryList>
            <MoreLink remaining={allPosts.length - posts.length} noun="post" to="/posts" />
        </div>
    );
}

export default PostsList;
