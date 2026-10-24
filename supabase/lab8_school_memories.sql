-- Lab 8: image-first school memories. Run after lab7_entries.sql.
-- Existing rows remain visible. Fill their new fields before making columns NOT NULL.
alter table public.entries
  add column if not exists image_description text,
  add column if not exists story text,
  add column if not exists province text,
  add column if not exists school_level text,
  add column if not exists memory_year integer,
  add column if not exists place_time_details text,
  add column if not exists display_name text;

update public.entries
set story = memory
where story is null and memory is not null;

update public.entries
set display_name = contributor
where display_name is null and contributor is not null;

-- Keep retired columns during verification, but allow new image-first entries to omit them.
alter table public.entries
  alter column category drop not null,
  alter column contributor drop not null,
  alter column place drop not null,
  alter column period drop not null,
  alter column featured_object drop not null,
  alter column excerpt drop not null,
  alter column memory drop not null,
  alter column learning_method drop not null,
  alter column reflection drop not null;

alter table public.entries drop constraint if exists entries_category_length;
alter table public.entries drop constraint if exists entries_contributor_length;
alter table public.entries drop constraint if exists entries_place_length;
alter table public.entries drop constraint if exists entries_period_length;
alter table public.entries drop constraint if exists entries_featured_object_length;
alter table public.entries drop constraint if exists entries_excerpt_length;
alter table public.entries drop constraint if exists entries_memory_length;
alter table public.entries drop constraint if exists entries_learning_method_length;
alter table public.entries drop constraint if exists entries_reflection_length;

alter table public.entries drop constraint if exists entries_image_description_length;
alter table public.entries add constraint entries_image_description_length
  check (image_description is null or char_length(trim(image_description)) between 10 and 500);
alter table public.entries drop constraint if exists entries_story_length;
alter table public.entries add constraint entries_story_length
  check (story is null or char_length(trim(story)) between 20 and 5000);
alter table public.entries drop constraint if exists entries_province_allowed;
alter table public.entries add constraint entries_province_allowed check (province is null or province in ('Banteay Meanchey', 'Battambang', 'Kampong Cham', 'Kampong Chhnang', 'Kampong Speu', 'Kampong Thom', 'Kampot', 'Kandal', 'Kep', 'Koh Kong', 'Kratie', 'Mondulkiri', 'Oddar Meanchey', 'Pailin', 'Phnom Penh', 'Preah Vihear', 'Preah Sihanouk', 'Prey Veng', 'Pursat', 'Ratanakiri', 'Siem Reap', 'Stung Treng', 'Svay Rieng', 'Takeo', 'Tboung Khmum'));
alter table public.entries drop constraint if exists entries_school_level_allowed;
alter table public.entries add constraint entries_school_level_allowed check (school_level is null or school_level in ('primary_school', 'secondary_school', 'high_school', 'university', 'other'));
alter table public.entries drop constraint if exists entries_memory_year_range;
alter table public.entries add constraint entries_memory_year_range check (memory_year is null or memory_year between 1900 and extract(year from current_date));
alter table public.entries drop constraint if exists entries_place_time_details_length;
alter table public.entries add constraint entries_place_time_details_length check (place_time_details is null or char_length(trim(place_time_details)) <= 200);
alter table public.entries drop constraint if exists entries_display_name_length;
alter table public.entries add constraint entries_display_name_length check (display_name is null or char_length(trim(display_name)) between 1 and 120);

create index if not exists entries_published_province_idx on public.entries (province) where status = 'published';
create index if not exists entries_published_school_level_idx on public.entries (school_level) where status = 'published';
create index if not exists entries_published_memory_year_idx on public.entries (memory_year) where status = 'published';