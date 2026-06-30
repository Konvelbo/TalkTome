import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import netlifyPlugin from '@netlify/vite-plugin-tanstack-start'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => {
  return {
    resolve: { tsconfigPaths: true },

    // Add this SSR block to tell Vite to bundle GSAP during Server-Side Rendering
    ssr: {
      noExternal: ['gsap', '@gsap/react'],
    },

    plugins: [
      devtools(),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
      // Le plugin Netlify ne s'activera QUE lors de la commande "npm run build"
      command === 'build' ? netlifyPlugin() : undefined,
    ],
  }
})
