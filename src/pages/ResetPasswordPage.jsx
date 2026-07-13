import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { AccountPageHeader, AccountSidebar } from '@/components/AccountSidebar'
import { Input } from '@/components/ui/input'
import { isLoggedIn, logout } from '@/lib/auth'
import { useAuthUser } from '@/hooks/useAuthUser'
import { updateMemberPassword } from '@/lib/members'
import { cn } from '@/lib/utils'

function ResetPasswordPage() {
  const user = useAuthUser()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  if (!isLoggedIn() || !user) {
    return <Navigate to="/login" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}

    if (!formData.currentPassword) {
      nextErrors.currentPassword = 'Current password is required'
    }

    if (formData.newPassword.length < 6) {
      nextErrors.newPassword = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your new password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setShowConfirmModal(true)
  }

  const handleConfirmReset = () => {
    const result = updateMemberPassword(
      user.email,
      formData.currentPassword,
      formData.newPassword
    )

    if (!result.ok) {
      setShowConfirmModal(false)
      setErrors({ currentPassword: 'Current password is incorrect' })
      return
    }

    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setErrors({})
    setShowConfirmModal(false)
    toast.success('Password reset', {
      description: 'Your password has been successfully updated',
    })
    logout()
    navigate('/login')
  }

  const inputClass = (hasError) =>
    cn(
      'h-auto rounded-xl bg-white px-4 py-3 text-sm shadow-none placeholder:text-stone-400',
      hasError
        ? 'border-red-500 text-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20'
        : 'border-stone-300 text-stone-900'
    )

  return (
    <>
      <main className="flex-1 bg-neutral-100 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <AccountPageHeader title="Reset password" />

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <AccountSidebar activePage="reset-password" />

          <section className="min-w-0 flex-1">
            <div className="rounded-3xl bg-neutral-200/80 px-6 py-8 sm:px-10 sm:py-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="mb-2 block text-sm text-stone-500"
                  >
                    Current password
                  </label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="Current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    aria-invalid={errors.currentPassword ? true : undefined}
                    className={inputClass(Boolean(errors.currentPassword))}
                  />
                  {errors.currentPassword && (
                    <p className="mt-2 text-sm text-red-500">{errors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-2 block text-sm text-stone-500"
                  >
                    New password
                  </label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="New password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    aria-invalid={errors.newPassword ? true : undefined}
                    className={inputClass(Boolean(errors.newPassword))}
                  />
                  {errors.newPassword && (
                    <p className="mt-2 text-sm text-red-500">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm text-stone-500"
                  >
                    Confirm new password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    aria-invalid={errors.confirmPassword ? true : undefined}
                    className={inputClass(Boolean(errors.confirmPassword))}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-fit cursor-pointer rounded-full bg-stone-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
                >
                  Reset password
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
      </main>

      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setShowConfirmModal(false)}
          role="presentation"
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white px-8 py-10 text-center shadow-lg"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-password-modal-title"
          >
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 cursor-pointer rounded-full p-1 text-stone-900 transition-colors hover:bg-stone-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <h2
              id="reset-password-modal-title"
              className="mb-4 text-2xl font-bold text-stone-900"
            >
              Reset password
            </h2>

            <p className="mb-8 text-sm text-stone-500">
              Do you want to reset your password?
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="cursor-pointer rounded-full border border-stone-900 bg-white px-8 py-3 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="cursor-pointer rounded-full bg-stone-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ResetPasswordPage
