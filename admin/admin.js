/* ==========================================================================
   VISUALGRID MEDIA — DASBOR ADMIN
   Login Supabase Auth + kelola pesanan masuk, layanan, portofolio, paket
   harga, FAQ, dan pengaturan situs.
   Hak akses dijaga Row Level Security (lihat supabase/schema.sql):
   hanya user yang terdaftar di tabel public.admins yang bisa membaca/mengubah.
   ========================================================================== */
(function () {
  "use strict";

  const cfg = window.VISUALGRID_CONFIG || {};
  const ICONS = window.VISUALGRID_ICONS || {};
  const $ = (id) => document.getElementById(id);
  const esc = (v) =>
    String(v === null || v === undefined ? "" : v).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
  const formatDate = (iso) =>
    new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });

  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_KEY || !window.supabase) {
    $("setupView").hidden = false;
    return;
  }

  // storageKey sendiri: situs lain di domain fazarizkya.github.io yang memakai proyek
  // Supabase yang sama (KARYAFRAME) tidak berbagi sesi login dengan admin ini.
  const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY, {
    auth: { storageKey: "visualgrid-admin-auth" }
  });

  /* ------------------------------------------------------------------------
     PILIHAN-PILIHAN FORMULIR
     ------------------------------------------------------------------------ */
  const ICON_OPTIONS = Object.fromEntries(Object.entries(ICONS).map(([k, v]) => [k, v.label]));
  const PORTFOLIO_CATS = {
    instagram: "Instagram Content",
    video: "Video Sinematik",
    event: "Dokumentasi Event",
    cv: "CV & Dokumen"
  };
  const METRIC_ICONS = { trend: "Grafik naik", check: "Centang" };
  const MEDIA_TYPES = { "": "Otomatis (dari ekstensi file)", image: "Gambar", video: "Video", pdf: "File PDF" };
  const BACKGROUNDS = {
    "radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)": "Slate gelap",
    "radial-gradient(circle at center, #1e3a5f 0%, #0c1524 100%)": "Biru laut",
    "radial-gradient(circle at center, #312e81 0%, #09090b 100%)": "Indigo",
    "radial-gradient(circle at center, #14532d 0%, #052e16 100%)": "Hijau hutan",
    "radial-gradient(circle at center, #701a75 0%, #1e1b4b 100%)": "Magenta",
    "radial-gradient(circle at center, #374151 0%, #111827 100%)": "Abu grafit",
    "radial-gradient(circle at center, #7c2d12 0%, #1c0a05 100%)": "Oranye bara"
  };
  const COLORS = {
    "#38bdf8": "Biru langit",
    "#60a5fa": "Biru",
    "#a78bfa": "Ungu",
    "#4ade80": "Hijau",
    "#f472b6": "Merah muda",
    "#fbbf24": "Kuning",
    "#9ca3af": "Abu-abu"
  };
  const SORT = { key: "sort", label: "Urutan", type: "number", hint: "Angka kecil tampil lebih dulu." };
  const PUBLISHED = { key: "published", label: "Tampilkan di situs", type: "checkbox" };

  const iconSvg = (key, size, stroke, width) => {
    const icon = ICONS[key] || ICONS.image;
    return icon
      ? `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${esc(stroke)}" stroke-width="${width || 2}">${icon.svg}</svg>`
      : "";
  };

  /* ------------------------------------------------------------------------
     DEFINISI TABEL KONTEN
     ------------------------------------------------------------------------ */
  const TABLES = {
    vg_services: {
      title: "Layanan",
      noun: "layanan",
      idPrefix: "srv",
      hint: "Kartu layanan di bagian “Layanan”. Nomor urut (1., 2., …) ditambahkan otomatis.",
      fields: [
        { key: "title", label: "Nama layanan", type: "text", required: true },
        { key: "icon", label: "Ikon", type: "select", options: ICON_OPTIONS },
        { key: "turnaround", label: "Lencana waktu", type: "text", hint: "Contoh: Turnaround: 3-4 Hari" },
        { key: "description", label: "Deskripsi", type: "textarea" },
        { key: "features", label: "Poin keunggulan", type: "list", hint: "Satu poin per baris." },
        { key: "cta_label", label: "Teks tombol", type: "text", hint: "Contoh: Pesan Feed Instagram" },
        SORT,
        PUBLISHED
      ],
      defaults: { icon: "grid", cta_label: "Pesan Sekarang" },
      summary: (r) => ({
        title: r.title,
        meta: [r.turnaround, `${(r.features || []).length} poin`],
        preview: `<div class="preview">${iconSvg(r.icon, 26, "currentColor")}</div>`
      })
    },
    vg_portfolio: {
      title: "Portofolio",
      noun: "karya",
      idPrefix: "pf",
      hint: "Karya di bagian “Portofolio”, bisa difilter pengunjung per kategori.",
      fields: [
        { key: "title", label: "Judul karya", type: "text", required: true },
        { key: "category", label: "Kategori filter", type: "select", options: PORTFOLIO_CATS, required: true },
        { key: "tag", label: "Label kecil di gambar", type: "text", hint: "Contoh: Reels Sinematik" },
        { key: "description", label: "Deskripsi", type: "textarea" },
        { key: "metric", label: "Hasil / metrik", type: "text", hint: "Contoh: +315% Profile Visits. Kosongkan kalau tidak ada." },
        { key: "metric_icon", label: "Ikon hasil", type: "select", options: METRIC_ICONS },
        { key: "bg", label: "Warna latar kartu", type: "select", options: BACKGROUNDS },
        { key: "icon", label: "Ikon kartu", type: "select", options: ICON_OPTIONS },
        { key: "color", label: "Warna ikon", type: "select", options: COLORS },
        { key: "media_type", label: "Jenis media", type: "select", options: MEDIA_TYPES, optionalColumn: true },
        {
          key: "media_url", label: "File media (gambar / video / PDF)", type: "text", optionalColumn: true,
          hint: "https://… atau path di repo, contoh assets/portfolio/karya.jpg. Kosongkan untuk memakai media bawaan / ikon."
        },
        {
          key: "media_poster", label: "Gambar sampul (untuk video / PDF)", type: "text", optionalColumn: true,
          hint: "Opsional. Contoh assets/portfolio/karya-poster.jpg"
        },
        SORT,
        PUBLISHED
      ],
      defaults: {
        media_type: "",
        category: "instagram",
        metric_icon: "trend",
        bg: Object.keys(BACKGROUNDS)[0],
        icon: "image",
        color: "#38bdf8"
      },
      summary: (r) => ({
        title: r.title,
        meta: [PORTFOLIO_CATS[r.category] || r.category, r.tag, r.metric],
        preview: `<div class="preview" style="background:${esc(r.bg)}">${iconSvg(r.icon, 28, r.color, 1.5)}</div>`
      })
    },
    vg_pricing: {
      title: "Paket Harga",
      noun: "paket",
      idPrefix: "tier",
      hint: "Kartu paket di bagian “Paket Harga”. Juga muncul sebagai pilihan di formulir pemesanan.",
      fields: [
        { key: "plan", label: "Nama paket", type: "text", required: true },
        { key: "price", label: "Harga (setelah “Rp”)", type: "text", required: true, hint: "Contoh: 499K atau 1.299K" },
        { key: "period", label: "Keterangan harga", type: "text", hint: "Contoh: / per paket" },
        { key: "description", label: "Deskripsi", type: "textarea" },
        { key: "features", label: "Isi paket", type: "list", hint: "Satu item per baris." },
        { key: "featured", label: "Tandai sebagai “Paling Diminati”", type: "checkbox" },
        { key: "cta_label", label: "Teks tombol", type: "text", hint: "Contoh: Pilih Paket Pro" },
        SORT,
        PUBLISHED
      ],
      defaults: { period: "/ per paket", cta_label: "Pilih Paket" },
      summary: (r) => ({
        title: r.plan,
        meta: [`Rp ${r.price} ${r.period}`, `${(r.features || []).length} item`],
        badges: r.featured ? '<span class="tag tag--featured">Paling Diminati</span>' : ""
      })
    },
    vg_faqs: {
      title: "FAQ",
      noun: "pertanyaan",
      idPrefix: null, // id dibuat otomatis oleh database
      hint: "Pertanyaan yang sering diajukan.",
      fields: [
        { key: "q", label: "Pertanyaan", type: "text", required: true },
        { key: "a", label: "Jawaban", type: "textarea", required: true },
        SORT,
        PUBLISHED
      ],
      summary: (r) => ({ title: r.q, meta: [r.a.length > 110 ? r.a.slice(0, 110) + "…" : r.a] })
    }
  };

  const ORDER_STATUSES = { baru: "Baru", diproses: "Diproses", selesai: "Selesai", batal: "Batal" };

  /* ------------------------------------------------------------------------
     UTIL UI
     ------------------------------------------------------------------------ */
  let toastTimer = null;
  function toast(msg) {
    const el = $("toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.hidden = true), 3200);
  }

  function showError(el, msg) {
    el.textContent = msg;
    el.hidden = !msg;
  }

  function friendlyError(err) {
    const m = (err && err.message) || String(err);
    if (/Invalid login credentials/i.test(m)) return "Email atau kata sandi salah.";
    if (/Email not confirmed/i.test(m)) return "Email belum dikonfirmasi. Konfirmasi lewat Supabase Dashboard → Authentication → Users.";
    if (/row-level security|permission denied/i.test(m)) return "Akses ditolak. Pastikan akun ini terdaftar di tabel admins.";
    if (/Failed to fetch|NetworkError/i.test(m)) return "Tidak bisa terhubung ke server. Periksa koneksi internet.";
    if (/wa_number/i.test(m)) return "Nomor WhatsApp harus 8–15 angka, diawali kode negara (contoh 62812…).";
    return m;
  }

  /* ------------------------------------------------------------------------
     AUTH
     ------------------------------------------------------------------------ */
  async function enterApp(session) {
    const { data, error } = await sb
      .from("admins")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle();
    if (error || !data) {
      await sb.auth.signOut();
      showLogin(error ? friendlyError(error) : "Akun ini bukan admin. Tambahkan user ID-nya ke tabel admins.");
      return;
    }
    $("loginView").hidden = true;
    $("appView").hidden = false;
    $("userEmail").textContent = session.user.email || "";
    const initial = (location.hash || "").slice(1);
    switchTab(initial === "orders" || initial === "settings" || TABLES[initial] ? initial : "orders");
    refreshOrderCount();
  }

  function showLogin(errMsg) {
    $("appView").hidden = true;
    $("loginView").hidden = false;
    showError($("loginError"), errMsg || "");
  }

  $("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("loginBtn");
    btn.disabled = true;
    showError($("loginError"), "");
    const { data, error } = await sb.auth.signInWithPassword({
      email: $("loginEmail").value.trim(),
      password: $("loginPassword").value
    });
    btn.disabled = false;
    if (error) return showError($("loginError"), friendlyError(error));
    $("loginPassword").value = "";
    enterApp(data.session);
  });

  $("logoutBtn").addEventListener("click", async () => {
    await sb.auth.signOut();
    showLogin();
  });

  /* ------------------------------------------------------------------------
     TABS
     ------------------------------------------------------------------------ */
  let currentTab = "orders";

  function switchTab(tab) {
    currentTab = tab;
    history.replaceState(null, "", "#" + tab);
    document.querySelectorAll(".tab").forEach((b) => {
      b.setAttribute("aria-selected", String(b.dataset.tab === tab));
    });
    if (tab === "orders") renderOrders();
    else if (tab === "settings") renderSettings();
    else renderTable(tab);
  }

  document.querySelectorAll(".tab").forEach((b) => {
    b.addEventListener("click", () => switchTab(b.dataset.tab));
  });

  /* ------------------------------------------------------------------------
     PESANAN MASUK
     ------------------------------------------------------------------------ */
  let orderFilter = "baru";

  async function refreshOrderCount() {
    const { count } = await sb
      .from("vg_orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "baru");
    const pill = $("newOrderCount");
    pill.textContent = count || "";
    pill.hidden = !count;
  }

  function waLink(phone) {
    let digits = String(phone).replace(/\D/g, "");
    if (digits.length < 8) return null;
    if (digits.startsWith("0")) digits = "62" + digits.slice(1);
    return `https://wa.me/${digits}`;
  }

  async function renderOrders() {
    const panel = $("panel");
    const filterOptions = [["semua", "Semua status"], ...Object.entries(ORDER_STATUSES)]
      .map(([v, l]) => `<option value="${v}" ${v === orderFilter ? "selected" : ""}>${l}</option>`)
      .join("");
    panel.innerHTML = `
      <div class="panel-head">
        <div class="panel-head__left">
          <h1>Pesanan Masuk</h1>
          <span class="muted">Dikirim pengunjung lewat formulir “Konsultasikan Kebutuhan Proyek Anda”.</span>
        </div>
        <div class="toolbar">
          <select id="orderFilter" aria-label="Filter status">${filterOptions}</select>
          <button type="button" class="btn btn--ghost btn--sm" id="orderReload">Muat ulang</button>
        </div>
      </div>
      <div class="list" id="orderList"><p class="empty">Memuat…</p></div>`;

    $("orderFilter").addEventListener("change", (e) => {
      orderFilter = e.target.value;
      renderOrders();
    });
    $("orderReload").addEventListener("click", () => {
      renderOrders();
      refreshOrderCount();
    });

    let q = sb.from("vg_orders").select("*").order("created_at", { ascending: false }).limit(200);
    if (orderFilter !== "semua") q = q.eq("status", orderFilter);
    const { data, error } = await q;
    if (currentTab !== "orders") return;
    const list = $("orderList");
    if (error) {
      list.innerHTML = `<p class="error">${esc(friendlyError(error))}</p>`;
      return;
    }
    if (!data.length) {
      list.innerHTML = `<p class="empty">Belum ada pesanan${orderFilter === "semua" ? "" : " dengan status ini"}.</p>`;
      return;
    }

    list.innerHTML = data
      .map((o) => {
        const href = waLink(o.phone);
        const statusOpts = Object.entries(ORDER_STATUSES)
          .map(([v, l]) => `<option value="${v}" ${v === o.status ? "selected" : ""}>${l}</option>`)
          .join("");
        return `
        <article class="card" data-id="${o.id}">
          <p class="row__title">${esc(o.name)}</p>
          <div class="row__meta">
            <span class="tag tag--${esc(o.status)}">${esc(ORDER_STATUSES[o.status] || o.status)}</span>
            <span>${esc(o.service)}</span>
            ${o.package ? `<span>${esc(o.package)}</span>` : ""}
            <span>${esc(formatDate(o.created_at))}</span>
            <span>${href
              ? `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(o.phone)}</a>`
              : esc(o.phone)}</span>
          </div>
          <p class="order__body">${o.notes ? esc(o.notes) : '<span class="muted">Tanpa catatan proyek.</span>'}</p>
          <div class="order__controls">
            <select data-role="status" aria-label="Status">${statusOpts}</select>
            <textarea data-role="note" rows="1" placeholder="Catatan internal (tidak terlihat klien)">${esc(o.admin_note)}</textarea>
            <div class="row__actions">
              <button type="button" class="btn btn--primary btn--sm" data-act="save">Simpan</button>
              <button type="button" class="btn btn--danger btn--sm" data-act="delete">Hapus</button>
            </div>
          </div>
        </article>`;
      })
      .join("");

    list.querySelectorAll("article").forEach((card) => {
      const id = Number(card.dataset.id);
      card.querySelector('[data-act="save"]').addEventListener("click", async (e) => {
        e.target.disabled = true;
        const { error } = await sb
          .from("vg_orders")
          .update({
            status: card.querySelector('[data-role="status"]').value,
            admin_note: card.querySelector('[data-role="note"]').value
          })
          .eq("id", id);
        e.target.disabled = false;
        if (error) return toast(friendlyError(error));
        toast("Pesanan diperbarui.");
        refreshOrderCount();
        if (orderFilter !== "semua") renderOrders();
      });
      card.querySelector('[data-act="delete"]').addEventListener("click", async () => {
        if (!confirm("Hapus pesanan ini secara permanen?")) return;
        const { error } = await sb.from("vg_orders").delete().eq("id", id);
        if (error) return toast(friendlyError(error));
        toast("Pesanan dihapus.");
        refreshOrderCount();
        renderOrders();
      });
    });
  }

  /* ------------------------------------------------------------------------
     PENGATURAN SITUS
     ------------------------------------------------------------------------ */
  async function renderSettings() {
    const panel = $("panel");
    panel.innerHTML = `
      <div class="panel-head">
        <div class="panel-head__left">
          <h1>Pengaturan</h1>
          <span class="muted">Nomor WhatsApp tujuan pesanan dan teks slot di header situs.</span>
        </div>
      </div>
      <div id="settingsBox"><p class="empty">Memuat…</p></div>`;

    const { data, error } = await sb.from("vg_settings").select("*").eq("id", 1).maybeSingle();
    if (currentTab !== "settings") return;
    const box = $("settingsBox");
    if (error || !data) {
      box.innerHTML = `<p class="error">${esc(error ? friendlyError(error) : "Baris pengaturan belum ada. Jalankan supabase/seed.sql.")}</p>`;
      return;
    }

    box.innerHTML = `
      <form class="card settings" id="settingsForm">
        <label class="field">
          <span>Nomor WhatsApp admin</span>
          <input type="tel" id="setWa" value="${esc(data.wa_number)}" required />
          <small>Pesanan dari formulir dikirim ke nomor ini. Boleh ditulis 0812… atau 62812…</small>
        </label>
        <label class="field">
          <span>Teks slot tersedia (header)</span>
          <input type="text" id="setSlot" value="${esc(data.slot_text)}" />
          <small>Tampil sebagai “Slot Tersedia: …”. Contoh: 3 Proyek Minggu Ini</small>
        </label>
        <p id="settingsError" class="error" role="alert" hidden></p>
        <div><button type="submit" class="btn btn--primary">Simpan pengaturan</button></div>
      </form>`;

    $("settingsForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      let wa = $("setWa").value.replace(/\D/g, "");
      if (wa.startsWith("0")) wa = "62" + wa.slice(1);
      if (!/^\d{8,15}$/.test(wa)) {
        return showError($("settingsError"), "Nomor WhatsApp harus 8–15 angka.");
      }
      const btn = e.target.querySelector("button[type=submit]");
      btn.disabled = true;
      const { error } = await sb
        .from("vg_settings")
        .update({ wa_number: wa, slot_text: $("setSlot").value.trim() })
        .eq("id", 1);
      btn.disabled = false;
      if (error) return showError($("settingsError"), friendlyError(error));
      showError($("settingsError"), "");
      $("setWa").value = wa;
      toast("Pengaturan tersimpan. Langsung berlaku di situs.");
    });
  }

  /* ------------------------------------------------------------------------
     TABEL KONTEN (CRUD GENERIK)
     ------------------------------------------------------------------------ */
  let rowsCache = [];

  async function renderTable(table) {
    const def = TABLES[table];
    const panel = $("panel");
    panel.innerHTML = `
      <div class="panel-head">
        <div class="panel-head__left">
          <h1>${esc(def.title)}</h1>
          <span class="muted">${esc(def.hint)}</span>
        </div>
        <div class="toolbar">
          <button type="button" class="btn btn--primary btn--sm" id="addRow">+ Tambah ${esc(def.noun)}</button>
        </div>
      </div>
      <div class="list" id="rowList"><p class="empty">Memuat…</p></div>`;
    $("addRow").addEventListener("click", () => openEditor(table, null));

    const { data, error } = await sb.from(table).select("*").order("sort").order("id");
    if (currentTab !== table) return;
    const list = $("rowList");
    if (error) {
      list.innerHTML = `<p class="error">${esc(friendlyError(error))}</p>`;
      return;
    }
    rowsCache = data;
    if (!data.length) {
      list.innerHTML = `<p class="empty">Belum ada ${esc(def.noun)}. Klik “Tambah ${esc(def.noun)}”.</p>`;
      return;
    }

    list.innerHTML = data
      .map((r) => {
        const s = def.summary(r);
        const meta = s.meta.filter(Boolean).map((m) => `<span>${esc(m)}</span>`).join("");
        return `
        <article class="card row ${s.preview ? "" : "row--noprev"} ${r.published ? "" : "row--draft"}" data-id="${esc(r.id)}">
          ${s.preview || ""}
          <div>
            <p class="row__title">${esc(s.title)}</p>
            <div class="row__meta">
              <span class="tag">#${esc(r.sort)}</span>
              ${r.published ? "" : '<span class="tag">Disembunyikan</span>'}
              ${s.badges || ""}
              ${meta}
            </div>
          </div>
          <div class="row__actions">
            <button type="button" class="btn btn--ghost btn--sm" data-act="toggle">${r.published ? "Sembunyikan" : "Tampilkan"}</button>
            <button type="button" class="btn btn--ghost btn--sm" data-act="edit">Edit</button>
            <button type="button" class="btn btn--danger btn--sm" data-act="delete">Hapus</button>
          </div>
        </article>`;
      })
      .join("");

    list.querySelectorAll("article").forEach((card) => {
      const row = rowsCache.find((r) => String(r.id) === card.dataset.id);
      card.querySelector('[data-act="edit"]').addEventListener("click", () => openEditor(table, row));
      card.querySelector('[data-act="toggle"]').addEventListener("click", async () => {
        const { error } = await sb.from(table).update({ published: !row.published }).eq("id", row.id);
        if (error) return toast(friendlyError(error));
        toast(row.published ? "Disembunyikan dari situs." : "Ditampilkan di situs.");
        renderTable(table);
      });
      card.querySelector('[data-act="delete"]').addEventListener("click", async () => {
        if (!confirm(`Hapus "${def.summary(row).title}" secara permanen?`)) return;
        const { error } = await sb.from(table).delete().eq("id", row.id);
        if (error) return toast(friendlyError(error));
        toast("Dihapus.");
        renderTable(table);
      });
    });
  }

  /* ------------------------------------------------------------------------
     FORM EDIT
     ------------------------------------------------------------------------ */
  const dialog = $("editDialog");
  let editing = null; // { table, row }

  function fieldHtml(f, value) {
    const id = `f-${f.key}`;
    const hint = f.hint ? `<small>${esc(f.hint)}</small>` : "";
    const req = f.required ? "required" : "";
    switch (f.type) {
      case "checkbox":
        return `<label class="field field--check"><input type="checkbox" id="${id}" ${value ? "checked" : ""} /><span>${esc(f.label)}</span></label>`;
      case "textarea":
        return `<label class="field"><span>${esc(f.label)}</span><textarea id="${id}" ${req}>${esc(value)}</textarea>${hint}</label>`;
      case "list":
        return `<label class="field"><span>${esc(f.label)}</span><textarea id="${id}">${esc((value || []).join("\n"))}</textarea>${hint}</label>`;
      case "select": {
        const entries = Object.entries(f.options);
        // Nilai lama yang tidak ada di daftar tetap dipertahankan sebagai pilihan.
        if (value && !(value in f.options)) entries.unshift([value, `${value} (kustom)`]);
        const opts = entries
          .map(([v, l]) => `<option value="${esc(v)}" ${v === value ? "selected" : ""}>${esc(l)}</option>`)
          .join("");
        return `<label class="field"><span>${esc(f.label)}</span><select id="${id}" ${req}>${opts}</select>${hint}</label>`;
      }
      case "number":
        return `<label class="field"><span>${esc(f.label)}</span><input type="number" id="${id}" min="0" step="1" value="${esc(value)}" ${req} />${hint}</label>`;
      default:
        return `<label class="field"><span>${esc(f.label)}</span><input type="text" id="${id}" value="${esc(value)}" ${req} />${hint}</label>`;
    }
  }

  function readField(f) {
    const el = $(`f-${f.key}`);
    switch (f.type) {
      case "checkbox":
        return el.checked;
      case "list":
        return el.value.split("\n").map((s) => s.trim()).filter(Boolean);
      case "number":
        return el.value.trim() === "" ? null : Math.round(Number(el.value));
      default:
        return el.value.trim();
    }
  }

  function openEditor(table, row) {
    const def = TABLES[table];
    editing = { table, row };
    const nextSort = rowsCache.reduce((m, r) => Math.max(m, r.sort || 0), 0) + 10;
    const defaults = { published: true, sort: nextSort, ...(def.defaults || {}) };
    $("editTitle").textContent = row ? `Edit ${def.noun}` : `Tambah ${def.noun}`;
    $("editFields").innerHTML = def.fields
      .map((f) => fieldHtml(f, row ? row[f.key] : defaults[f.key]))
      .join("");
    showError($("editError"), "");
    dialog.showModal();
    const first = $("editFields").querySelector("input, textarea, select");
    if (first) first.focus();
  }

  function closeEditor() {
    dialog.close();
    editing = null;
  }

  $("editClose").addEventListener("click", closeEditor);
  $("editCancel").addEventListener("click", closeEditor);

  $("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!editing) return;
    const { table, row } = editing;
    const def = TABLES[table];

    const values = {};
    for (const f of def.fields) {
      const v = readField(f);
      if (f.required && (v === "" || v === null)) {
        return showError($("editError"), `“${f.label}” wajib diisi.`);
      }
      if (f.type === "number" && v !== null && (Number.isNaN(v) || v < 0)) {
        return showError($("editError"), `“${f.label}” harus angka 0 atau lebih.`);
      }
      values[f.key] = v;
    }
    if (values.sort === null) values.sort = 0;

    const saveBtn = $("editSave");
    saveBtn.disabled = true;
    if (!row && def.idPrefix) values.id = `${def.idPrefix}-${Date.now().toString(36)}`;
    const write = (v) => (row ? sb.from(table).update(v).eq("id", row.id) : sb.from(table).insert(v));
    let result = await write(values);

    // Kolom opsional (mis. media portofolio) belum ada di database lama:
    // simpan tanpa kolom itu, lalu beri tahu admin untuk menjalankan migrasi.
    const optionalKeys = def.fields.filter((f) => f.optionalColumn).map((f) => f.key);
    let skippedOptional = false;
    if (result.error && result.error.code === "PGRST204" && optionalKeys.length) {
      const reduced = { ...values };
      optionalKeys.forEach((k) => delete reduced[k]);
      result = await write(reduced);
      skippedOptional = !result.error;
    }
    saveBtn.disabled = false;
    if (result.error) return showError($("editError"), friendlyError(result.error));

    closeEditor();
    toast(
      skippedOptional
        ? "Tersimpan, tapi kolom media belum ada di database. Jalankan supabase/add-portfolio-media.sql."
        : "Tersimpan. Perubahan langsung tampil di situs."
    );
    renderTable(table);
  });

  /* ------------------------------------------------------------------------
     START
     ------------------------------------------------------------------------ */
  sb.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") showLogin();
  });

  sb.auth.getSession().then(({ data }) => {
    if (data.session) enterApp(data.session);
    else showLogin();
  });
})();
