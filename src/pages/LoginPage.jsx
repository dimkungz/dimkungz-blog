import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { login } from '@/lib/auth'
import { authenticateMember } from '@/lib/members'
import { cn } from '@/lib/utils'

function LoginPage() {
  const navigate = useNavigate()
  const [hasLoginError, setHasLoginError] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setHasLoginError(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const member = authenticateMember(formData.email, formData.password)

    if (!member) {
      setHasLoginError(true)
      toast.error("Your password is incorrect or this email doesn't exist", {
        description: 'Please try another password or email',
      })
      return
    }

    login()
    navigate('/')
  }

  const inputClass = cn(
    'h-auto rounded-xl bg-white px-4 py-3 text-sm shadow-none placeholder:text-stone-400',
    hasLoginError
      ? 'border-red-500 text-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20'
      : 'border-stone-300 text-stone-900'
  )

  return (
    <main className="flex flex-1 items-center justify-center bg-neutral-100 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-neutral-200/80 px-8 py-10 sm:px-10 sm:py-12">
        <h1 className="mb-8 text-center text-3xl font-bold text-stone-900">Log in</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-stone-500">
              Email
            </label>
            <Input
              id="email"
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
            <label htmlFor="password" className="mb-2 block text-sm text-stone-500">
              Password
            </label>
            <Input
              id="password"
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

        <p className="mt-6 text-center text-sm text-stone-500">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-bold text-stone-900 underline underline-offset-2"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}

export default LoginPage
