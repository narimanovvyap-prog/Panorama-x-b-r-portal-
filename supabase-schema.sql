-- ============================================================
-- XƏBƏR SAYTI — SUPABASE SXEMİ
-- Bunu Supabase Dashboard -> SQL Editor -> New query bölməsinə
-- tam şəkildə yapışdırıb "Run" düyməsinə bas.
-- ============================================================

-- 1) Əsas cədvəl
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  category text not null,
  source text,
  image_url text,
  video_url text,
  is_featured boolean not null default false,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_category_idx on articles (category);
create index if not exists articles_created_idx on articles (created_at desc);
create index if not exists articles_views_idx on articles (views desc);

-- Mövcud layihələrdə cədvəl artıq yaradılıbsa video sütununu əlavə et.
alter table articles add column if not exists video_url text;

-- 2) Axtarış üçün tam mətn indeksi
create index if not exists articles_search_idx on articles
  using gin (to_tsvector('simple', title || ' ' || coalesce(excerpt,'') || ' ' || content));

-- 3) updated_at avtomatik yenilənsin
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_articles_updated_at on articles;
create trigger trg_articles_updated_at
  before update on articles
  for each row execute function set_updated_at();

-- 4) Baxış sayını təhlükəsiz artırmaq üçün funksiya
create or replace function increment_views(article_id uuid)
returns void as $$
begin
  update articles set views = views + 1 where id = article_id;
end;
$$ language plpgsql security definer;

-- 5) Row Level Security
alter table articles enable row level security;

-- Hər kəs oxuya bilsin (sayt ictimaidir)
drop policy if exists "Public read access" on articles;
create policy "Public read access" on articles
  for select using (true);

-- Yalnız daxil olmuş (admin) istifadəçi əlavə/redaktə/silmə edə bilsin
drop policy if exists "Authenticated insert" on articles;
create policy "Authenticated insert" on articles
  for insert to authenticated with check (true);

drop policy if exists "Authenticated update" on articles;
create policy "Authenticated update" on articles
  for update to authenticated using (true);

drop policy if exists "Authenticated delete" on articles;
create policy "Authenticated delete" on articles
  for delete to authenticated using (true);

-- ============================================================
-- ŞƏKİL YÜKLƏMƏ ÜÇÜN STORAGE BUCKET
-- Bu hissəni SQL Editor-da yox, Dashboard -> Storage bölməsində
-- əl ilə edəcəksən (README.md-də izah olunub), amma bucket
-- yaradıldıqdan sonra aşağıdakı policy-ləri buradan işə sala bilərsən:
-- ============================================================

-- Bucket-ları public yarat. Mövcud bucket-lar dəyişdirilmir.
insert into storage.buckets (id, name, public)
values
  ('xeber-sekiller', 'xeber-sekiller', true),
  ('xeber-videolari', 'xeber-videolari', true)
on conflict (id) do nothing;

-- Bucket adları: xeber-sekiller və xeber-videolari

drop policy if exists "Public image read" on storage.objects;
create policy "Public image read" on storage.objects
  for select using (bucket_id = 'xeber-sekiller');

drop policy if exists "Authenticated image upload" on storage.objects;
create policy "Authenticated image upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'xeber-sekiller');

drop policy if exists "Authenticated image delete" on storage.objects;
create policy "Authenticated image delete" on storage.objects
  for delete to authenticated using (bucket_id = 'xeber-sekiller');

drop policy if exists "Public video read" on storage.objects;
create policy "Public video read" on storage.objects
  for select using (bucket_id = 'xeber-videolari');

drop policy if exists "Authenticated video upload" on storage.objects;
create policy "Authenticated video upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'xeber-videolari');

drop policy if exists "Authenticated video delete" on storage.objects;
create policy "Authenticated video delete" on storage.objects
  for delete to authenticated using (bucket_id = 'xeber-videolari');
