-- ============================================================================
-- MIGRASI: kolom media untuk portofolio (gambar / video / PDF)
-- Jalankan SEKALI di Supabase Dashboard → SQL Editor untuk database yang sudah
-- dibuat dengan schema.sql versi lama. Aman dijalankan ulang.
--
-- media_type   : '' (otomatis dari ekstensi), 'image', 'video', atau 'pdf'
-- media_url    : https://... atau path di repo, contoh assets/portfolio/x.jpg
-- media_poster : gambar sampul untuk video / pratinjau PDF (opsional)
--
-- Bila media_url kosong, situs memakai media bawaan per id (lihat
-- PORTFOLIO_MEDIA di js/main.js), jadi karya bawaan tetap tampil bergambar.
-- ============================================================================
alter table public.vg_portfolio add column if not exists media_type text not null default ''
  check (media_type in ('', 'image', 'video', 'pdf'));
alter table public.vg_portfolio add column if not exists media_url text not null default '';
alter table public.vg_portfolio add column if not exists media_poster text not null default '';

-- Muat ulang cache skema PostgREST agar kolom baru langsung bisa dipakai.
notify pgrst, 'reload schema';
