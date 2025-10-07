import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: true,
    watch: {
      usePolling: true,
    },
    // Add proxy for API requests to avoid CORS issues
    proxy: {
      '/api/v1': {
        target: 'http://localhost:9090',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})