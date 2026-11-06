-- Lab 12: application roles and archive administration. Run after Lab 11.
-- Replace the UUID below if the archive curator uses a different account.

begin;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  user_name text not null default '',
  created_at timestamptz not null default now()
);

-- Auth is not exposed through the Data API. This limited directory is kept in
-- public so an authorized archive admin can choose accounts by name and email.
create or replace function public.sync_profile_from_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, user_name, created_at)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'user_name', ''), new.created_at)
  on conflict (id) do update set
    email = excluded.email,
    user_name = excluded.user_name;
  return new;
end;
$$;
revoke all on function public.sync_profile_from_auth_user() from public, anon, authenticated;

drop trigger if exists sync_profile_on_auth_user_change on auth.users;
create trigger sync_profile_on_auth_user_change
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.sync_profile_from_auth_user();

insert into public.profiles (id, email, user_name, created_at)
select id, email, coalesce(raw_user_meta_data ->> 'user_name', ''), created_at
from auth.users
on conflict (id) do update set email = excluded.email, user_name = excluded.user_name;

create table if not exists public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'reviewer')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

-- Keep any existing Lab 10 reviewer assignments before retiring that table.
insert into public.user_roles (user_id, role)
select user_id, 'reviewer' from public.reviewers
on conflict (user_id, role) do nothing;
insert into public.user_roles (user_id, role)
values ('7870004e-7f84-4440-bb7c-b9daaaf066ca', 'admin')
on conflict (user_id, role) do nothing;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
revoke all on table public.profiles, public.user_roles from public, anon, authenticated;
grant select on public.profiles, public.user_roles to authenticated;
grant insert, delete on public.user_roles to authenticated;

-- These role checks read the protected table without exposing its membership.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role = 'admin'
  );
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create or replace function public.is_reviewer()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select public.is_admin()) or exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role = 'reviewer'
  );
$$;
revoke all on function public.is_reviewer() from public, anon;
grant execute on function public.is_reviewer() to authenticated;

create or replace function public.keep_at_least_one_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.role = 'admin' and not exists (
    select 1 from public.user_roles
    where role = 'admin' and user_id <> old.user_id
  ) then
    raise exception 'The archive must keep at least one admin';
  end if;
  return old;
end;
$$;
revoke all on function public.keep_at_least_one_admin() from public, anon, authenticated;

drop trigger if exists keep_at_least_one_admin on public.user_roles;
create trigger keep_at_least_one_admin
before delete or update of role on public.user_roles
for each row execute function public.keep_at_least_one_admin();

create policy "Admins can read the account directory"
on public.profiles for select to authenticated
using ((select public.is_admin()));

create policy "Admins can read archive roles"
on public.user_roles for select to authenticated
using ((select public.is_admin()));

create policy "Admins can add archive roles"
on public.user_roles for insert to authenticated
with check ((select public.is_admin()));

create policy "Admins can remove archive roles"
on public.user_roles for delete to authenticated
using ((select public.is_admin()));

-- Lab 11 originally notified public.reviewers. Read the new role table so
-- reviewers added from /admin, and admins, receive future queue alerts too.
create or replace function private.create_entry_notifications()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  notification_type text;
begin
  if tg_op = 'INSERT' and new.status = 'pending' then
    notification_type := 'entry_submitted';
  elsif tg_op = 'UPDATE' and old.status <> 'pending' and new.status = 'pending' then
    notification_type := 'entry_resubmitted';
  elsif tg_op = 'UPDATE' and old.status = 'pending' and new.status = 'published' then
    insert into public.notifications (recipient_id, entry_id, event_type, entry_slug, entry_title)
    values (new.owner_id, new.id, 'entry_published', new.slug, new.title);
    return new;
  elsif tg_op = 'UPDATE' and old.status = 'pending' and new.status = 'returned' then
    insert into public.notifications (recipient_id, entry_id, event_type, entry_slug, entry_title)
    values (new.owner_id, new.id, 'entry_returned', new.slug, new.title);
    return new;
  else
    return new;
  end if;

  insert into public.notifications (recipient_id, entry_id, event_type, entry_slug, entry_title)
  select distinct user_id, new.id, notification_type, new.slug, new.title
  from public.user_roles
  where role in ('admin', 'reviewer') and user_id <> new.owner_id;
  return new;
end;
$$;
revoke all on function private.create_entry_notifications() from public, anon, authenticated;

-- Admins may manage entries, but no browser user may set an entry's status.
-- The review_entry RPC below remains the sole publish/return route.
drop policy if exists "Anyone can read published entries" on public.entries;
create policy "Published entries, owners, and reviewers can read"
on public.entries for select to anon, authenticated
using (
  status = 'published'
  or (select auth.uid()) = owner_id
  or (select public.is_reviewer())
);

drop policy if exists "Owners can update their entries" on public.entries;
create policy "Owners and admins can update entries"
on public.entries for update to authenticated
using ((select auth.uid()) = owner_id or (select public.is_admin()))
with check (status = 'pending');

drop policy if exists "Owners can delete their entries" on public.entries;
create policy "Owners and admins can delete entries"
on public.entries for delete to authenticated
using ((select auth.uid()) = owner_id or (select public.is_admin()));

-- Every direct edit is returned to the review queue, including an admin edit.
create or replace function public.queue_non_reviewer_entry_edit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status is not distinct from old.status then
    new.status := 'pending';
  end if;
  return new;
end;
$$;

-- Replace the Lab 10 function so reviewers and admins cannot decide on their
-- own entries. SECURITY DEFINER is needed only for the protected status change.
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

-- Verify role and entry access after the migration.
select policyname, cmd from pg_policies
where schemaname = 'public' and tablename in ('profiles', 'user_roles', 'entries')
order by tablename, cmd, policyname;
