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
  define: {
    __APP_NAME__: JSON.stringify(process.env.APP_NAME || 'yevis-web'),
    __APP_VERSION__: JSON.stringify(process.env.APP_VERSION || '1.0.0'),
  },
})
