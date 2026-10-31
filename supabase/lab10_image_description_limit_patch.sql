-- Run once in Supabase SQL Editor after lab8_school_memories.sql.
-- Existing descriptions longer than 200 characters remain readable.

begin;

alter table public.entries drop constraint if exists entries_image_description_length;
alter table public.entries add constraint entries_image_description_length
  check (image_description is null or char_length(trim(image_description)) between 10 and 200) not valid;

commit;

-- New and edited rows must have 10–200 non-whitespace characters.