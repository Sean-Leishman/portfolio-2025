import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import LinkTo from './components/LinkTo'

import Home from './pages/Home'
import Posts from './pages/Posts'
import Projects from './pages/Projects'
import Post from './components/Post'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import type { MDXComponents } from 'mdx/types'
import { getPosts, getProjects } from './lib/content'


function App() {
    const [count, setCount] = useState(0)
    const posts = getPosts()
    const projects = getProjects()
    const items = posts.concat(projects)

    console.log('Posts:', posts)
    console.log(Post, Projects)

    const itemPaths = items.map((item) => (
        <Route
            key={item.link}
            path={item.link}
            element={
                <Post compiledMDX={item.compiledMdx as String} />
            }
        />
    ))
    console.log(itemPaths)

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/projects" element={<Projects />} />
                {itemPaths}
            </Routes>
        </Router>
    )
}

export default App
