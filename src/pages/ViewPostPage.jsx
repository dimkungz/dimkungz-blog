import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Copy, SmilePlus } from 'lucide-react'
import { toast } from 'sonner'
import AuthModal from '@/components/AuthModal'
import { isLoggedIn, DEFAULT_AVATAR } from '@/lib/auth'
import { useAdminLoggedIn } from '@/hooks/useAdminLoggedIn'
import { createComment, fetchComments } from '@/lib/comments'
import { fetchPostLikes, togglePostLike } from '@/lib/likes'
import { fetchPost, getValidPostId } from '@/lib/posts'
import { formatCommentDate, formatPostDate } from '@/lib/utils'
import NotFoundPage from '@/pages/NotFoundPage'

function CommentItem({ comment }) {
  return (
    <article className="border-t border-stone-200 py-6 first:border-t-0 first:pt-0">
      <div className="flex gap-3">
        <img
          src={comment.authorAvatar || DEFAULT_AVATAR}
          alt={comment.author}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-stone-900">{comment.author}</p>
          <p className="text-sm text-stone-400">{formatCommentDate(comment.createdAt)}</p>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">{comment.text}</p>
        </div>
      </div>
    </article>
  )
}

function CommentList({ comments, isLoading }) {
  if (isLoading) {
    return <p className="text-sm text-stone-500">Loading comments...</p>
  }

  if (comments.length === 0) {
    return null
  }

  return (
    <div className="mt-2">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  )
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

function PostInteraction({ post, comments, isLoadingComments, onCommentPosted }) {
  const isAdmin = useAdminLoggedIn()
  const [likeCount, setLikeCount] = useState(post.likes)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoadingLikes, setIsLoadingLikes] = useState(true)
  const [isTogglingLike, setIsTogglingLike] = useState(false)
  const [comment, setComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadLikes = async () => {
      try {
        const data = await fetchPostLikes(post.id)
        if (!isMounted) return
        setLikeCount(data.count)
        setIsLiked(data.liked)
      } catch (error) {
        console.error('Failed to fetch likes:', error)
      } finally {
        if (isMounted) setIsLoadingLikes(false)
      }
    }

    loadLikes()

    return () => {
      isMounted = false
    }
  }, [post.id])

  const shareUrl = encodeURIComponent(window.location.href)
  const shareTitle = encodeURIComponent(post.title)
  const canInteract = !isAdmin

  const requireAuth = () => {
    if (isAdmin) return false
    if (isLoggedIn()) return true
    setShowAuthModal(true)
    return false
  }

  const handleLike = async () => {
    if (!canInteract) return
    if (!requireAuth()) return
    if (isTogglingLike) return

    setIsTogglingLike(true)

    try {
      const data = await togglePostLike(post.id)
      setLikeCount(data.count)
      setIsLiked(data.liked)
    } catch (error) {
      console.error('Failed to toggle like:', error)
      toast.error('Failed to update like', {
        description: error.message || 'Please try again.',
      })
    } finally {
      setIsTogglingLike(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Copied!', {
        description: 'This article has been copied to your clipboard.',
      })
    } catch (copyError) {
      console.error('Failed to copy link:', copyError)
    }
  }

  const handleSendComment = async (event) => {
    event.preventDefault()
    if (!canInteract) return
    if (!comment.trim()) return
    if (!requireAuth()) return

    setIsSubmittingComment(true)

    try {
      const newComment = await createComment(post.id, comment.trim())
      onCommentPosted(newComment)
      setComment('')
      toast.success('Comment posted', {
        description: 'Your comment has been added.',
      })
    } catch (submitError) {
      console.error('Failed to post comment:', submitError)
      toast.error('Failed to post comment', {
        description: submitError.message || 'Please try again.',
      })
    } finally {
      setIsSubmittingComment(false)
    }
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
          disabled={!canInteract || isLoadingLikes || isTogglingLike}
          className={`flex items-center gap-2 rounded-full border border-stone-900 bg-white px-4 py-2 text-sm font-medium transition-colors ${
            canInteract
              ? 'cursor-pointer hover:bg-stone-50'
              : 'cursor-not-allowed opacity-50'
          } ${isLiked ? 'text-stone-900' : 'text-stone-700'}`}
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
            Copy
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

      {!isAdmin && (
      <form onSubmit={handleSendComment} className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-stone-900">Comment</h2>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="What are your thoughts?"
          rows={5}
          disabled={!canInteract || isSubmittingComment}
          className="w-full resize-none rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canInteract || isSubmittingComment || !comment.trim()}
            className="cursor-pointer rounded-full bg-stone-900 px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmittingComment ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
      )}

      <CommentList comments={comments} isLoading={isLoadingComments} />
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}

function AuthorCard({ author, authorAvatar }) {
  return (
    <aside className="rounded-2xl bg-neutral-100 p-6">
      <div className="flex items-center gap-3">
        <img
          src={authorAvatar || DEFAULT_AVATAR}
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
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingComments, setIsLoadingComments] = useState(true)
  const [error, setError] = useState(null)
  const shouldFetch = validPostId !== null

  useEffect(() => {
    if (!shouldFetch) return

    const loadPost = async () => {
      setIsLoading(true)
      setIsLoadingComments(true)
      setError(null)

      try {
        const postData = await fetchPost(validPostId)
        setPost(postData)

        try {
          const commentData = await fetchComments(validPostId)
          setComments(commentData)
        } catch (commentsError) {
          console.error('Failed to fetch comments:', commentsError)
          setComments([])
        }
      } catch (fetchError) {
        console.error('Failed to fetch post:', fetchError)
        setError('Post not found.')
        setPost(null)
        setComments([])
      } finally {
        setIsLoading(false)
        setIsLoadingComments(false)
      }
    }

    loadPost()
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
          <PostInteraction
            key={post.id}
            post={post}
            comments={comments}
            isLoadingComments={isLoadingComments}
            onCommentPosted={(newComment) => {
              setComments((current) => [...current, newComment])
            }}
          />
        </article>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <AuthorCard author={post.author} authorAvatar={post.authorAvatar} />
        </div>
      </div>
    </main>
  )
}

export default ViewPostPage
