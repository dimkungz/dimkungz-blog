import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { NavBar, Footer } from './components/MainPage'
import HomePage from './pages/HomePage'
import ViewPostPage from './pages/ViewPostPage'
import NotFoundPage from './pages/NotFoundPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'

function App() {
  const location = useLocation()
  const hideFooter = ['/signup', '/login'].includes(location.pathname)

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans antialiased">
      <NavBar />
      <div className="flex flex-1 flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:postId" element={<ViewPostPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  )
}

export default App
