-- Lab 9: permanent cleanup after lab8_school_memories.sql.
-- Run once in Supabase SQL Editor only after confirming old entry data is no longer needed.
-- This deletes values in these columns. It cannot be undone from the database.

alter table public.entries
  drop column if exists category,
  drop column if exists contributor,
  drop column if exists place,
  drop column if exists period,
  drop column if exists featured_object,
  drop column if exists excerpt,
  drop column if exists memory,
  drop column if exists learning_method,
  drop column if exists reflection;

-- Verify the image-first shape after running this file.
select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'entries'
order by ordinal_position;