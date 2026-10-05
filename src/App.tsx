import './App.css'

import Home from './pages/Home'
import Posts from './pages/Posts'
import Projects from './pages/Projects'
import NotFound from './pages/NotFound'
import Colophon from './pages/Colophon'
import PostRoute from './components/PostRoute'
import { Toaster } from './components/ui/sonner'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { getPosts } from './lib/content'


function App() {
    const items = getPosts()

    const itemPaths = items.map((item) => (
        <Route key={item.link} path={item.link} element={<PostRoute post={item} />} />
    ))

    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/posts" element={<Posts />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/colophon" element={<Colophon />} />
                    {itemPaths}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
            <Toaster />
        </div>
    )
}

export default App
