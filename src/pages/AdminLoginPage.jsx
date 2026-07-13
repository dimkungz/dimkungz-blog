import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { logout } from '@/lib/auth'
import { adminLogin } from '@/lib/admin'
import { initializeAdminNotifications } from '@/lib/notifications'
import { useAdminLoggedIn } from '@/hooks/useAdminLoggedIn'
import { cn } from '@/lib/utils'

function AdminLoginPage() {
  const navigate = useNavigate()
  const isAdmin = useAdminLoggedIn()
  const [hasLoginError, setHasLoginError] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  if (isAdmin) {
    return <Navigate to="/admin/articles" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setHasLoginError(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const success = adminLogin(formData.email, formData.password)

    if (!success) {
      setHasLoginError(true)
      toast.error("Your password is incorrect or this email doesn't exist", {
        description: 'Please try another password or email',
      })
      return
    }

    logout()
    initializeAdminNotifications()
    navigate('/admin/articles')
  }

  const inputClass = cn(
    'h-auto rounded-xl bg-white px-4 py-3 text-sm shadow-none placeholder:text-stone-400',
    hasLoginError
      ? 'border-red-500 text-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20'
      : 'border-stone-300 text-stone-900'
  )

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-neutral-100 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-neutral-200/80 px-8 py-10 sm:px-10 sm:py-12">
        <p className="mb-2 text-center text-sm font-medium text-orange-500">Admin panel</p>
        <h1 className="mb-8 text-center text-3xl font-bold text-stone-900">Log in</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-sm text-stone-500">
              Email
            </label>
            <Input
              id="admin-email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={hasLoginError ? true : undefined}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm text-stone-500">
              Password
            </label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={hasLoginError ? true : undefined}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="mt-2 self-center cursor-pointer rounded-full bg-stone-900 px-10 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
          >
            Log in
          </button>
        </form>
      </div>
    </main>
  )
}

export default AdminLoginPage
