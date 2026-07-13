import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/AdminLayout'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getAdminProfile } from '@/lib/admin'
import { cn } from '@/lib/utils'

const CATEGORY_OPTIONS = ['Cat', 'General', 'Inspiration']
const INTRO_MAX_LENGTH = 120

function AdminCreateArticlePage() {
  const navigate = useNavigate()
  const thumbnailInputRef = useRef(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [formData, setFormData] = useState({
    category: '',
    authorName: '',
    title: '',
    introduction: '',
    content: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const profile = getAdminProfile()
    setFormData((current) => ({
      ...current,
      authorName: profile.name,
    }))
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setThumbnail(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.category) {
      nextErrors.category = 'Category is required'
    }

    if (!formData.title.trim()) {
      nextErrors.title = 'Title is required'
    }

    if (!formData.introduction.trim()) {
      nextErrors.introduction = 'Introduction is required'
    }

    if (!formData.content.trim()) {
      nextErrors.content = 'Content is required'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSave = (status) => (event) => {
    event.preventDefault()
    if (!validateForm()) return

    const message =
      status === 'draft'
        ? 'You can publish article later'
        : 'Your article has been successfully published'

    toast.success(status === 'draft' ? 'Create article and saved as draft' : 'Create article and published', {
      description: message,
    })
    navigate('/admin/articles')
  }

  const inputClass = (hasError) =>
    cn(
      'h-auto rounded-xl bg-white px-4 py-3 text-sm shadow-none placeholder:text-stone-400',
      hasError
        ? 'border-red-500 text-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20'
        : 'border-stone-300 text-stone-900'
    )

  const selectTriggerClass = cn(
    'h-auto w-full cursor-pointer rounded-xl border-stone-300 bg-white py-3 pr-3 pl-4 text-sm shadow-none',
    errors.category
      ? 'border-red-500 text-red-500'
      : 'text-stone-900 data-placeholder:text-stone-400'
  )

  return (
    <AdminLayout activePage="articles">
      <div className="mb-6 flex flex-col gap-4 border-b border-stone-200 pb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">Create article</h1>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            form="admin-create-article-form"
            onClick={handleSave('draft')}
            className="cursor-pointer rounded-full border border-stone-900 bg-white px-5 py-2.5 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-50 sm:px-6 sm:py-3"
          >
            Save as draft
          </button>
          <button
            type="submit"
            form="admin-create-article-form"
            onClick={handleSave('published')}
            className="cursor-pointer rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 sm:px-6 sm:py-3"
          >
            Save and publish
          </button>
        </div>
      </div>

      <form
        id="admin-create-article-form"
        onSubmit={(event) => event.preventDefault()}
        className="flex max-w-3xl flex-col gap-6"
      >
        <div>
          <p className="mb-2 block text-sm text-stone-500">Thumbnail image</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-40 w-full max-w-xs items-center justify-center overflow-hidden rounded-2xl bg-neutral-200 sm:h-36 sm:w-56">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="Article thumbnail preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="h-10 w-10 text-stone-400" aria-hidden="true" />
              )}
            </div>

            <div>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailChange}
              />
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="cursor-pointer rounded-full border border-stone-900 bg-white px-5 py-2.5 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-50"
              >
                Upload thumbnail image
              </button>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="category" className="mb-2 block text-sm text-stone-500">
            Category
          </label>
          <Select
            value={formData.category}
            onValueChange={(value) => {
              setFormData((current) => ({ ...current, category: value }))
              setErrors((current) => ({ ...current, category: undefined }))
            }}
          >
            <SelectTrigger id="category" className={selectTriggerClass}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="mt-2 text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="authorName" className="mb-2 block text-sm text-stone-500">
            Author name
          </label>
          <Input
            id="authorName"
            name="authorName"
            type="text"
            placeholder="Thompson P."
            value={formData.authorName}
            disabled
            className="h-auto cursor-not-allowed rounded-xl border-stone-200 bg-white px-4 py-3 text-sm text-stone-400 shadow-none"
          />
        </div>

        <div>
          <label htmlFor="title" className="mb-2 block text-sm text-stone-500">
            Title
          </label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="Article title"
            value={formData.title}
            onChange={handleChange}
            aria-invalid={errors.title ? true : undefined}
            className={inputClass(Boolean(errors.title))}
          />
          {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="introduction" className="mb-2 block text-sm text-stone-500">
            Introduction (max 120 letters)
          </label>
          <textarea
            id="introduction"
            name="introduction"
            value={formData.introduction}
            onChange={handleChange}
            maxLength={INTRO_MAX_LENGTH}
            placeholder="Introduction"
            rows={4}
            aria-invalid={errors.introduction ? true : undefined}
            className={cn(
              'w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm shadow-none outline-none placeholder:text-stone-400 focus-visible:ring-2',
              errors.introduction
                ? 'border-red-500 text-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20'
                : 'border-stone-300 text-stone-900 focus-visible:border-stone-400 focus-visible:ring-stone-200'
            )}
          />
          {errors.introduction && (
            <p className="mt-2 text-sm text-red-500">{errors.introduction}</p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="mb-2 block text-sm text-stone-500">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Content"
            rows={12}
            aria-invalid={errors.content ? true : undefined}
            className={cn(
              'w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm shadow-none outline-none placeholder:text-stone-400 focus-visible:ring-2',
              errors.content
                ? 'border-red-500 text-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20'
                : 'border-stone-300 text-stone-900 focus-visible:border-stone-400 focus-visible:ring-stone-200'
            )}
          />
          {errors.content && (
            <p className="mt-2 text-sm text-red-500">{errors.content}</p>
          )}
        </div>
      </form>
    </AdminLayout>
  )
}

export default AdminCreateArticlePage
