-- ==========================================================================
-- VISUALGRID MEDIA — Supabase schema
-- Semua tabel memakai awalan vg_ supaya bisa berbagi satu proyek Supabase
-- dengan situs lain. Jalankan di Supabase Dashboard → SQL Editor → Run.
-- Aman dijalankan ulang (idempotent).
-- ==========================================================================

-- ---------- Admin (dipakai bersama situs lain di proyek yang sama) ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Skema privat: tidak dibuka lewat API, jadi fungsi ini tidak bisa dipanggil via /rpc.
create schema if not exists private;
grant usage on schema private to anon, authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

alter table public.admins enable row level security;
drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins
  for select to authenticated using (user_id = auth.uid());
grant select on public.admins to authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- Konten ----------
create table if not exists public.vg_services (
  id text primary key,
  sort int not null default 0,
  published boolean not null default true,
  title text not null,
  icon text not null default 'grid',
  turnaround text not null default '',
  description text not null default '',
  features text[] not null default '{}',
  cta_label text not null default 'Pesan Sekarang',
  updated_at timestamptz not null default now()
);

create table if not exists public.vg_portfolio (
  id text primary key,
  sort int not null default 0,
  published boolean not null default true,
  title text not null,
  category text not null check (category in ('instagram', 'video', 'event', 'cv')),
  tag text not null default '',
  description text not null default '',
  metric text not null default '',
  metric_icon text not null default 'trend' check (metric_icon in ('trend', 'check')),
  bg text not null default 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
  icon text not null default 'image',
  color text not null default '#38bdf8',
  updated_at timestamptz not null default now()
);

-- Media karya (opsional). Kosong = situs memakai media bawaan per id di js/main.js,
-- atau ikon bila id tidak dikenal. Lihat juga supabase/add-portfolio-media.sql.
alter table public.vg_portfolio add column if not exists media_type text not null default ''
  check (media_type in ('', 'image', 'video', 'pdf'));
alter table public.vg_portfolio add column if not exists media_url text not null default '';
alter table public.vg_portfolio add column if not exists media_poster text not null default '';

create table if not exists public.vg_pricing (
  id text primary key,
  sort int not null default 0,
  published boolean not null default true,
  plan text not null,
  description text not null default '',
  price text not null,
  period text not null default '/ per paket',
  features text[] not null default '{}',
  featured boolean not null default false,
  cta_label text not null default 'Pilih Paket',
  updated_at timestamptz not null default now()
);

create table if not exists public.vg_faqs (
  id bigint generated always as identity primary key,
  sort int not null default 0,
  published boolean not null default true,
  q text not null,
  a text not null,
  updated_at timestamptz not null default now()
);

-- Pengaturan situs: tepat satu baris (id = 1).
create table if not exists public.vg_settings (
  id smallint primary key default 1 check (id = 1),
  wa_number text not null check (wa_number ~ '^[0-9]{8,15}$'),
  slot_text text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------- Pesanan dari formulir kontak ----------
create table if not exists public.vg_orders (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  phone text not null check (char_length(phone) between 6 and 30),
  service text not null check (char_length(service) between 1 and 160),
  package text not null default '' check (char_length(package) <= 160),
  notes text not null default '' check (char_length(notes) <= 4000),
  status text not null default 'baru' check (status in ('baru', 'diproses', 'selesai', 'batal')),
  admin_note text not null default ''
);

create index if not exists vg_orders_created_at_idx on public.vg_orders (created_at desc);

-- ---------- updated_at otomatis ----------
do $$
declare t text;
begin
  foreach t in array array['vg_services', 'vg_portfolio', 'vg_pricing', 'vg_faqs', 'vg_settings'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format(
      'create trigger touch_%1$s before update on public.%1$s
       for each row execute function public.touch_updated_at()', t);
  end loop;
end;
$$;

-- ---------- Row Level Security ----------
alter table public.vg_services  enable row level security;
alter table public.vg_portfolio enable row level security;
alter table public.vg_pricing   enable row level security;
alter table public.vg_faqs      enable row level security;
alter table public.vg_settings  enable row level security;
alter table public.vg_orders    enable row level security;

-- Konten: publik membaca yang published; admin bisa semuanya.
do $$
declare t text;
begin
  foreach t in array array['vg_services', 'vg_portfolio', 'vg_pricing', 'vg_faqs'] loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format(
      'create policy "public read" on public.%I for select to anon, authenticated
       using (published or private.is_admin())', t);
    execute format('drop policy if exists "admin write" on public.%I', t);
    execute format(
      'create policy "admin write" on public.%I for all to authenticated
       using (private.is_admin()) with check (private.is_admin())', t);
  end loop;
end;
$$;

-- Pengaturan: publik membaca, hanya admin yang mengubah.
drop policy if exists "public read" on public.vg_settings;
create policy "public read" on public.vg_settings
  for select to anon, authenticated using (true);
drop policy if exists "admin update" on public.vg_settings;
create policy "admin update" on public.vg_settings
  for update to authenticated using (private.is_admin()) with check (private.is_admin());

-- Pesanan: siapa pun boleh mengirim (status harus 'baru'); hanya admin yang membaca/mengubah.
drop policy if exists "anyone submit" on public.vg_orders;
create policy "anyone submit" on public.vg_orders
  for insert to anon, authenticated
  with check (status = 'baru' and admin_note = '');
drop policy if exists "admin read" on public.vg_orders;
create policy "admin read" on public.vg_orders
  for select to authenticated using (private.is_admin());
drop policy if exists "admin update" on public.vg_orders;
create policy "admin update" on public.vg_orders
  for update to authenticated using (private.is_admin()) with check (private.is_admin());
drop policy if exists "admin delete" on public.vg_orders;
create policy "admin delete" on public.vg_orders
  for delete to authenticated using (private.is_admin());

-- ---------- Hak akses tabel ----------
revoke all on public.vg_services, public.vg_portfolio, public.vg_pricing, public.vg_faqs,
  public.vg_settings, public.vg_orders from anon, authenticated;
grant select on public.vg_services, public.vg_portfolio, public.vg_pricing, public.vg_faqs,
  public.vg_settings to anon, authenticated;
grant insert, update, delete on public.vg_services, public.vg_portfolio, public.vg_pricing,
  public.vg_faqs to authenticated;
grant update on public.vg_settings to authenticated;
grant insert on public.vg_orders to anon, authenticated;
grant select, update, delete on public.vg_orders to authenticated;
