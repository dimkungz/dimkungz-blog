import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AccountPageHeader, AccountSidebar } from '@/components/AccountSidebar'
import { Input } from '@/components/ui/input'
import {
  DEFAULT_AVATAR,
  isLoggedIn,
  updateProfileWithApi,
  validateProfileImage,
} from '@/lib/auth'
import { useAuthUser } from '@/hooks/useAuthUser'
import { cn } from '@/lib/utils'

function ProfilePage() {
  const { user, isReady } = useAuthUser()
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
  })
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR)
  const [avatarFile, setAvatarFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!user) return

    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
    })
    setAvatar(user.avatar || DEFAULT_AVATAR)
  }, [user?.email, user?.name, user?.username, user?.avatar])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  if (!isReady) {
    return (
      <main className="flex flex-1 items-center justify-center bg-neutral-100 px-6 py-12">
        <p className="text-stone-500">Loading profile...</p>
      </main>
    )
  }

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

    try {
      validateProfileImage(file)
    } catch (error) {
      toast.error('Invalid image', { description: error.message })
      event.target.value = ''
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setAvatarFile(file)
    const nextPreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(nextPreviewUrl)
    setAvatar(nextPreviewUrl)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {}

    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required'
    }

    if (!formData.username.trim()) {
      nextErrors.username = 'Username is required'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsSaving(true)

    try {
      const updatedUser = await updateProfileWithApi({
        name: formData.name.trim(),
        username: formData.username.trim(),
        profilePicFile: avatarFile,
      })

      setAvatarFile(null)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }

      setAvatar(updatedUser.avatar || DEFAULT_AVATAR)

      setErrors({})
      toast.success('Saved profile', {
        description: 'Your profile has been successfully updated',
      })
    } catch (error) {
      const message = error.message || 'Failed to update profile'
      console.error('Failed to update profile:', error)

      if (message.toLowerCase().includes('username')) {
        setErrors({ username: message })
      } else {
        toast.error('Failed to save profile', { description: message })
      }
    } finally {
      setIsSaving(false)
    }
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
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSaving}
                    className="cursor-pointer rounded-full border border-stone-900 bg-white px-5 py-2.5 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                disabled={isSaving}
                className="w-fit cursor-pointer rounded-full bg-stone-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
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
