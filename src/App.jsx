import { Routes, Route } from 'react-router-dom'
import { NavBar, Footer } from './components/MainPage'
import HomePage from './pages/HomePage'
import ViewPostPage from './pages/ViewPostPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans antialiased">
      <NavBar />
      <div className="flex flex-1 flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:postId" element={<ViewPostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
