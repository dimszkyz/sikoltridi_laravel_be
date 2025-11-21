import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import laravel from 'laravel-vite-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    laravel({
            input: ['resources/js/main.jsx'], // Entry point utama
            refresh: true,
        }),
    react(),
    tailwindcss(),
  ],
  
})