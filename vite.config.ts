import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import netlifyPlugin from '@netlify/vite-plugin-tanstack-start'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    netlifyPlugin(),
  ],
})

export default config
