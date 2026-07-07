import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { isEmailTaken, isUsernameTaken, registerMember } from '@/lib/members'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function SignUpPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}

    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required'
    }

    if (!formData.username.trim()) {
      nextErrors.username = 'Username is required'
    }

    if (!EMAIL_PATTERN.test(formData.email)) {
      nextErrors.email = 'Email must be a valid email'
    }

    if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters'
    }

    if (!nextErrors.username && isUsernameTaken(formData.username)) {
      nextErrors.username = 'Username is already taken, Please try another username'
    }

    if (!nextErrors.email && isEmailTaken(formData.email)) {
      nextErrors.email = 'Email is already in use, Please try another email'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    registerMember(formData)
    setErrors({})
    setIsSuccess(true)
  }

  const inputClass = (hasError) =>
    cn(
      'h-auto rounded-xl bg-white px-4 py-3 text-sm shadow-none placeholder:text-stone-400',
      hasError
        ? 'border-red-500 text-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20'
        : 'border-stone-300 text-stone-900'
    )

  return (
    <main className="flex flex-1 items-center justify-center bg-neutral-100 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-neutral-200/80 px-8 py-10 sm:px-10 sm:py-12">
        <div className={isSuccess ? 'hidden' : 'block'}>
          <h1 className="mb-8 text-center text-3xl font-bold text-stone-900">Sign up</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm text-stone-500">
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                aria-invalid={errors.name ? true : undefined}
                className={inputClass(Boolean(errors.name))}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="username" className="mb-2 block text-sm text-stone-500">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                aria-invalid={errors.username ? true : undefined}
                className={inputClass(Boolean(errors.username))}
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

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
                aria-invalid={errors.email ? true : undefined}
                className={inputClass(Boolean(errors.email))}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">{errors.email}</p>
              )}
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
                aria-invalid={errors.password ? true : undefined}
                className={inputClass(Boolean(errors.password))}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="mt-2 self-center cursor-pointer rounded-full bg-stone-900 px-10 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
            >
              Sign up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-stone-900 underline underline-offset-2"
            >
              Log in
            </Link>
          </p>
        </div>

        <div className={isSuccess ? 'flex flex-col items-center py-2' : 'hidden'}>
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500">
            <Check className="h-8 w-8 text-white" strokeWidth={3} aria-hidden="true" />
          </div>

          <h1 className="mb-8 text-center text-3xl font-bold text-stone-900">
            Registration success
          </h1>

          <Link
            to="/"
            className="cursor-pointer rounded-full bg-stone-900 px-10 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
          >
            Continue
          </Link>
        </div>
      </div>
    </main>
  )
}

export default SignUpPage
