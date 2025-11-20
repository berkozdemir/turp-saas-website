/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // YENİ EKLENEN KISIM: Başlıklar için Outfit fontunu tanımlıyoruz
      fontFamily: {
        'heading': ['Outfit', 'sans-serif'], 
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
