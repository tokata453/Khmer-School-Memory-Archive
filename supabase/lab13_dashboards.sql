-- Lab 13: reviewer and administrator dashboard data. Run after Lab 12.

begin;

create table if not exists public.entry_review_history (
  id bigint generated always as identity primary key,
  entry_id bigint not null references public.entries (id) on delete cascade,
  reviewer_id uuid not null references auth.users (id) on delete cascade,
  decision text not null check (decision in ('published', 'returned')),
  entry_slug text not null,
  entry_title text not null,
  created_at timestamptz not null default now()
);

-- These indexes match the reviewer and administrator activity feeds.
create index if not exists entry_review_history_reviewer_created_idx
on public.entry_review_history (reviewer_id, created_at desc);
create index if not exists entry_review_history_created_idx
on public.entry_review_history (created_at desc);

alter table public.entry_review_history enable row level security;
revoke all on table public.entry_review_history from public, anon, authenticated;
grant select on public.entry_review_history to authenticated;

create policy "Reviewers can read review history"
on public.entry_review_history for select to authenticated
using ((select public.is_reviewer()));

-- The browser cannot write history. This RPC records a decision and its audit
-- entry in one transaction, after confirming the reviewer is not the owner.
create or replace function public.review_entry(entry_id bigint, decision text, return_feedback text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_reviewer()
    or decision not in ('published', 'returned')
    or not exists (
      select 1 from public.entries
      where entries.id = review_entry.entry_id
        and entries.owner_id <> (select auth.uid())
    )
    or (decision = 'returned' and char_length(trim(coalesce(return_feedback, ''))) not between 5 and 1000) then
    return false;
  end if;

  update public.entries as archive_entry
  set status = decision
  where archive_entry.id = review_entry.entry_id and archive_entry.status = 'pending';
  if not found then return false; end if;

  insert into public.entry_review_history (entry_id, reviewer_id, decision, entry_slug, entry_title)
  select id, (select auth.uid()), decision, slug, title
  from public.entries where id = review_entry.entry_id;

  if decision = 'returned' then
    insert into public.entry_review_feedback (entry_id, reviewer_id, feedback)
    values (review_entry.entry_id, (select auth.uid()), trim(return_feedback))
    on conflict on constraint entry_review_feedback_pkey do update
      set reviewer_id = excluded.reviewer_id, feedback = excluded.feedback, returned_at = now();
  else
    delete from public.entry_review_feedback where entry_id = review_entry.entry_id;
  end if;
  return true;
end;
$$;
revoke all on function public.review_entry(bigint, text, text) from public, anon;
grant execute on function public.review_entry(bigint, text, text) to authenticated;

commit;

select policyname, cmd from pg_policies
where schemaname = 'public' and tablename = 'entry_review_history';
