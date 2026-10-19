-- Lab 7: run in Supabase SQL Editor. Safe to run again.
alter table public.entries add column if not exists photo_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "contributors upload into their own folder" on storage.objects;
create policy "contributors upload into their own folder" on storage.objects
for insert to authenticated
with check (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid()::text));

drop policy if exists "contributors delete their own photos" on storage.objects;
create policy "contributors delete their own photos" on storage.objects
for delete to authenticated
using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid()::text));

alter table public.entries drop constraint if exists entries_title_length;
alter table public.entries add constraint entries_title_length check (char_length(trim(title)) between 1 and 200);
alter table public.entries drop constraint if exists entries_category_length;
alter table public.entries add constraint entries_category_length check (char_length(trim(category)) between 1 and 120);
alter table public.entries drop constraint if exists entries_contributor_length;
alter table public.entries add constraint entries_contributor_length check (char_length(trim(contributor)) between 1 and 120);
alter table public.entries drop constraint if exists entries_place_length;
alter table public.entries add constraint entries_place_length check (char_length(trim(place)) between 1 and 120);
alter table public.entries drop constraint if exists entries_period_length;
alter table public.entries add constraint entries_period_length check (char_length(trim(period)) between 1 and 120);
alter table public.entries drop constraint if exists entries_featured_object_length;
alter table public.entries add constraint entries_featured_object_length check (char_length(trim(featured_object)) between 1 and 500);
alter table public.entries drop constraint if exists entries_excerpt_length;
alter table public.entries add constraint entries_excerpt_length check (char_length(trim(excerpt)) between 20 and 500);
alter table public.entries drop constraint if exists entries_memory_length;
alter table public.entries add constraint entries_memory_length check (char_length(trim(memory)) between 20 and 5000);
alter table public.entries drop constraint if exists entries_learning_method_length;
alter table public.entries add constraint entries_learning_method_length check (char_length(trim(learning_method)) between 20 and 5000);
alter table public.entries drop constraint if exists entries_reflection_length;
alter table public.entries add constraint entries_reflection_length check (char_length(trim(reflection)) between 20 and 5000);

-- Limit Data API privileges before RLS decides which rows each role may use.
revoke all on table public.entries from anon, authenticated;
grant select on table public.entries to anon, authenticated;
grant insert, update, delete on table public.entries to authenticated;
grant usage, select on sequence public.entries_id_seq to authenticated;

-- Console requests must obey same basic shape rules as form requests.
alter table public.entries drop constraint if exists entries_slug_length;
alter table public.entries add constraint entries_slug_length
  check (char_length(trim(slug)) between 1 and 80);
alter table public.entries drop constraint if exists entries_photo_url_format;
alter table public.entries add constraint entries_photo_url_format
  check (
    photo_url is null or (
      char_length(photo_url) <= 2048 and
      photo_url ~ '^https://[^/]+/storage/v1/object/public/photos/'
    )
  );

create index if not exists entries_owner_id_idx on public.entries (owner_id);
