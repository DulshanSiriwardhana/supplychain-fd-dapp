import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  define: {
    'import.meta.env': JSON.stringify(process.env)
  }
})