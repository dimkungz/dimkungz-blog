import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
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
import AdminLoginPage from './pages/AdminLoginPage'
import AdminArticlesPage from './pages/AdminArticlesPage'
import AdminCategoriesPage from './pages/AdminCategoriesPage'
import AdminNotificationsPage from './pages/AdminNotificationsPage'
import AdminProfilePage from './pages/AdminProfilePage'
import AdminResetPasswordPage from './pages/AdminResetPasswordPage'
import AdminCreateArticlePage from './pages/AdminCreateArticlePage'
import AdminEditArticlePage from './pages/AdminEditArticlePage'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const hideFooter = [
    '/signup',
    '/login',
    '/profile',
    '/reset-password',
    '/admin/login',
    '/admin/articles',
    '/admin/categories',
    '/admin/notifications',
    '/admin/profile',
    '/admin/reset-password',
    '/admin/articles/create',
  ].includes(location.pathname) || /^\/admin\/articles\/\d+\/edit$/.test(location.pathname)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans antialiased">
      {!isAdminRoute && <NavBar />}
      <div className="flex flex-1 flex-col">
        <Routes key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:postId" element={<ViewPostPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<Navigate to="/admin/articles" replace />} />
          <Route path="/admin/articles" element={<AdminArticlesPage />} />
          <Route path="/admin/articles/create" element={<AdminCreateArticlePage />} />
          <Route path="/admin/articles/:articleId/edit" element={<AdminEditArticlePage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
          <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
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
