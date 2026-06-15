import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || 'http://localhost:3000/api/v1';
  const target = apiUrl.replace(/\/api\/v1\/?$/, "");

  return {
    plugins: [
      tailwindcss(),
      react(),
      visualizer({
        filename: "bundle-stats.html",
        open: false,
        gzipSize: true,
      })
    ],
    server: {
      proxy: {
        '/uploads': {
          target: target,
          changeOrigin: true,
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        }
      }
    }
  }
})
