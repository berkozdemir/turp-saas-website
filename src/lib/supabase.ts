import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ENV değişkenlerini typesafe al
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Runtime kontrolü (opsiyonel ama faydalı)
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase anahtarları eksik! ENV değişkenlerini kontrol edin.");
}

// Tip güvenli client oluşturma
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
