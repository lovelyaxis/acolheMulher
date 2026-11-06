import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Repassa as chamadas /api para o back-end durante o desenvolvimento.
      '/api': 'http://localhost:3000',
    },
  },
})