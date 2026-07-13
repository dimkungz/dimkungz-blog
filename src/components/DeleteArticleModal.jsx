import { X } from 'lucide-react'

export function DeleteArticleModal({ open, onClose, onConfirm }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-neutral-200 px-8 py-10 text-center shadow-lg"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-article-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer rounded-full p-1 text-stone-900 transition-colors hover:bg-stone-100/80"
          aria-label="Close"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <h2 id="delete-article-modal-title" className="mb-4 text-2xl font-bold text-stone-900">
          Delete article
        </h2>

        <p className="mb-8 text-sm text-stone-500">Do you want to delete this article?</p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-stone-900 bg-white px-8 py-3 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded-full bg-stone-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
