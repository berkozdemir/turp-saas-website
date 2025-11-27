/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // başka env değişkenlerin olursa buraya ekleyebilirsin
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
