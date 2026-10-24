import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves the site under /glamisky/; Vercel (and any custom domain) serves from the root.
export default defineConfig({
  base: process.env.VERCEL ? '/' : '/glamisky/',
  plugins: [react()],
})
