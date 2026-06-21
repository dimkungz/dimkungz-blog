import { useState } from 'react'
function NavBar() {
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

export default NavBar