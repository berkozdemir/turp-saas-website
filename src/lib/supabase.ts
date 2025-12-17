import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ENV değişkenlerini typesafe al
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Runtime kontrolü ve Hata Yönetimi
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase anahtarları eksik! .env dosyasını kontrol edin.");
}

// Client oluşturma veya Mock Client döndürme (Crash önlemek için)
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : (new Proxy({}, {
    get: (target, prop) => {
      // Promise dönen metodlar için (örneğin .from().select()) zincirleme yapıyı kırmamak lazım
      // Basitçe her erişimde hata basan ve boş data dönen bir yapı
      console.warn(`⚠️ Supabase işlemine izin verilmedi (${String(prop)}), anahtarlar eksik.`);
      return () => ({
        data: null,
        error: { message: "Supabase keys are missing. Please check your .env file." },
        select: () => ({ data: null, error: { message: "Missing keys" } }), // Zincirleme için basit mock
        from: () => ({ select: () => ({ data: null, error: null }) }) // Daha derin mock gerekebilir
      });
    }
  }) as unknown as SupabaseClient);
