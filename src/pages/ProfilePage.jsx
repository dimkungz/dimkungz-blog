import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AccountPageHeader, AccountSidebar } from '@/components/AccountSidebar'
import { Input } from '@/components/ui/input'
import { DEFAULT_AVATAR, isLoggedIn, updateCurrentUser } from '@/lib/auth'
import { useAuthUser } from '@/hooks/useAuthUser'
import {
  getMemberByEmail,
  isUsernameTakenByOther,
  updateMemberProfile,
} from '@/lib/members'
import { cn } from '@/lib/utils'

function ProfilePage() {
  const user = useAuthUser()
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
  })
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!user) return

    const member = getMemberByEmail(user.email)
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
    })
    setAvatar(user.avatar || member?.avatar || DEFAULT_AVATAR)
  }, [user?.email, user?.name, user?.username, user?.avatar])

  if (!isLoggedIn() || !user) {
    return <Navigate to="/login" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result)
      }
    }
    reader.readAsDataURL(file)
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

    if (
      !nextErrors.username &&
      isUsernameTakenByOther(formData.username, user.email)
    ) {
      nextErrors.username = 'Username is already taken, Please try another username'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    updateMemberProfile(user.email, {
      name: formData.name,
      username: formData.username,
      avatar,
    })

    updateCurrentUser({
      name: formData.name.trim(),
      username: formData.username.trim(),
      avatar,
    })

    setErrors({})
    toast.success('Saved profile', {
      description: 'Your profile has been successfully updated',
    })
  }

  const inputClass = (hasError) =>
    cn(
      'h-auto rounded-xl bg-white px-4 py-3 text-sm shadow-none placeholder:text-stone-400',
      hasError
        ? 'border-red-500 text-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20'
        : 'border-stone-300 text-stone-900'
    )

  return (
    <main className="flex-1 bg-neutral-100 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <AccountPageHeader title="Profile" />

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <AccountSidebar activePage="profile" />

          <section className="min-w-0 flex-1">
          <div className="rounded-3xl bg-neutral-200/80 px-6 py-8 sm:px-10 sm:py-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src={avatar}
                  alt={user.name}
                  className="h-24 w-24 shrink-0 rounded-full object-cover"
                />
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer rounded-full border border-stone-900 bg-white px-5 py-2.5 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-50"
                  >
                    Upload profile picture
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="mb-2 block text-sm text-stone-500">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
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
                  value={formData.email}
                  disabled
                  className="h-auto cursor-not-allowed rounded-xl border-stone-200 bg-white px-4 py-3 text-sm text-stone-400 shadow-none"
                />
              </div>

              <button
                type="submit"
                className="w-fit cursor-pointer rounded-full bg-stone-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
              >
                Save
              </button>
            </form>
          </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage
