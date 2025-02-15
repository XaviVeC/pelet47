import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "35.173.218.148", // Servidor backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Elimina el prefijo /api
      },
    },
  },
});
