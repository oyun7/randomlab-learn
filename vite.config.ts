import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/randomlab-learn/',  // ← имя твоего репозитория на GitHub
})