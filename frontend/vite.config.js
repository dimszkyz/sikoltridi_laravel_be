// File: frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import laravel from 'laravel-vite-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    laravel({
        input: ['src/main.jsx'], 
        refresh: true,
        publicDirectory: '../sikoltridi-laravel/public', 
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    host: '127.0.0.1',
    // TAMBAHKAN INI:
    proxy: {
        '/api': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
            secure: false,
        },
        '/uploads': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
            secure: false,
        }
    }
  }
})