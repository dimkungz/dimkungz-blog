import { useEffect, useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import BlogCard from './BlogCard'

const API_BASE_URL = 'https://blog-post-project-api.vercel.app'

const POSTS_PER_PAGE = 6

const articleCategories = ['Highlight', 'Cat', 'Inspiration', 'Ganeral']

function getApiCategory(category) {
  if (category === 'Ganeral') return 'General'
  return category
}

function formatPostDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function deduplicatePosts(posts) {
  const seenTitles = new Set()

  return posts.filter((post) => {
    if (seenTitles.has(post.title)) return false
    seenTitles.add(post.title)
    return true
  })
}

function filterPostsByCategory(posts, activeCategory) {
  if (activeCategory === 'Highlight') return posts

  const category = getApiCategory(activeCategory)
  return posts.filter((post) => post.category === category)
}

function ArticleSection() {
    const [activeCategory, setActiveCategory] = useState('Highlight')
    const [searchQuery, setSearchQuery] = useState('')
    const [allPosts, setAllPosts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)

    const filteredPosts = filterPostsByCategory(allPosts, activeCategory)
    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE))
    const displayedPosts = filteredPosts.slice(
      (currentPage - 1) * POSTS_PER_PAGE,
      currentPage * POSTS_PER_PAGE,
    )

    const handleCategoryChange = (event, category) => {
      event.preventDefault()
      setActiveCategory(category)
      setCurrentPage(1)
    }

    const handlePageChange = (event, page) => {
      event.preventDefault()
      setCurrentPage(page)
    }

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/posts`, {
            params: { limit: 30 },
          })
          setAllPosts(deduplicatePosts(response.data.posts))
        } catch (error) {
          console.error('Failed to fetch posts:', error)
          setAllPosts([])
        } finally {
          setIsLoading(false)
        }
      }

      fetchPosts()
    }, [])
    return (
      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10">
        <h2 className="mb-6 text-2xl font-bold text-stone-900 sm:text-3xl">Latest articles</h2>
  
        <div className="flex flex-col gap-4 rounded-2xl bg-neutral-100 px-4 py-4 md:hidden">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-auto rounded-xl border-stone-200 bg-white py-2.5 pr-10 pl-4 text-sm text-stone-500 shadow-none placeholder:text-stone-500"
            />
            <Search
              className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-stone-500"
              aria-hidden="true"
            />
          </div>
  
          <div>
            <label
              htmlFor="article-category-mobile"
              className="mb-2 block text-sm text-stone-500"
            >
              Category
            </label>
            <Select
              value={activeCategory}
              onValueChange={(category) => {
                setActiveCategory(category)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger
                id="article-category-mobile"
                className="h-auto w-full cursor-pointer rounded-xl border-stone-200 bg-white py-2.5 pr-3 pl-4 text-sm text-stone-500 shadow-none"
              >
                <SelectValue placeholder="Highlight" />
              </SelectTrigger>
              <SelectContent>
                {articleCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
  
        <div className="hidden items-center justify-between gap-6 rounded-2xl bg-neutral-100 px-5 py-4 md:flex">
          <div className="flex flex-wrap items-center gap-2">
            {articleCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={(event) => handleCategoryChange(event, category)}
                className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-neutral-200 text-stone-700'
                    : 'text-stone-400 hover:text-stone-600 hover:bg-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
  
          <div className="relative w-full max-w-[220px]">
            <Input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-auto rounded-xl border-0 bg-white py-2.5 pr-10 pl-4 text-sm text-stone-900 shadow-none placeholder:text-stone-400"
            />
            <Search
              className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-stone-400"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {isLoading ? (
              <p className="text-stone-500 md:col-span-2">Loading articles...</p>
            ) : displayedPosts.length === 0 ? (
              <p className="text-stone-500 md:col-span-2">No articles found.</p>
            ) : (
              displayedPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  image={post.image}
                  category={post.category}
                  title={post.title}
                  description={post.description}
                  author={post.author}
                  date={formatPostDate(post.date)}
                />
              ))
            )}
        </div>

        {!isLoading && totalPages > 1 && (
          <nav
            className="mt-10 flex items-center justify-center gap-2"
            aria-label="Pagination"
          >
            <button
              type="button"
              onClick={(event) => handlePageChange(event, currentPage - 1)}
              disabled={currentPage === 1}
              className="cursor-pointer rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={(event) => handlePageChange(event, page)}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-stone-900 text-white'
                    : 'border border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={(event) => handlePageChange(event, currentPage + 1)}
              disabled={currentPage === totalPages}
              className="cursor-pointer rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </section>
    )
  }

  export default ArticleSection