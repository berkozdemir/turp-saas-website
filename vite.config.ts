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
  
  // Çıktı yollarını ve statik varlıkları doğru ayarlıyoruz (genellikle bu zorunlu değildir ama sorunları çözer)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
