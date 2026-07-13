import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { NavBar, Footer } from './components/MainPage'
import HomePage from './pages/HomePage'
import ViewPostPage from './pages/ViewPostPage'
import NotFoundPage from './pages/NotFoundPage'
import SignUpPage from './pages/SignUpPage'
import ProfilePage from './pages/ProfilePage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import LoginPage from './pages/LoginPage'

function App() {
  const location = useLocation()
  const hideFooter = ['/signup', '/login', '/profile', '/reset-password'].includes(
    location.pathname
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans antialiased">
      <NavBar />
      <div className="flex flex-1 flex-col">
        <Routes key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:postId" element={<ViewPostPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  )
}

export default App
