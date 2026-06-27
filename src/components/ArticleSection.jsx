import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import { blogPosts } from '@/data/blogPosts'
import BlogCard from './BlogCard'

function ArticleSection() {
    const [activeCategory, setActiveCategory] = useState('Highlight')
    const [searchQuery, setSearchQuery] = useState('')
    const articleCategories = ['Highlight', 'Cat', 'Inspiration', 'Ganeral']
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
            <Select value={activeCategory} onValueChange={setActiveCategory}>
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
                onClick={() => setActiveCategory(category)}
                className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-neutral-200 text-stone-700'
                    : 'text-stone-400 hover:text-stone-600'
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
            {blogPosts.map((post) => (
                <BlogCard
                    key={post.id}
                    image={post.image}
                    category={post.category}
                    title={post.title}
                    description={post.description}
                    author={post.author}
                    date={post.date}
                />
            ))}
        </div>
      </section>
    )
  }

  export default ArticleSection