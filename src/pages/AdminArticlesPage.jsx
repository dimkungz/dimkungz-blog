import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { DeleteArticleModal } from '@/components/DeleteArticleModal'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AdminLayout } from '@/components/AdminLayout'
import { fetchPosts } from '@/lib/posts'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS = ['All status', 'Published', 'Draft']
const CATEGORY_OPTIONS = ['All category', 'Cat', 'General', 'Inspiration']

function filterBySearch(posts, query) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return posts
  return posts.filter((post) => post.title.toLowerCase().includes(normalized))
}

function filterByCategory(posts, category) {
  if (category === 'All category') return posts
  return posts.filter((post) => post.category === category)
}

function filterByStatus(posts, status) {
  if (status === 'All status') return posts
  if (status === 'Published') return posts
  return []
}

function AdminArticlesPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All status')
  const [categoryFilter, setCategoryFilter] = useState('All category')
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadPosts = async () => {
      try {
        const data = await fetchPosts()
        if (isMounted) setPosts(data)
      } catch (error) {
        console.error('Failed to fetch posts:', error)
        if (isMounted) setPosts([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadPosts()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredPosts = useMemo(() => {
    return filterByStatus(
      filterByCategory(filterBySearch(posts, searchQuery), categoryFilter),
      statusFilter
    )
  }, [posts, searchQuery, categoryFilter, statusFilter])

  const selectTriggerClass =
    'h-auto w-full min-w-[8.5rem] cursor-pointer rounded-xl border-stone-200 bg-white py-2.5 pr-3 pl-4 text-sm text-stone-500 shadow-none'

  const handleConfirmDelete = () => {
    setDeleteTarget(null)
    toast.success('Article deleted', {
      description: 'The article has been removed',
    })
  }

  return (
    <AdminLayout activePage="articles">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
          Article management
        </h1>
        <button
          type="button"
          onClick={() => navigate('/admin/articles/create')}
          className="flex w-fit cursor-pointer items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
        >
          <Plus className="h-4 w-4" />
          Create article
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-auto rounded-xl border-stone-200 bg-white py-2.5 pr-10 pl-4 text-sm text-stone-900 shadow-none placeholder:text-stone-400"
          />
          <Search
            className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-stone-400"
            aria-hidden="true"
          />
        </div>

        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-neutral-50">
                <th className="px-4 py-3 font-medium text-stone-500 sm:px-6">
                  Article title
                </th>
                <th className="px-4 py-3 font-medium text-stone-500 sm:px-6">
                  Category
                </th>
                <th className="px-4 py-3 font-medium text-stone-500 sm:px-6">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-medium text-stone-500 sm:px-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-stone-500">
                    Loading articles...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-stone-500">
                    No articles found
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post, index) => (
                  <tr
                    key={post.id}
                    className={cn(
                      'border-b border-stone-100 last:border-b-0',
                      index % 2 === 1 && 'bg-neutral-50/60'
                    )}
                  >
                    <td className="max-w-xs truncate px-4 py-4 font-medium text-stone-900 sm:max-w-md sm:px-6">
                      {post.title}
                    </td>
                    <td className="px-4 py-4 text-stone-600 sm:px-6">{post.category}</td>
                    <td className="px-4 py-4 sm:px-6">
                      <span className="inline-flex items-center gap-1.5 text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Published
                      </span>
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/articles/${post.id}/edit`)}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                          aria-label={`Edit ${post.title}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(post)}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                          aria-label={`Delete ${post.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteArticleModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  )
}

export default AdminArticlesPage
