import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Reload Tailwind config
export default defineConfig({
  plugins: [react()],
})
