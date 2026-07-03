import { Link } from 'react-router-dom'
import { CircleAlert } from 'lucide-react'

function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <CircleAlert
        className="mb-6 h-16 w-16 text-stone-900"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h1 className="mb-8 text-2xl font-bold text-stone-900">Page Not Found</h1>
      <Link
        to="/"
        className="rounded-full bg-stone-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
      >
        Go To Homepage
      </Link>
    </div>
  )
}

export default NotFoundPage
