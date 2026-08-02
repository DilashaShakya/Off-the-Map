import './App.css'
import { Route, Routes } from 'react-router-dom'

import CreatePostPage from './pages/CreatePostPage'
import PostDetails from './pages/PostDetails'
import HomePage from './pages/HomePage'
import EditPostPage from './pages/EditPostPage'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'

function App() {
  return (
    <>
      <Preloader />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/posts/:id/edit" element={<EditPostPage />} />
      </Routes>
    </>
  )
}

export default App
