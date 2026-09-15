import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import { getPosts, loadPost } from './lib/content'

const root = document.getElementById('root')!
const app = <StrictMode><App /></StrictMode>

// react-snap's HTML is already on screen: hydrate it in place. createRoot threw it away and
// painted identical new nodes after the JS ran, which is what Lighthouse measured as LCP.
const render = () => root.hasChildNodes() ? hydrateRoot(root, app) : createRoot(root).render(app)

// On a post URL, fetch its chunk before hydrating: otherwise the first render has no article
// and React would replace the pre-rendered one with an empty page until the chunk arrived.
const path = location.pathname.replace(/\/$/, '')
const current = getPosts().find((post) => post.link === path)
const ready = current ? loadPost(current.link).catch(() => undefined) : Promise.resolve()

ready.then(render).then(() => {
    // Then warm every other post while idle so clicking one is instant.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1500))
    idle(() => getPosts().forEach((post) => loadPost(post.link)))
})
