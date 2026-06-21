import { createLucideIcon } from 'lucide-react'

export const GithubIcon = createLucideIcon('Github', [
  [
    'path',
    {
      d: 'M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.17-1.11-1.48-1.11-1.48-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.02A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z',
      fill: 'currentColor',
      stroke: 'none',
      key: 'github',
    },
  ],
])

export function SocialIconLink({ href, label, Icon, text }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-stone-800 text-white transition-colors hover:bg-stone-700"
    >
      {text ? (
        <span className="text-xl font-bold leading-none">{text}</span>
      ) : (
        <Icon className="h-7 w-7" strokeWidth={0} />
      )}
    </a>
  )
}
