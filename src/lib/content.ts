import contentData from '../generated/content.json';

export function getPosts() {
    return contentData.posts;
}

// Post pages pull in the MDX runtime, the syntax highlighter and the compiled body. None of that
// belongs in the bundle every page downloads, so it is fetched per post and kept once loaded.
export type Post = ReturnType<typeof getPosts>[number];
export type LoadedPost = { Post: typeof import('../components/Post').default, compiledMdx: string };

const loaded = new Map<string, LoadedPost>();
const pending = new Map<string, Promise<LoadedPost>>();

const slugOf = (link: string) => link.split('/').pop()!;

export function getLoadedPost(link: string) {
    return loaded.get(link);
}

export function loadPost(link: string): Promise<LoadedPost> {
    if (!pending.has(link)) {
        pending.set(link, Promise.all([
            import('../components/Post'),
            import(`../generated/posts/${slugOf(link)}.json`),
        ]).then(([module, body]) => {
            const result = { Post: module.default, compiledMdx: body.compiledMdx };
            loaded.set(link, result);
            return result;
        }));
    }
    return pending.get(link)!;
}
