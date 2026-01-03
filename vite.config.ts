import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // <--- YENİ EKLENEN KISIM

export default defineConfig({
  plugins: [react()],

  // Vercel'in doğru dosya yollarını çözmesini sağlayan ayar
  resolve: {
    alias: {
      // @ sembolünü kullanarak src klasörüne hızlı erişim sağlıyoruz.
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Çıktı yollarını ve statik varlıkları doğru ayarlıyoruz
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // i18n
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // UI library - Radix components
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-select',
            '@radix-ui/react-accordion',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-switch',
            '@radix-ui/react-popover',
            '@radix-ui/react-toast',
          ],
          // Charts - only loaded on pages that need it
          'vendor-charts': ['recharts'],
          // Markdown - only for blog/podcast
          'vendor-markdown': ['react-markdown', 'remark-gfm'],
          // Forms
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Utilities
          'vendor-utils': ['date-fns', 'clsx', 'class-variance-authority', 'tailwind-merge'],
        }
      }
    }
  },

  // Dev server proxy - API isteklerini Docker backend'e yönlendir
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});

