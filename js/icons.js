/* ==========================================================================
   KUMPULAN IKON SVG
   Fungsi: Ikon yang bisa dipilih admin untuk kartu layanan dan portofolio.
   Dipakai bersama oleh situs (js/main.js) dan dasbor admin (admin/admin.js).
   Setiap ikon berisi bagian dalam <svg viewBox="0 0 24 24">.
   ========================================================================== */
window.VISUALGRID_ICONS = {
  grid: {
    label: "Grid feed",
    svg: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>'
  },
  image: {
    label: "Gambar",
    svg: '<rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>'
  },
  story: {
    label: "Story (HP)",
    svg: '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>'
  },
  video: {
    label: "Kamera video",
    svg: '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>'
  },
  play: {
    label: "Tombol play",
    svg: '<polygon points="5 3 19 12 5 21 5 3"></polygon>'
  },
  "play-circle": {
    label: "Play dalam lingkaran",
    svg: '<circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon>'
  },
  ads: {
    label: "Iklan",
    svg: '<circle cx="12" cy="12" r="10"></circle><path d="M16 12l-5-3v6z"></path>'
  },
  camera: {
    label: "Kamera foto",
    svg: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>'
  },
  document: {
    label: "Dokumen",
    svg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>'
  }
};
