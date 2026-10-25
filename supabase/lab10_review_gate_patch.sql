-- Lab 10 patch: run once on databases where lab10_review_gate.sql already ran.
-- Does not change existing entry statuses.

begin;

revoke all on table public.reviewers from public, anon, authenticated;
grant insert on table public.reviewers to authenticated;

create or replace function public.queue_non_reviewer_entry_edit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- Normal owner edits return to pending. Explicit status escalation reaches
  -- the entries UPDATE policy, which rejects non-reviewers.
  if not public.is_reviewer() and new.status is not distinct from old.status then
    new.status := 'pending';
  end if;
  return new;
end;
$$;

commit;

-- Expected: authenticated_insert_reaches_rls = true, reviewer_insert_policies = 0.
select has_table_privilege('authenticated', 'public.reviewers', 'insert')
  as authenticated_insert_reaches_rls,
  count(*) filter (where cmd in ('INSERT', 'ALL')) as reviewer_insert_policies
from pg_policies
where schemaname = 'public' and tablename = 'reviewers';