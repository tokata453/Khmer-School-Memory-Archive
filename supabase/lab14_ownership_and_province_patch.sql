-- Lab 14: final ownership and province consistency patch.
-- Run once in the Supabase SQL Editor after lab12_admin_roles.sql.

begin;

-- Keep the form's Cambodia-wide "Other" option valid at the database layer.
alter table public.entries drop constraint if exists entries_province_allowed;
alter table public.entries add constraint entries_province_allowed
  check (province is null or province in (
    'Banteay Meanchey', 'Battambang', 'Kampong Cham', 'Kampong Chhnang',
    'Kampong Speu', 'Kampong Thom', 'Kampot', 'Kandal', 'Kep', 'Koh Kong',
    'Kratie', 'Mondulkiri', 'Oddar Meanchey', 'Pailin', 'Phnom Penh',
    'Preah Vihear', 'Preah Sihanouk', 'Prey Veng', 'Pursat', 'Ratanakiri',
    'Siem Reap', 'Stung Treng', 'Svay Rieng', 'Takeo', 'Tboung Khmum', 'Other'
  ));

-- RLS checks the updated row as well as the existing row. Contributors must
-- remain the owner after their update; administrators may edit a record but
-- cannot transfer it to another account.
drop policy if exists "Owners and admins can update entries" on public.entries;
create policy "Owners and admins can update entries"
on public.entries for update to authenticated
using (
  (select auth.uid()) = owner_id
  or (select public.is_admin())
)
with check (
  status = 'pending'
  and (
    (select auth.uid()) = owner_id
    or (select public.is_admin())
  )
);

-- RLS cannot compare OLD and NEW ownership values in one policy expression.
-- This trigger closes that gap for every client, including administrators.
create or replace function public.keep_entry_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.owner_id is distinct from old.owner_id then
    raise exception 'Entry ownership cannot be changed';
  end if;
  return new;
end;
$$;

revoke all on function public.keep_entry_owner() from public, anon, authenticated;

drop trigger if exists keep_entry_owner on public.entries;
create trigger keep_entry_owner
before update on public.entries
for each row execute function public.keep_entry_owner();

commit;

-- Verification: run after the transaction. The policy should show both USING
-- and WITH CHECK expressions, and the trigger should be listed on entries.
select policyname, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'entries'
  and policyname = 'Owners and admins can update entries';

select tgname
from pg_trigger
where tgrelid = 'public.entries'::regclass
  and not tgisinternal
  and tgname = 'keep_entry_owner';
