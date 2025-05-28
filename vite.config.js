import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    // Optimizaciones para SEO y rendimiento
    minify: 'esbuild', // Usar esbuild (incluido con Vite, más rápido que terser)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons', '@fortawesome/vue-fontawesome']
        }
      }
    },
    // Generar source maps para debugging en producción
    sourcemap: false,
    // Optimizar assets
    assetsInlineLimit: 4096
  },
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    host: true
  },
  // Configuración para preview
  preview: {
    port: 4173,
    host: true
  }
})
