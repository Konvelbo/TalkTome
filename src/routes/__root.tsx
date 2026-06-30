import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import ConvexProvider from '../integrations/convex/provider'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Talk to me — Speech to Text' },
      {
        name: 'description',
        content:
          'Convert your voice into text instantly in any language. Free speech-to-text powered by Groq Whisper.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous' as const,
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
        type: 'image/x-icon',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ConvexProvider>{children}</ConvexProvider>
        <Scripts />
      </body>
    </html>
  )
}
