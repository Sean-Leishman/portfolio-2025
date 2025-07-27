import './App.css'

import Home from './pages/Home'
import Posts from './pages/Posts'
import Projects from './pages/Projects'
import Post from './components/Post'
import { Toaster } from './components/ui/sonner'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { getPosts } from './lib/content'


function App() {
    const items = getPosts()

    const itemPaths = items.map((item) => (
        <Route
            key={item.link}
            path={item.link}
            element={
                <Post compiledMDX={item.compiledMdx as string}
                    title={item.title}
                    date={item.date}
                    imageSrc={item.imageSrc}
                    imageAlt={item.imageAlt}
                // tags={item.tags}
                //summary={item.summary}
                />
            }
        />
    ))
    console.log(itemPaths)

    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/posts" element={<Posts />} />
                    <Route path="/projects" element={<Projects />} />
                    {itemPaths}
                </Routes>
            </Router>
            <Toaster />
        </div>
    )
}

export default App
