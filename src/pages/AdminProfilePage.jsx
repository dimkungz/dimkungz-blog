import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/AdminLayout'
import { Input } from '@/components/ui/input'
import { DEFAULT_AVATAR } from '@/lib/auth'
import { getAdminProfile, updateAdminProfile } from '@/lib/admin'
import { cn } from '@/lib/utils'

const BIO_MAX_LENGTH = 120

function AdminProfilePage() {
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
  })
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const profile = getAdminProfile()
    setFormData({
      name: profile.name,
      username: profile.username,
      email: profile.email,
      bio: profile.bio,
    })
    setAvatar(profile.avatar || DEFAULT_AVATAR)
  }, [])

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

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    updateAdminProfile({
      name: formData.name.trim(),
      username: formData.username.trim(),
      bio: formData.bio.trim(),
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
    <AdminLayout activePage="profile">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-stone-200 pb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">Profile</h1>
        <button
          type="submit"
          form="admin-profile-form"
          className="shrink-0 cursor-pointer rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 sm:px-8 sm:py-3"
        >
          Save
        </button>
      </div>

      <form
        id="admin-profile-form"
        onSubmit={handleSubmit}
        className="flex max-w-2xl flex-col gap-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img
            src={avatar}
            alt={formData.name}
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
          <label htmlFor="admin-name" className="mb-2 block text-sm text-stone-500">
            Name
          </label>
          <Input
            id="admin-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={errors.name ? true : undefined}
            className={inputClass(Boolean(errors.name))}
          />
          {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="admin-username" className="mb-2 block text-sm text-stone-500">
            Username
          </label>
          <Input
            id="admin-username"
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
          <label htmlFor="admin-email" className="mb-2 block text-sm text-stone-500">
            Email
          </label>
          <Input
            id="admin-email"
            name="email"
            type="email"
            value={formData.email}
            disabled
            className="h-auto cursor-not-allowed rounded-xl border-stone-200 bg-white px-4 py-3 text-sm text-stone-400 shadow-none"
          />
        </div>

        <div>
          <label htmlFor="admin-bio" className="mb-2 block text-sm text-stone-500">
            Bio (max 120 letters)
          </label>
          <textarea
            id="admin-bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            maxLength={BIO_MAX_LENGTH}
            rows={4}
            className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-none outline-none placeholder:text-stone-400 focus-visible:border-stone-400 focus-visible:ring-2 focus-visible:ring-stone-200"
          />
        </div>
      </form>
    </AdminLayout>
  )
}

export default AdminProfilePage
