import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   test: {
    environment: "jsdom", // 👈 NØGLELINJEN!
    globals: true,
    setupFiles: "./src/setupTests.js", // valgfrit, men anbefales
  },
})
