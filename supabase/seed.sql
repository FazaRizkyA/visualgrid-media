-- ==========================================================================
-- VISUALGRID MEDIA — Data awal (sama dengan isi statis index.html)
-- Jalankan setelah schema.sql. Aman dijalankan ulang (tidak menimpa data).
-- ==========================================================================

insert into public.vg_settings (id, wa_number, slot_text)
values (1, '62895397081621', '3 Proyek Minggu Ini')
on conflict (id) do nothing;

insert into public.vg_services (id, sort, title, icon, turnaround, description, features, cta_label) values
('srv-feeds', 10, 'Instagram Feeds Cohesive', 'grid', 'Turnaround: 3-4 Hari',
 'Desain layout grid 9/12 feeds berkonsep terpadu. Membangun identitas visual konsisten dengan panduan palet warna, tipografi, dan format carousel edukatif/promosi.',
 array['Paket 9 atau 12 Grid Seamless/Puzzle', 'Format Carousel Multi-Slide Interaktif', 'File Siap Upload PNG/JPG + Source Figma/PSD'],
 'Pesan Feed Instagram'),
('srv-stories', 20, 'Instagram Stories & Highlight', 'story', 'Turnaround: 2 Hari',
 'Template stories dinamis berasio 9:16 untuk pengumuman, promo, dan testimoni. Dilengkapi ikon sorotan (highlight cover) kustom yang rapi dan profesional.',
 array['10-15 Template Story Editable', 'Set Icon Highlight Minimalis 3D/Vektor', 'Area Teks Teroptimasi Tombol Link/Stiker'],
 'Pesan Desain Story'),
('srv-reels', 30, 'Video Pendek Sinematik', 'video', 'Turnaround: 2-3 Hari',
 'Editing video vertikal (Reels, TikTok, Shorts) bertempo cepat dengan color grading sinematik kustom, efek suara (SFX) mendalam, dan subtitle dinamis yang mudah dibaca.',
 array['Hook Visual 3 Detik Pertama Berdaya Pikat', 'Color Grading LUTs Sinematik Khusus', 'Sound Design & Transisi Berenergi'],
 'Pesan Edit Video'),
('srv-ads', 40, 'Video Iklan Produk / Ads', 'ads', 'Turnaround: 4-5 Hari',
 'Produksi video promosi komersial dengan motion graphics tajam. Dirancang khusus untuk memacu rasio klik tayang (CTR) dan konversi penjualan di Meta & TikTok Ads.',
 array['Orientasi Rasio 9:16 (Vertikal) & 16:9 (Landscape)', 'Penekanan Pain-Point & Call to Action Visual', 'Voiceover AI Natural / Sinkronisasi Audio Bersih'],
 'Pesan Video Iklan'),
('srv-event', 50, 'Dokumentasi Event & Aftermovie', 'camera', 'Turnaround: 4-6 Hari',
 'Pengemasan rekaman acara (workshop, gathering korporat, konser, peluncuran produk) menjadi aftermovie sinematik 1-3 menit dan teaser kilat 60 detik.',
 array['Highlight Video Sinematik Resolusi 4K/FHD', 'Penyuntingan Suara Ambience Acara', 'Lisensi Musik Bebas Royalti untuk Media Sosial'],
 'Pesan Aftermovie Event'),
('srv-cv', 60, 'Format CV / Resume ATS', 'document', 'Turnaround: 24-48 Jam',
 'Desain CV modern dengan tata letak scannable yang ramah mesin Applicant Tracking System (ATS). Lengkap dengan panduan formulasi kalimat pencapaian STAR method.',
 array['Format 1-2 Halaman Teruji Lolos ATS Scanner', 'Template Surat Lamaran (Cover Letter) Serasi', 'File Output PDF Vektor Tajam + Dokumen Word/Canva'],
 'Pesan Desain CV')
on conflict (id) do nothing;

insert into public.vg_portfolio (id, sort, title, category, tag, description, metric, metric_icon, bg, icon, color) values
('pf-apparel', 10, 'Rebranding Grid Feed: Apparel Minimalis', 'instagram', 'Instagram Feed',
 '9 Grid Cohesive Editorial Style dengan tata letak tipografi Helvetica dan estetika netral monokrom.',
 '+315% Profile Visits & Followers Organik', 'trend',
 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)', 'image', '#38bdf8'),
('pf-coffee', 20, 'Cinematic Coffee Brewing: Artisan Roastery', 'video', 'Reels Sinematik',
 'Video reels 30 detik bertempo dinamis dengan color grading warm-mood dan sound design ASMR tetesan espresso.',
 '1.4 Juta Organic Views di Instagram & TikTok', 'trend',
 'radial-gradient(circle at center, #1e3a5f 0%, #0c1524 100%)', 'play', '#60a5fa'),
('pf-serum', 30, 'Direct Response Ad: Serum Botanik Alami', 'video', 'Commercial Ads',
 'Video iklan berfokus pada solusi masalah kulit kusam dengan hook visual 3 detik dan perbandingan split-screen.',
 'ROAS 4.8x pada Kampanye Meta Ads', 'trend',
 'radial-gradient(circle at center, #312e81 0%, #09090b 100%)', 'play-circle', '#a78bfa'),
('pf-meetup', 40, 'Aftermovie: Jakarta Tech Founders Meetup 2026', 'event', 'Event Aftermovie',
 'Dokumentasi video berdurasi 2 menit merangkum energi 500+ peserta, sesi pitching startup, dan malam networking.',
 'Diputar di Opening Keynote Tahunan', 'check',
 'radial-gradient(circle at center, #14532d 0%, #052e16 100%)', 'video', '#4ade80'),
('pf-clinic', 50, 'Story Kit & Highlight: Klinik Kecantikan Premium', 'instagram', 'Story & Highlight',
 'Paket 15 template story interaktif dengan ikon sorotan gradasi emas mawar untuk menu treatment dan testimoni.',
 '+88% DM Reservasi Treatment Baru', 'trend',
 'radial-gradient(circle at center, #701a75 0%, #1e1b4b 100%)', 'story', '#f472b6'),
('pf-cv', 60, 'Executive CV & Portfolio: Senior Product Manager', 'cv', 'Format CV ATS',
 'Desain CV 2 halaman dengan skor lolos uji ATS 98%, penataan metrik pencapaian yang terukur, dan surat lamaran serasi.',
 'Lolos Panggilan Interview di 4 Tech Unicorn', 'check',
 'radial-gradient(circle at center, #374151 0%, #111827 100%)', 'document', '#9ca3af')
on conflict (id) do nothing;

insert into public.vg_pricing (id, sort, plan, description, price, period, features, featured, cta_label) values
('tier-starter', 10, 'Starter Boost',
 'Sempurna untuk personal brand, UMKM perintis, atau pelamar kerja yang butuh hasil kilat.',
 '499K', '/ per paket',
 array['Pilihan: 6 Feed IG / 1 Video Sinematik / 1 CV ATS', '2x Kesempatan Revisi Minor', 'Durasi Pengerjaan: 2-3 Hari Kerja', 'Ekspor File HD Siap Publikasi'],
 false, 'Pilih Starter'),
('tier-pro', 20, 'Pro Creator Pack',
 'Pilihan ideal untuk bisnis online yang ingin konsisten tampil estetik dan meyakinkan pembeli.',
 '1.299K', '/ per paket',
 array['12 Feed Instagram Terpadu + 5 Story Template', 'Atau: 3 Video Reels Sinematik + Sound Design', '3x Kesempatan Revisi Bebas', 'File Mentahan Lengkap (Source File Figma/PSD/Pr)', 'Prioritas Dukungan Konsultasi WhatsApp'],
 true, 'Pilih Paket Pro'),
('tier-studio', 30, 'Brand Studio Scale',
 'Solusi komprehensif kampanye iklan produk penuh, dokumentasi event, atau retainer bulanan.',
 '2.999K', '/ per proyek',
 array['Full Identity: Feed, Highlight, Ads & Reels Pack', 'Atau: Dokumentasi Event Lengkap + Aftermovie 4K', 'Revisi Fleksibel Hingga Sesuai Ekspektasi', 'Hak Cipta Komersial Penuh & Dedicated Lead Editor'],
 false, 'Pilih Studio Scale')
on conflict (id) do nothing;

insert into public.vg_faqs (sort, q, a)
select v.sort, v.q, v.a
from (values
  (10, 'Berapa lama rata-rata durasi pengerjaan setiap proyek?',
   'Untuk layanan standar seperti Desain CV ATS atau Edit 1 Video Reels, draft pertama selesai dalam 24 hingga 48 jam. Untuk paket Instagram Feed terpadu (9/12 grid) dan Video Iklan Komersial membutuhkan waktu 3 hingga 5 hari kerja. Kami juga menyediakan opsi layanan kilat (Express 24 Jam) jika Anda memiliki tenggat waktu mendesak.'),
  (20, 'Bagaimana kebijakan dan batasan revisinya?',
   'Setiap paket mencakup garansi revisi minor (perubahan warna, font teks, penyesuaian copywriting, atau pemotongan durasi video). Kami selalu meminta brief terperinci di awal agar hasil kerja tahap pertama mendekati 90% ekspektasi Anda, sehingga proses revisi berjalan sangat singkat.'),
  (30, 'Apakah saya akan mendapatkan file mentahan (source files)?',
   'Ya! Untuk paket Pro Creator dan Brand Studio, semua file sumber mentah (seperti file Figma, Adobe Photoshop PSD, Premiere Pro Project, atau dokumen Word/Canva untuk CV) akan dikirimkan kepada Anda bersama dengan file ekspor resolusi tinggi (PNG/JPG/MP4 4K).'),
  (40, 'Bagaimana alur pembayaran yang berlaku?',
   'Kami menerapkan sistem pembayaran uang muka (Down Payment) sebesar 50% di awal setelah brief disepakati, dan pelunasan 50% sisanya setelah draft final disetujui sebelum pengiriman tautan file beresolusi penuh. Kami menerima transfer bank lokal dan e-wallet resmi.'),
  (50, 'Siapa yang memegang hak cipta atas karya visual yang dihasilkan?',
   'Hak cipta komersial penuh 100% dialihkan kepada Anda selaku klien setelah pembayaran lunas. Anda bebas menggunakannya untuk kebutuhan iklan berbayar, promosi digital, maupun cetak tanpa perlu membayar royalti tambahan kepada kami.')
) as v (sort, q, a)
where not exists (select 1 from public.vg_faqs);
