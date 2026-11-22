-- Lab 15: fix review_entry parameter ambiguity.
-- Run once in the Supabase SQL Editor after lab13_dashboards.sql.

begin;

-- The RPC keeps named arguments for the browser API, but its body uses $1,
-- $2, and $3 so PostgreSQL never confuses an argument with a table column.
create or replace function public.review_entry(entry_id bigint, decision text, return_feedback text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_reviewer()
    or $2 not in ('published', 'returned')
    or not exists (
      select 1 from public.entries
      where entries.id = $1
        and entries.owner_id <> (select auth.uid())
    )
    or ($2 = 'returned' and char_length(trim(coalesce($3, ''))) not between 5 and 1000) then
    return false;
  end if;

  update public.entries as archive_entry
  set status = $2
  where archive_entry.id = $1
    and archive_entry.status = 'pending';
  if not found then return false; end if;

  insert into public.entry_review_history (entry_id, reviewer_id, decision, entry_slug, entry_title)
  select id, (select auth.uid()), $2, slug, title
  from public.entries where id = $1;

  if $2 = 'returned' then
    insert into public.entry_review_feedback (entry_id, reviewer_id, feedback)
    values ($1, (select auth.uid()), trim($3))
    on conflict on constraint entry_review_feedback_pkey do update
      set reviewer_id = excluded.reviewer_id,
          feedback = excluded.feedback,
          returned_at = now();
  else
    delete from public.entry_review_feedback as review_feedback
    where review_feedback.entry_id = $1;
  end if;
  return true;
end;
$$;

revoke all on function public.review_entry(bigint, text, text) from public, anon;
grant execute on function public.review_entry(bigint, text, text) to authenticated;

commit;

-- Verification: the returned definition should include $1, $2, and $3.
select pg_get_functiondef('public.review_entry(bigint, text, text)'::regprocedure);
