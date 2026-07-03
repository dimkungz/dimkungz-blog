import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { Copy, SmilePlus } from 'lucide-react'
import AuthModal from '@/components/AuthModal'
import { isLoggedIn } from '@/lib/auth'
import { getValidPostId } from '@/lib/posts'
import NotFoundPage from '@/pages/NotFoundPage'

const API_BASE_URL = 'https://blog-post-project-api.vercel.app'
const AUTHOR_AVATAR =
  'https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg'

function formatPostDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function PostContent({ content }) {
  return (
    <div className="[&>h2:first-child]:mt-0 [&>h2]:mt-8">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-stone-900">{children}</h2>
          ),
          p: ({ children }) => (
            <p className="mt-3 text-base leading-relaxed text-stone-600">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-stone-600">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-stone-600">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-base leading-relaxed">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-stone-900">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

function PostInteraction({ post }) {
  const [likeCount, setLikeCount] = useState(post.likes)
  const [isLiked, setIsLiked] = useState(false)
  const [comment, setComment] = useState('')
  const [copyLabel, setCopyLabel] = useState('Copy')
  const [showAuthModal, setShowAuthModal] = useState(false)

  const shareUrl = encodeURIComponent(window.location.href)
  const shareTitle = encodeURIComponent(post.title)

  const requireAuth = () => {
    if (isLoggedIn()) return true
    setShowAuthModal(true)
    return false
  }

  const handleLike = () => {
    if (!requireAuth()) return

    setLikeCount((count) => (isLiked ? count - 1 : count + 1))
    setIsLiked((liked) => !liked)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopyLabel('Copied!')
      setTimeout(() => setCopyLabel('Copy'), 2000)
    } catch (copyError) {
      console.error('Failed to copy link:', copyError)
    }
  }

  const handleSendComment = (event) => {
    event.preventDefault()
    if (!comment.trim()) return
    if (!requireAuth()) return
    setComment('')
  }

  const shareLinks = [
    {
      label: 'Share on Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      text: 'f',
    },
    {
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      text: 'in',
    },
    {
      label: 'Share on Twitter',
      href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
      text: 'x',
    },
  ]

  return (
    <>
      <div className="mt-10 flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-2xl bg-neutral-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <button
          type="button"
          onClick={handleLike}
          className={`flex cursor-pointer items-center gap-2 rounded-full border border-stone-900 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-stone-50 ${
            isLiked ? 'text-stone-900' : 'text-stone-700'
          }`}
        >
          <SmilePlus className="h-4 w-4" aria-hidden="true" />
          <span>{likeCount}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-stone-900 bg-white px-4 py-2 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-50"
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
            {copyLabel}
          </button>

          {shareLinks.map(({ label, href, text }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-stone-900 bg-white text-lg text-stone-900 transition-colors hover:bg-stone-50"
            >
              {text}
            </a>
          ))}
        </div>
      </div>

      <form onSubmit={handleSendComment} className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-stone-900">Comment</h2>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="What are your thoughts?"
          rows={5}
          className="w-full resize-none rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-900"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-stone-900 px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
          >
            Send
          </button>
        </div>
      </form>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}

function AuthorCard({ author }) {
  return (
    <aside className="rounded-2xl bg-neutral-100 p-6">
      <div className="flex items-center gap-3">
        <img
          src={AUTHOR_AVATAR}
          alt={author}
          className="h-11 w-11 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-sm text-stone-400">Author</span>
          <span className="font-bold text-stone-900">{author}</span>
        </div>
      </div>

      <hr className="my-5 border-stone-200" />

      <div className="flex flex-col gap-4 text-sm leading-relaxed text-stone-500">
        <p>
          I am a pet enthusiast and freelance writer who specializes in animal
          behavior and care. With a deep love for cats, I enjoy sharing insights
          on feline companionship and wellness.
        </p>
        <p>
          When I&apos;m not writing, I spend time volunteering at my local animal
          shelter, helping cats find loving homes.
        </p>
      </div>
    </aside>
  )
}

function ViewPostPage() {
  const { postId } = useParams()
  const validPostId = getValidPostId(postId)
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const shouldFetch = validPostId !== null

  useEffect(() => {
    if (!shouldFetch) return

    const fetchPost = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await axios.get(`${API_BASE_URL}/posts/${validPostId}`)
        setPost(response.data)
      } catch (fetchError) {
        console.error('Failed to fetch post:', fetchError)
        setError('Post not found.')
        setPost(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [validPostId, shouldFetch])

  if (validPostId === null) {
    return <NotFoundPage />
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">
        <p className="text-stone-500">Loading article...</p>
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">
        <p className="text-stone-500">{error ?? 'Post not found.'}</p>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-8 sm:px-10">
      <img
        src={post.image}
        alt={post.title}
        className="mb-10 h-[240px] w-full rounded-2xl object-cover sm:h-[360px] lg:h-[460px]"
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px] lg:gap-12">
        <article>
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full bg-green-200 px-3 py-1 text-sm font-semibold text-green-600">
              {post.category}
            </span>
            <span className="text-sm text-stone-400">{formatPostDate(post.date)}</span>
          </div>

          <h1 className="mb-8 text-3xl font-bold leading-tight text-stone-900 sm:text-4xl">
            {post.title}
          </h1>

          <PostContent content={post.content} />
          <PostInteraction key={post.id} post={post} />
        </article>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <AuthorCard author={post.author} />
        </div>
      </div>
    </main>
  )
}

export default ViewPostPage
