# VisualGrid Media — Creative Services Website & Admin Dashboard

**English.** Website for a creative services studio: Instagram feeds and stories, cinematic short videos, product ads, event aftermovies, and ATS-friendly CVs. It has an interactive Three.js hero, a filterable portfolio, a before/after case study slider, pricing, an FAQ, and an order form that opens WhatsApp. The site is static (hosted on GitHub Pages). Services, portfolio, pricing, FAQ, site settings, and incoming orders live in [Supabase](https://supabase.com) and are managed from a login-protected admin dashboard at `/admin/`. If Supabase is not configured or unreachable, the site shows the static content in `index.html`.

**Bahasa Indonesia.** Situs untuk studio jasa kreatif: feed dan story Instagram, video pendek sinematik, video iklan produk, aftermovie event, dan CV ramah ATS. Ada hero 3D interaktif (Three.js), portofolio yang bisa difilter, slider studi kasus sebelum/sesudah, paket harga, FAQ, dan formulir pesanan yang membuka WhatsApp. Situsnya statis (di-hosting di GitHub Pages). Layanan, portofolio, paket harga, FAQ, pengaturan situs, dan pesanan yang masuk disimpan di [Supabase](https://supabase.com) dan dikelola dari dasbor admin berlogin di `/admin/`. Kalau Supabase belum diatur atau sedang tidak bisa diakses, situs menampilkan isi statis di `index.html`.

## Structure / Struktur

| Path | Isi |
|---|---|
| `index.html`, `css/`, `js/main.js`, `js/3d-scene.js` | Situs publik |
| `js/config.js` | URL dan publishable key Supabase |
| `js/api.js` | Membaca konten dari Supabase dan menyimpan pesanan |
| `js/icons.js` | Ikon SVG yang bisa dipilih admin |
| `js/portfolio-media.js` | Media bawaan tiap karya portofolio dan aturan pemilihan media (dipakai situs dan admin) |
| `assets/portfolio/`, `assets/case-study/` | Gambar, video, dan PDF portofolio; gambar slider studi kasus |
| `admin/` | Dasbor admin: pesanan, layanan, portofolio, paket harga, FAQ, pengaturan |
| `components/` | Versi mandiri tiap komponen (hero, layanan, harga, FAQ, dll.) |
| `supabase/schema.sql` | Tabel `vg_*`, Row Level Security, hak akses |
| `supabase/seed.sql` | Data awal (sama dengan isi statis `index.html`) |
| `supabase/add-portfolio-media.sql` | Migrasi kolom media portofolio untuk database lama |

## Admin dashboard / Dasbor admin

| Tab | Fungsi |
|---|---|
| Pesanan | Pesanan dari formulir kontak: ubah status (baru, diproses, selesai, batal), catatan internal, tautan WhatsApp klien |
| Layanan | Tambah, ubah, sembunyikan, atau hapus kartu layanan |
| Portofolio | Karya beserta kategori filter, warna kartu, ikon, dan metrik hasil |
| Paket Harga | Paket, harga, isi paket, dan tanda "Paling Diminati" |
| FAQ | Pertanyaan dan jawaban |
| Pengaturan | Nomor WhatsApp tujuan pesanan dan teks "Slot Tersedia" di header |

## Setup (Bahasa Indonesia)

1. **Buat proyek Supabase** di [supabase.com/dashboard](https://supabase.com/dashboard) (paket gratis cukup). Satu proyek boleh dipakai bersama situs lain karena semua tabel memakai awalan `vg_`.
2. **SQL Editor → New query**: tempel isi `supabase/schema.sql`, klik **Run**. Lalu tempel isi `supabase/seed.sql`, klik **Run**.
   Database yang dibuat sebelum ada fitur media portofolio: jalankan juga `supabase/add-portfolio-media.sql` sekali (aman diulang). Tanpa itu, isian media di admin tidak tersimpan dan tab Portofolio menampilkan peringatan.
3. **Authentication → Users → Add user → Create new user**: isi email dan kata sandi admin, centang *Auto Confirm User*.
4. Salin **User UID** user itu, lalu jalankan di SQL Editor:
   ```sql
   insert into public.admins (user_id) values ('TEMPEL-USER-UID-DI-SINI');
   ```
5. **Authentication → Sign In / Providers → Email**: matikan **Allow new users to sign up**.
6. **Project Settings → API Keys**: salin *Project URL* dan *Publishable key* ke `js/config.js`. **Jangan** pernah memakai *secret* / *service_role* key di situs.
7. Commit dan push. GitHub Pages memperbarui situs dalam 1–2 menit.

Admin masuk di `https://<username>.github.io/<repo>/admin/`.

## Setup (English)

1. Create a Supabase project (free tier is enough). It can be shared with other sites, since every table uses the `vg_` prefix.
2. In **SQL Editor**, run `supabase/schema.sql`, then `supabase/seed.sql`.
   Databases created before portfolio media existed: also run `supabase/add-portfolio-media.sql` once (safe to re-run). Until then, media fields in the admin are not saved and the Portfolio tab shows a warning.
3. **Authentication → Users → Add user**: create the admin account with *Auto Confirm User* checked.
4. Copy its **User UID** and run `insert into public.admins (user_id) values ('<uid>');`.
5. Disable **Allow new users to sign up** under Authentication → Sign In / Providers → Email.
6. Put the *Project URL* and *Publishable key* in `js/config.js`. Never put the *secret* / *service_role* key in the site.
7. Commit and push; GitHub Pages redeploys automatically.

## Security / Keamanan

- The publishable key is meant to be public. Access is enforced by Row Level Security in `supabase/schema.sql`: visitors can only read published content and submit orders; only users listed in `public.admins` can read orders or change content and settings.
- Kunci publishable memang publik. Pengamanan ada di Row Level Security: pengunjung hanya bisa membaca konten yang ditampilkan dan mengirim pesanan; hanya user di tabel `admins` yang bisa membaca pesanan atau mengubah konten dan pengaturan.
- Orders are saved in the background after WhatsApp opens; if saving fails, the WhatsApp message still goes through.

## Local preview / Pratinjau lokal

```bash
npx serve .
```
