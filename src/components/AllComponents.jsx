import { useState } from 'react'
import { Search } from 'lucide-react'
import heroPic from '../assets/heropic.jpg'
import { GithubIcon, SocialIconLink } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const loginButtonClass =
    'cursor-pointer rounded-full border border-stone-900 px-6 py-2 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-50 sm:px-8 sm:py-2.5'
  const signupButtonClass =
    'cursor-pointer rounded-full bg-stone-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800 sm:px-8 sm:py-2.5'

  return (
    <header className="border-b border-stone-200">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <a href="/" className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          hh<span className="text-emerald-500">.</span>
        </a>

        <div className="hidden items-center gap-2 md:flex">
          <button type="button" className={loginButtonClass}>
            Log in
          </button>
          <button type="button" className={signupButtonClass}>
            Sign up
          </button>
        </div>

        <button
          type="button"
          className="flex cursor-pointer flex-col justify-center gap-1.5 p-2 md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <span
            className={`block h-0.5 w-6 bg-stone-900 transition-transform duration-200 ${
              isMenuOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-stone-900 transition-opacity duration-200 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-stone-900 transition-transform duration-200 ${
              isMenuOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0">
          <div className="border-t border-stone-200 px-4 py-4">
            <div className="flex flex-col gap-3">
              <button type="button" className={`w-full ${loginButtonClass}`}>
                Log in
              </button>
              <button type="button" className={`w-full ${signupButtonClass}`}>
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export function HeroSection() {
  return (
    <main className="mx-auto mt-12 w-full max-w-6xl px-6 pb-16 sm:px-10 sm:pb-24">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-8 xl:gap-12">
        <div className="order-1 flex flex-col gap-4 text-center lg:order-0 lg:items-end lg:text-right">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl lg:pl-2 lg:text-[2.75rem] lg:leading-[1.15]">
            Stay Informed,
            <br />
            Stay Inspired
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-stone-500 sm:text-base lg:ml-auto lg:mr-0">
            Discover a World of Knowledge at Your Fingertips. Your Daily Dose of
            Inspiration and Information.
          </p>
        </div>

        <div className="order-2 flex justify-center lg:order-0">
          <div className="aspect-3/4 w-full max-w-[260px] overflow-hidden rounded-3xl sm:max-w-[300px] lg:max-w-[320px] xl:max-w-[360px]">
            <img
              src={heroPic}
              alt="Author with a cat on his shoulder in an autumn forest"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="order-3 mx-auto w-full max-w-sm text-left lg:order-0 lg:mx-0 lg:max-w-xs">
          <div className="flex flex-col gap-3">
            <span className="text-sm text-stone-400">-Author</span>
            <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">Thompson P.</h2>
            <div className="flex flex-col gap-4 text-sm leading-relaxed text-stone-500 sm:text-base">
              <p>
                I am a pet enthusiast and freelance writer who specializes in animal
                behavior and care. With a deep love for cats, I enjoy sharing insights
                on feline companionship and wellness.
              </p>
              <p>
                When I'm not writing, I spends time volunteering at my local animal
                shelter, helping cats find loving homes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export function ArticleSection() {
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
    </section>
  )
}

export function Footer() {
    const socialLinks = [
      { label: 'LinkedIn', href: 'https://linkedin.com', text: 'in' },
      { label: 'GitHub', href: 'https://github.com', Icon: GithubIcon },
      { label: 'Google', href: 'https://google.com', text: 'G' },
    ]
    
    return (
      <footer className="bg-neutral-100">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 py-8 sm:flex-row sm:px-10">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <span className="text-sm text-stone-700">Get in touch</span>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ label, href, Icon, text }) => (
                <SocialIconLink
                  key={label}
                  href={href}
                  label={label}
                  Icon={Icon}
                  text={text}
                />
              ))}
            </div>
          </div>
  
          <a
            href="/"
            className="cursor-pointer text-sm text-stone-700 underline underline-offset-2 transition-colors hover:text-stone-900"
          >
            Home page
          </a>
        </div>
      </footer>
    )
} 