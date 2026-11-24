import { existsSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Warn (don't fail) when files the page links to are missing from /public.
function checkPublicFiles() {
  return {
    name: 'check-public-files',
    buildStart() {
      if (!existsSync('public/resume.pdf')) {
        this.warn('public/resume.pdf is missing: the resume buttons stay hidden until you add it.')
      }
    },
  }
}

export default defineConfig({
  // Relative base: the build works at https://<user>.github.io/ and at https://<user>.github.io/<repo>/
  base: './',
  plugins: [react(), tailwindcss(), checkPublicFiles()],
  build: {
    target: 'es2022',
    cssMinify: true,
  },
})
