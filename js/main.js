/**
 * ==============================================================================
 * LOGIKA INTERAKTIVITAS WEBSITE (MAIN JAVASCRIPT)
 * Penjelasan: File ini menangani seluruh interaksi UI di sisi klien, meliputi:
 * 1. Mobile Navigation Toggle (Buka/Tutup Menu Mobile)
 * 2. Filter Kategori Portofolio Interaktif
 * 3. Interactive Slider Perbandingan Sebelum-Sesudah (Before-After)
 * 4. FAQ Accordion dengan Transisi Tinggi Otomatis
 * 5. Validasi Form, Pesan WhatsApp, dan Penyimpanan Pesanan ke Supabase
 * 6. Indikator Navigasi Aktif berdasarkan Posisi Scroll Pengguna
 * 7. Memuat Konten Dinamis dari Supabase (dikelola lewat halaman /admin/)
 * Seluruh kode dilengkapi komentar penjelasan fungsi dalam Bahasa Indonesia.
 * ==============================================================================
 */

// Nomor WhatsApp admin. Nilai ini diganti oleh pengaturan dari Supabase bila tersedia.
let ADMIN_PHONE_NUMBER = '62895397081621';

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initPortfolioFilter();
  initBeforeAfterSlider();
  initFaqAccordion();
  initContactForm();
  initScrollSpy();
  loadDynamicContent();
});

/* --------------------------------------------------------------------------
   1. INISIALISASI MENU NAVIGASI MOBILE (HAMBURGER DRAWER)
   Fungsi: Membuka dan menutup menu dropdown pada layar smartphone/tablet kecil.
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav .nav__link');

  if (!hamburger || !mobileNav) return;

  // Toggle drawer saat tombol hamburger diklik
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Tutup menu mobile secara otomatis saat salah satu link navigasi diklik
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   2. FILTER KATEGORI PORTOFOLIO INTERAKTIF
   Fungsi: Menyaring item portofolio yang ditampilkan berdasarkan kategori
   (Semua, Instagram, Video, Dokumentasi Event, CV / Resume).
   Kartu dicari ulang setiap klik, sehingga filter tetap berfungsi walaupun
   isi grid diganti oleh konten dari Supabase.
   -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Perbarui status tombol aktif
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyPortfolioFilter(btn.getAttribute('data-filter'));
    });
  });
}

function applyPortfolioFilter(selectedCategory) {
  // 2. Tampilkan atau sembunyikan kartu dengan transisi CSS
  document.querySelectorAll('.portfolio-card').forEach(card => {
    const itemCategory = card.getAttribute('data-category');

    if (selectedCategory === 'all' || itemCategory === selectedCategory) {
      card.style.display = 'flex';
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';

      // Animasi micro fade-in
      setTimeout(() => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 30);
    } else {
      card.style.display = 'none';
    }
  });
}

/* --------------------------------------------------------------------------
   3. SLIDER PERBANDINGAN SEBELUM-SESUDAH (BEFORE VS AFTER)
   Fungsi: Mengubah lebar layer 'After' berdasarkan posisi slider input range.
   -------------------------------------------------------------------------- */
function initBeforeAfterSlider() {
  const sliderInput = document.getElementById('comparison-range');
  const afterLayer = document.getElementById('slider-after-layer');

  if (!sliderInput || !afterLayer) return;

  // Dengarkan event 'input' agar pergeseran terasa responsif tanpa jeda
  sliderInput.addEventListener('input', (e) => {
    const sliderPos = e.target.value;
    // Setel lebar layer depan sesuai persentase nilai slider
    afterLayer.style.width = `${sliderPos}%`;
  });
}

/* --------------------------------------------------------------------------
   4. ACCORDION FAQ (TANYA JAWAB UMUM)
   Fungsi: Membuka dan menutup panel jawaban FAQ dengan animasi max-height yang mulus.
   Hanya mengizinkan satu pertanyaan terbuka sekaligus (accordion behavior).
   Memakai event delegation pada .faq-list agar item FAQ dari Supabase ikut berfungsi.
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqList = document.querySelector('.faq-list');
  if (!faqList) return;

  faqList.addEventListener('click', (e) => {
    const button = e.target.closest('.faq-button');
    if (!button) return;
    const item = button.closest('.faq-item');
    const content = item && item.querySelector('.faq-content');
    if (!content) return;

    const isAlreadyOpen = item.classList.contains('open');

    // Tutup semua item FAQ lain yang sedang terbuka
    faqList.querySelectorAll('.faq-item').forEach(otherItem => {
      otherItem.classList.remove('open');
      const otherButton = otherItem.querySelector('.faq-button');
      const otherContent = otherItem.querySelector('.faq-content');
      if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
      if (otherContent) otherContent.style.maxHeight = null;
    });

    // Jika item yang diklik sebelumnya tertutup, sekarang buka
    if (!isAlreadyOpen) {
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
      // Set max-height sesuai tinggi konten aslinya (scrollHeight)
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });
}

/* --------------------------------------------------------------------------
   5. FORM PEMESANAN & INTEGRASI WHATSAPP OTOMATIS
   Fungsi: Memvalidasi isian pengguna (Nama, Nomor WA, Layanan, Paket, Catatan),
   menyusun format pesan rapi, membuka WhatsApp, lalu menyimpan pesanan ke
   Supabase di latar belakang supaya tercatat di halaman admin.
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('order-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Mencegah reload halaman standar browser

    // Ambil data dari input form
    const name = document.getElementById('client-name')?.value.trim();
    const phone = document.getElementById('client-phone')?.value.trim();
    const service = document.getElementById('service-select')?.value;
    const tier = document.getElementById('tier-select')?.value;
    const notes = document.getElementById('client-notes')?.value.trim();

    // Validasi sederhana
    if (!name || !phone || !service) {
      alert('Harap lengkapi Nama Lengkap, Nomor WhatsApp, dan Jenis Layanan yang diinginkan.');
      return;
    }
    if (name.length < 2 || phone.replace(/\D/g, '').length < 6) {
      alert('Periksa kembali Nama dan Nomor WhatsApp Anda.');
      return;
    }

    // Format template pesan WhatsApp yang sopan & terstruktur
    const waMessage =
`*HALO VISUALGRID MEDIA* 👋
Saya ingin konsultasi & pemesanan jasa kreatif visual:

📋 *Detail Pemesan:*
• *Nama:* ${name}
• *Nomor Kontak:* ${phone}
• *Layanan yang Dipilih:* ${service}
• *Paket Pilihan:* ${tier || 'Konsultasi Kustom'}

📝 *Deskripsi Proyek / Kebutuhan:*
${notes ? `"${notes}"` : '-'}

Mohon informasi ketersediaan slot pengerjaan dan estimasi biayanya. Terima kasih!`;

    // Encode string pesan ke format URL aman
    const waUrl = `https://wa.me/${ADMIN_PHONE_NUMBER}?text=${encodeURIComponent(waMessage)}`;

    // Buka WhatsApp langsung di dalam klik agar tidak diblokir popup blocker
    window.open(waUrl, '_blank', 'noopener');

    // Simpan pesanan ke Supabase (tidak menghalangi pesan WhatsApp jika gagal)
    const api = window.VISUALGRID_API;
    if (api && api.enabled) {
      api.submitOrder({
        name: name.slice(0, 120),
        phone: phone.slice(0, 30),
        service: service.slice(0, 160),
        package: (tier || '').slice(0, 160),
        notes: (notes || '').slice(0, 4000)
      }).catch(err => console.warn('[VisualGrid] Pesanan tidak tersimpan:', err));
    }

    // Umpan balik singkat pada tombol
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Pesan dibuka di WhatsApp ✓</span>';
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 2500);
  });
}

/* --------------------------------------------------------------------------
   6. SCROLL SPY INDIKATOR NAVIGASI
   Fungsi: Menyorot menu navbar yang sedang aktif saat halaman digulir.
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__list .nav__link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.pageYOffset + 150; // Titik offset perhitungan

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   7. KONTEN DINAMIS DARI SUPABASE
   Fungsi: Mengganti isi statis (layanan, portofolio, paket harga, FAQ, slot,
   nomor WhatsApp) dengan data terbaru yang diatur admin. Jika Supabase gagal,
   isi statis di index.html tetap tampil apa adanya.
   -------------------------------------------------------------------------- */

// Mengamankan teks dari database sebelum dimasukkan ke HTML (mencegah XSS)
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

// Membuat elemen <svg> dari kumpulan ikon di js/icons.js
function iconSvg(key, size, stroke, extra = '') {
  const icons = window.VISUALGRID_ICONS || {};
  const icon = icons[key] || icons.image;
  if (!icon) return '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${esc(stroke)}" stroke-width="${extra || 2}">${icon.svg}</svg>`;
}

const CHECK_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
const METRIC_SVG = {
  trend: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
  check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>'
};
const FAQ_CHEVRON = '<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>';

async function loadDynamicContent() {
  const api = window.VISUALGRID_API;
  if (!api || !api.enabled) return;
  const data = await api.loadContent();
  if (!data) return;

  renderSettings(data.settings);
  renderServices(data.services);
  renderPortfolio(data.portfolio);
  renderPricing(data.pricing);
  renderFaqs(data.faqs);
}

function renderSettings(settings) {
  if (!settings) return;
  if (/^\d{8,15}$/.test(settings.wa_number || '')) ADMIN_PHONE_NUMBER = settings.wa_number;
  const slot = document.getElementById('slot-text');
  if (slot && settings.slot_text) slot.textContent = settings.slot_text;
}

function renderServices(services) {
  const grid = document.querySelector('.services-grid');
  if (!grid) return;

  grid.innerHTML = services.map((s, i) => `
    <article class="service-card">
      <div>
        <div class="service-card__top">
          <div class="service-card__icon">${iconSvg(s.icon, 24, 'currentColor')}</div>
          ${s.turnaround ? `<span class="service-card__badge">${esc(s.turnaround)}</span>` : ''}
        </div>
        <h3 class="service-card__title">${i + 1}. ${esc(s.title)}</h3>
        <p class="service-card__desc">${esc(s.description)}</p>
        <div class="service-card__features">
          ${(s.features || []).map(f => `
          <div class="service-card__feature-item">${CHECK_SVG}<span>${esc(f)}</span></div>`).join('')}
        </div>
      </div>
      <a href="#contact" class="service-card__cta">${esc(s.cta_label)} &rarr;</a>
    </article>`).join('');

  const count = document.getElementById('services-count');
  if (count) count.textContent = services.length;

  // Sinkronkan pilihan layanan di formulir pemesanan
  const select = document.getElementById('service-select');
  if (select) {
    select.innerHTML =
      '<option value="" disabled selected>Pilih salah satu layanan...</option>' +
      services.map((s, i) => {
        const label = `${i + 1}. ${s.title}`;
        return `<option value="${esc(label)}">${esc(label)}</option>`;
      }).join('') +
      '<option value="Paket Kustom Kombinasi">Kombinasi Beberapa Layanan (Custom Project)</option>';
  }
}

function renderPortfolio(items) {
  const grid = document.querySelector('.portfolio-grid');
  if (!grid) return;

  grid.innerHTML = items.map(p => `
    <article class="portfolio-card" data-category="${esc(p.category)}">
      <div class="portfolio-card__thumb">
        ${p.tag ? `<span class="portfolio-card__tag">${esc(p.tag)}</span>` : ''}
        <div class="portfolio-card__visual" style="background: ${esc(p.bg)};">
          ${iconSvg(p.icon, 64, p.color, 1.5)}
        </div>
      </div>
      <div class="portfolio-card__meta">
        <h3 class="portfolio-card__title">${esc(p.title)}</h3>
        <p style="font-size: 0.8438rem; color: var(--text-muted);">${esc(p.description)}</p>
        ${p.metric ? `
        <div class="portfolio-card__metric">
          ${METRIC_SVG[p.metric_icon] || METRIC_SVG.trend}
          <span>${esc(p.metric)}</span>
        </div>` : ''}
      </div>
    </article>`).join('');

  // Terapkan ulang filter yang sedang aktif
  const active = document.querySelector('.portfolio-filter-btn.active');
  if (active && active.getAttribute('data-filter') !== 'all') {
    applyPortfolioFilter(active.getAttribute('data-filter'));
  }
}

function renderPricing(tiers) {
  const grid = document.querySelector('.pricing-grid');
  if (!grid) return;

  grid.innerHTML = tiers.map(t => `
    <article class="pricing-card${t.featured ? ' pricing-card--featured' : ''}">
      ${t.featured ? '<span class="pricing-card__popular-badge">Paling Diminati</span>' : ''}
      <div>
        <h3 class="pricing-card__plan">${esc(t.plan)}</h3>
        <p class="pricing-card__desc">${esc(t.description)}</p>
        <div class="pricing-card__price-box">
          <span class="pricing-card__currency">Rp</span>
          <span class="pricing-card__amount">${esc(t.price)}</span>
          <span class="pricing-card__period">${esc(t.period)}</span>
        </div>
        <ul class="pricing-card__list">
          ${(t.features || []).map(f => `
          <li class="pricing-card__item">${CHECK_SVG}<span>${esc(f)}</span></li>`).join('')}
        </ul>
      </div>
      <a href="#contact" class="btn ${t.featured ? 'btn--primary' : 'btn--secondary'} btn--full">${esc(t.cta_label)}</a>
    </article>`).join('');

  // Sinkronkan pilihan paket di formulir pemesanan
  const select = document.getElementById('tier-select');
  if (select) {
    select.innerHTML = tiers.map(t => {
      const value = `${t.plan} (Rp ${t.price})`;
      const label = t.featured ? `${value} — Rekomendasi` : value;
      return `<option value="${esc(value)}"${t.featured ? ' selected' : ''}>${esc(label)}</option>`;
    }).join('') + '<option value="Konsultasi Terlebih Dahulu">Konsultasi Terlebih Dahulu</option>';
  }
}

function renderFaqs(faqs) {
  const list = document.querySelector('.faq-list');
  if (!list) return;

  list.innerHTML = faqs.map(f => `
    <div class="faq-item">
      <button class="faq-button" aria-expanded="false">
        <span>${esc(f.q)}</span>
        ${FAQ_CHEVRON}
      </button>
      <div class="faq-content">
        <p class="faq-answer">${esc(f.a)}</p>
      </div>
    </div>`).join('');
}
