import { X } from 'lucide-react'

function AuthModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white px-8 py-10 text-center shadow-lg"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer rounded-full p-1 text-stone-900 transition-colors hover:bg-stone-100"
          aria-label="Close"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <h2
          id="auth-modal-title"
          className="mb-8 text-2xl font-bold text-stone-900"
        >
          Create an account to continue
        </h2>

        <button
          type="button"
          className="mb-6 w-full cursor-pointer rounded-full bg-stone-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
        >
          Create account
        </button>

        <p className="text-sm text-stone-500">
          Already have an account?{' '}
          <button
            type="button"
            className="cursor-pointer font-bold text-stone-900 underline underline-offset-2"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  )
}

export default AuthModal
