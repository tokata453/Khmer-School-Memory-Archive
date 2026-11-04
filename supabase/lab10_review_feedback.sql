-- Lab 10 follow-up: reviewer feedback. Run after lab10_review_gate.sql.
-- A returned entry must include a clear note for its contributor.

begin;

create table if not exists public.entry_review_feedback (
  entry_id bigint primary key references public.entries (id) on delete cascade,
  reviewer_id uuid not null references auth.users (id),
  feedback text not null check (char_length(trim(feedback)) between 5 and 1000),
  returned_at timestamptz not null default now()
);

-- Contributors cannot write feedback directly; the review RPC below does it.
alter table public.entry_review_feedback enable row level security;
revoke all on table public.entry_review_feedback from public, anon, authenticated;
grant select on table public.entry_review_feedback to authenticated;

drop policy if exists "Reviewers and owners can read review feedback" on public.entry_review_feedback;
create policy "Reviewers and owners can read review feedback"
  on public.entry_review_feedback for select
  to authenticated
  using (
    -- A reviewer can see notes while reviewing; an owner can see feedback on
    -- their returned entry. Other contributors cannot see either.
    (select public.is_reviewer())
    or exists (
      select 1 from public.entries
      where entries.id = entry_review_feedback.entry_id
        and entries.owner_id = (select auth.uid())
    )
  );

drop function if exists public.review_entry(bigint, text);
-- Replaces the original two-argument RPC so a return decision includes feedback.
-- OR REPLACE lets this patch safely correct an earlier version of this function.
create or replace function public.review_entry(entry_id bigint, decision text, return_feedback text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- This is the authorization boundary. The browser cannot publish its own
  -- entry, return an entry without feedback, or decide an entry twice.
  if not public.is_reviewer()
    or decision not in ('published', 'returned')
    or not exists (
      select 1 from public.entries
      -- Qualifying entry_id identifies the function argument, not a table column.
      where entries.id = review_entry.entry_id
        and entries.owner_id <> (select auth.uid())
    )
    or (
      decision = 'returned'
      and char_length(trim(coalesce(return_feedback, ''))) not between 5 and 1000
    ) then
    return false;
  end if;

  update public.entries as archive_entry
  set status = decision
  where archive_entry.id = review_entry.entry_id
    and archive_entry.status = 'pending';

  if not found then return false; end if;

  if decision = 'returned' then
    -- Keep the latest return note for this entry so its owner knows what to fix.
    insert into public.entry_review_feedback (entry_id, reviewer_id, feedback)
    values (review_entry.entry_id, (select auth.uid()), trim(return_feedback))
    on conflict on constraint entry_review_feedback_pkey do update
      set reviewer_id = excluded.reviewer_id,
          feedback = excluded.feedback,
          returned_at = now();
  else
    -- Once published, an old return note is no longer needed.
    delete from public.entry_review_feedback as review_feedback
    where review_feedback.entry_id = review_entry.entry_id;
  end if;

  return true;
end;
$$;
revoke all on function public.review_entry(bigint, text, text) from public, anon;
grant execute on function public.review_entry(bigint, text, text) to authenticated;

commit;

-- Expected: only reviewers and the entry owner can see feedback.
select policyname, cmd from pg_policies
where schemaname = 'public' and tablename = 'entry_review_feedback';
