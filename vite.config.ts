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
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // UI library chunk
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-select',
            '@radix-ui/react-accordion',
          ],
          // Utility chunks
          'vendor-utils': ['date-fns', 'clsx', 'class-variance-authority'],
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

