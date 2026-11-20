/* ==========================================================================
   KONFIGURASI SUPABASE
   Isi dari Supabase Dashboard → Project Settings → API Keys.
   - SUPABASE_URL : "Project URL", contoh https://abcdefgh.supabase.co
   - SUPABASE_KEY : "Publishable key" (sb_publishable_...).
   Kunci ini MEMANG publik (keamanan dijaga Row Level Security di database).
   JANGAN PERNAH menaruh "secret" / "service_role" key di sini.
   Kalau dikosongkan, situs tetap jalan memakai isi statis index.html.
   ========================================================================== */
window.VISUALGRID_CONFIG = {
  SUPABASE_URL: "https://driqfbcsnedvtqfzcbao.supabase.co",
  SUPABASE_KEY: "sb_publishable_pX723-nviQWcc0ygFIE-0A_N1k5w9fd"
};
