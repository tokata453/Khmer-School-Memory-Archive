-- Lab 11: durable in-app notifications. Run after the Lab 10 review SQL.
-- Notification rows are created by database triggers, never by the browser.

begin;

create schema if not exists private;

create table if not exists public.notifications (
id bigint generated always as identity primary key,
recipient_id uuid not null references auth.users (id) on delete cascade,
entry_id bigint not null references public.entries (id) on delete cascade,
event_type text not null check (event_type in (
  'entry_submitted', 'entry_resubmitted', 'entry_published', 'entry_returned'
)),
entry_slug text not null,
entry_title text not null,
created_at timestamptz not null default now(),
read_at timestamptz
);

-- This index matches the inbox query: one recipient, newest notifications first.
create index if not exists notifications_recipient_created_idx
on public.notifications (recipient_id, created_at desc);

alter table public.notifications enable row level security;
revoke all on table public.notifications from public, anon, authenticated;
grant select on table public.notifications to authenticated;
-- Column-level access prevents browser clients from changing notification data.
grant update (read_at) on table public.notifications to authenticated;

create policy "Recipients can read their notifications"
on public.notifications for select
to authenticated
using ((select auth.uid()) = recipient_id);

create policy "Recipients can mark their notifications read"
on public.notifications for update
to authenticated
using ((select auth.uid()) = recipient_id)
with check ((select auth.uid()) = recipient_id);

-- The trigger runs in the entry transaction, so a review outcome and its
-- notification either both succeed or both roll back.
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

-- Reviewers receive queue alerts, except for an entry's own contributor.
insert into public.notifications (recipient_id, entry_id, event_type, entry_slug, entry_title)
select reviewers.user_id, new.id, notification_type, new.slug, new.title
from public.reviewers
where reviewers.user_id <> new.owner_id;

return new;
end;
$$;
-- Browser clients cannot call this privileged function directly. It executes
-- only through the entry triggers below, after entries RLS has authorized the
-- original insert or update.
revoke all on function private.create_entry_notifications() from public, anon, authenticated;

drop trigger if exists notify_on_entry_insert on public.entries;
create trigger notify_on_entry_insert
after insert on public.entries
for each row execute function private.create_entry_notifications();

drop trigger if exists notify_on_entry_status_change on public.entries;
create trigger notify_on_entry_status_change
after update of status on public.entries
for each row execute function private.create_entry_notifications();

commit;

-- Verification: recipients should see only their own rows, and browser roles
-- should have no INSERT or DELETE permission.
select has_table_privilege('anon', 'public.notifications', 'select,insert,update,delete') as anon_has_access,
      has_table_privilege('authenticated', 'public.notifications', 'insert,delete') as users_can_write_notifications;
