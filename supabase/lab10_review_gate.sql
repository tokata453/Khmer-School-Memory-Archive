-- Lab 10: contributor review gate. Run once in Supabase SQL Editor after Lab 8.
-- Curator reviewer UUID: 7870004e-7f84-4440-bb7c-b9daaaf066ca.

begin;

-- Existing entries stay public. New entries wait for review.
update public.entries set status = 'published';
alter table public.entries drop constraint if exists entries_status_check;
alter table public.entries alter column status set default 'pending';
alter table public.entries add constraint entries_status_check
  check (status in ('pending', 'published', 'returned'));

-- SQL Editor manages this list. Data API roles have no table access.
create table if not exists public.reviewers (
  user_id uuid primary key references auth.users (id)
);
alter table public.reviewers enable row level security;
revoke all on table public.reviewers from public, anon, authenticated;
insert into public.reviewers (user_id)
values ('7870004e-7f84-4440-bb7c-b9daaaf066ca')
on conflict (user_id) do nothing;

create or replace function public.is_reviewer()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.reviewers
    where user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_reviewer() from public;
grant execute on function public.is_reviewer() to anon, authenticated;

drop policy "Anyone can read published entries" on public.entries;
create policy "Anyone can read published entries"
  on public.entries for select
  to anon, authenticated
  using (
    status = 'published'
    or (select auth.uid()) = owner_id
    or (select public.is_reviewer())
  );

drop policy "Authenticated users can create their entries" on public.entries;
create policy "Authenticated users can create their entries"
  on public.entries for insert
  to authenticated
  with check ((select auth.uid()) = owner_id and status = 'pending');

drop policy "Owners can update their entries" on public.entries;
create policy "Owners can update their entries"
  on public.entries for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check (
    (select auth.uid()) = owner_id
    and (status = 'pending' or (select public.is_reviewer()))
  );

-- Owners keep edit access, but every non-reviewer edit returns to the queue.
create or replace function public.queue_non_reviewer_entry_edit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not public.is_reviewer() then
    new.status := 'pending';
  end if;
  return new;
end;
$$;
drop trigger if exists queue_non_reviewer_entry_edit on public.entries;
create trigger queue_non_reviewer_entry_edit
  before update on public.entries
  for each row execute function public.queue_non_reviewer_entry_edit();

-- Only reviewers may change pending entries to published or returned.
create or replace function public.review_entry(entry_id bigint, decision text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_reviewer() or decision not in ('published', 'returned') then
    return false;
  end if;

  update public.entries
  set status = decision
  where id = entry_id and status = 'pending';

  return found;
end;
$$;
revoke all on function public.review_entry(bigint, text) from public, anon;
grant execute on function public.review_entry(bigint, text) to authenticated;

commit;

-- Verification. Run after commit; first query should show four entries policies.
select policyname, cmd
from pg_policies
where schemaname = 'public' and tablename = 'entries'
order by cmd, policyname;

select conname, pg_get_constraintdef(oid)
from pg_constraint
where conrelid = 'public.entries'::regclass and conname = 'entries_status_check';

select has_table_privilege('anon', 'public.reviewers', 'select') as anon_can_read_reviewers,
       has_table_privilege('authenticated', 'public.reviewers', 'select') as authenticated_can_read_reviewers,
       has_function_privilege('authenticated', 'public.review_entry(bigint, text)', 'execute') as authenticated_can_review;