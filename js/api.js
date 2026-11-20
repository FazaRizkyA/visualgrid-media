/* ==========================================================================
   LAPISAN DATA PUBLIK (SUPABASE REST)
   Fungsi: Membaca konten situs (layanan, portofolio, paket harga, FAQ,
   pengaturan) dari Supabase dan menyimpan pesanan dari formulir kontak.
   Kalau Supabase belum diatur atau gagal, loadContent() mengembalikan null
   dan situs tetap memakai isi statis di index.html.
   ========================================================================== */
(function () {
  "use strict";

  const cfg = window.VISUALGRID_CONFIG || {};
  const enabled = Boolean(cfg.SUPABASE_URL && cfg.SUPABASE_KEY);
  const base = enabled ? cfg.SUPABASE_URL.replace(/\/+$/, "") + "/rest/v1" : "";
  const headers = enabled ? { apikey: cfg.SUPABASE_KEY } : {};

  // Mengambil satu tabel lewat REST dengan batas waktu agar situs tidak menunggu lama.
  async function getJson(path, signal) {
    const res = await fetch(`${base}/${path}`, { headers, signal });
    if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
    return res.json();
  }

  async function loadContent(timeoutMs = 4000) {
    if (!enabled) return null;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const list = (t) => getJson(`${t}?select=*&published=eq.true&order=sort.asc`, ctrl.signal);
    try {
      const [services, portfolio, pricing, faqs, settings] = await Promise.all([
        list("vg_services"),
        list("vg_portfolio"),
        list("vg_pricing"),
        list("vg_faqs"),
        getJson("vg_settings?select=wa_number,slot_text&id=eq.1", ctrl.signal)
      ]);
      return { services, portfolio, pricing, faqs, settings: settings[0] || null };
    } catch (err) {
      console.warn("[VisualGrid] Gagal memuat dari Supabase, memakai isi statis:", err);
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  // Menyimpan pesanan. keepalive: tetap terkirim walau pengunjung pindah ke tab WhatsApp.
  async function submitOrder(order) {
    if (!enabled) return false;
    const res = await fetch(`${base}/vg_orders`, {
      method: "POST",
      keepalive: true,
      headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(order)
    });
    if (!res.ok) throw new Error(`vg_orders: HTTP ${res.status} ${await res.text()}`);
    return true;
  }

  window.VISUALGRID_API = { enabled, loadContent, submitOrder };
})();
