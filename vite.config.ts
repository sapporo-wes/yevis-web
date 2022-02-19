import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  root: './src',
  build: {
    outDir: '../dist',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@/': path.join(__dirname, './src/'),
    },
  },
})
