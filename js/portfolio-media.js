/* ==========================================================================
   MEDIA PORTOFOLIO (DIPAKAI SITUS & ADMIN)
   Fungsi: Daftar media bawaan per id karya (id sama dengan supabase/seed.sql)
   dan aturan memilih media: kolom media_url di Supabase diutamakan; bila
   kosong atau kolomnya belum ada, dipakai media bawaan; bila tidak ada juga,
   kartu memakai ikon.
   Path file relatif terhadap root situs (contoh assets/portfolio/x.jpg).
   ========================================================================== */
(function () {
  "use strict";

  const BUILTIN = {
    "pf-apparel": { type: "image", src: "assets/portfolio/apparel-minimalis-feed.jpg" },
    "pf-coffee": { type: "video", src: "assets/portfolio/coffee-reels.mp4", poster: "assets/portfolio/coffee-reels-poster.jpg" },
    "pf-serum": { type: "video", src: "assets/portfolio/serum-botanik-ad.mp4", poster: "assets/portfolio/serum-botanik-ad-poster.jpg" },
    "pf-meetup": { type: "video", src: "assets/portfolio/tech-meetup-aftermovie.mp4", poster: "assets/portfolio/tech-meetup-aftermovie-poster.jpg" },
    "pf-clinic": { type: "image", src: "assets/portfolio/klinik-story-kit.jpg" },
    "pf-cv": { type: "pdf", src: "assets/portfolio/cv-senior-product-manager.pdf", poster: "assets/portfolio/cv-senior-pm-thumb.jpg" }
  };
  const TYPES = ["image", "video", "pdf"];

  // Hanya izinkan URL https atau file di folder assets/ (mencegah javascript: dll.)
  function safeUrl(url) {
    const u = String(url || "").trim();
    return /^(https:\/\/|assets\/)/i.test(u) ? u : "";
  }

  function guessType(url) {
    if (/\.(mp4|webm|mov)(\?|#|$)/i.test(url)) return "video";
    if (/\.pdf(\?|#|$)/i.test(url)) return "pdf";
    return "image";
  }

  // Mengembalikan { type, src, poster, source: "custom" | "builtin" } atau null.
  function resolve(p) {
    const src = safeUrl(p && p.media_url);
    if (src) {
      const type = TYPES.includes(p.media_type) ? p.media_type : guessType(src);
      return { type, src, poster: safeUrl(p.media_poster), source: "custom" };
    }
    const b = p && BUILTIN[p.id];
    return b ? { ...b, poster: b.poster || "", source: "builtin" } : null;
  }

  // Semua file bawaan, untuk saran isian di form admin.
  function files() {
    const out = new Set();
    Object.values(BUILTIN).forEach((m) => { out.add(m.src); if (m.poster) out.add(m.poster); });
    return [...out];
  }

  window.VISUALGRID_MEDIA = { BUILTIN, TYPES, safeUrl, guessType, resolve, files };
})();
