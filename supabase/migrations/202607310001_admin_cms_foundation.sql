begin;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) > 0),
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  short_description text not null default '',
  description text not null default '',
  start_at timestamptz,
  end_at timestamptz,
  venue text not null default '',
  category text not null default '',
  status text not null default 'planned'
    check (status in ('completed', 'live', 'upcoming', 'planned')),
  poster_url text,
  registration_url text,
  registration_deadline timestamptz,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  display_order integer not null default 0 check (display_order >= 0),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_date_order check (
    end_at is null or start_at is null or end_at >= start_at
  ),
  constraint events_registration_deadline check (
    registration_deadline is null
    or (start_at is not null and registration_deadline <= start_at)
  )
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) > 0),
  role text not null check (char_length(trim(role)) > 0),
  member_group text not null check (char_length(trim(member_group)) > 0),
  year text not null default '',
  email text,
  is_email_public boolean not null default false,
  profile_image_url text,
  linkedin_url text,
  github_url text,
  display_order integer not null default 0 check (display_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint team_members_public_email check (
    is_email_public = false or email is not null
  )
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  message text not null check (char_length(trim(message)) > 0),
  priority text not null default 'normal'
    check (priority in ('normal', 'important', 'urgent')),
  link_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  is_published boolean not null default false,
  is_pinned boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint announcements_date_order check (
    ends_at is null or starts_at is null or ends_at >= starts_at
  )
);

create index if not exists events_public_listing_idx
  on public.events (is_published, status, display_order, start_at);
create index if not exists events_featured_idx
  on public.events (is_featured, is_published, display_order);
create index if not exists team_members_public_listing_idx
  on public.team_members (is_active, member_group, display_order);
create index if not exists announcements_public_listing_idx
  on public.announcements (is_published, is_pinned, starts_at, ends_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists team_members_set_updated_at on public.team_members;
create trigger team_members_set_updated_at
before update on public.team_members
for each row execute function public.set_updated_at();

drop trigger if exists announcements_set_updated_at on public.announcements;
create trigger announcements_set_updated_at
before update on public.announcements
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.swap_team_member_order(
  first_id uuid,
  second_id uuid
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  first_order integer;
  second_order integer;
begin
  if not public.is_admin() then
    raise exception 'administrator access required';
  end if;

  select display_order into first_order
  from public.team_members
  where id = first_id;

  select display_order into second_order
  from public.team_members
  where id = second_id;

  if first_order is null or second_order is null then
    raise exception 'team member not found';
  end if;

  update public.team_members
  set display_order = case
    when id = first_id then second_order
    when id = second_id then first_order
    else display_order
  end
  where id in (first_id, second_id);
end;
$$;

revoke all on function public.swap_team_member_order(uuid, uuid) from public;
grant execute on function public.swap_team_member_order(uuid, uuid)
  to authenticated;

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.team_members enable row level security;
alter table public.announcements enable row level security;

drop policy if exists profiles_read_own on public.profiles;
create policy profiles_read_own
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists profiles_admin_manage on public.profiles;
create policy profiles_admin_manage
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists events_public_read on public.events;
create policy events_public_read
on public.events
for select
to anon, authenticated
using (is_published = true);

drop policy if exists events_admin_manage on public.events;
create policy events_admin_manage
on public.events
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists team_members_public_read on public.team_members;
create policy team_members_public_read
on public.team_members
for select
to anon
using (is_active = true);

drop policy if exists team_members_admin_manage on public.team_members;
create policy team_members_admin_manage
on public.team_members
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists announcements_public_read on public.announcements;
create policy announcements_public_read
on public.announcements
for select
to anon, authenticated
using (
  is_published = true
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);

drop policy if exists announcements_admin_manage on public.announcements;
create policy announcements_admin_manage
on public.announcements
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

revoke all on public.profiles from anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;

revoke all on public.events from anon, authenticated;
grant select on public.events to anon;
grant select, insert, update, delete on public.events to authenticated;

revoke all on public.team_members from anon, authenticated;
grant select (
  id,
  full_name,
  role,
  member_group,
  year,
  is_email_public,
  profile_image_url,
  linkedin_url,
  github_url,
  display_order,
  is_active,
  created_at,
  updated_at
) on public.team_members to anon;
grant select, insert, update, delete on public.team_members to authenticated;

revoke all on public.announcements from anon, authenticated;
grant select on public.announcements to anon;
grant select, insert, update, delete on public.announcements to authenticated;

create or replace view public.public_team_members
with (security_barrier = true)
as
select
  id,
  full_name,
  role,
  member_group,
  year,
  case when is_email_public then email else null end as email,
  is_email_public,
  profile_image_url,
  linkedin_url,
  github_url,
  display_order
from public.team_members
where is_active = true;

revoke all on public.public_team_members from public;
grant select on public.public_team_members to anon, authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'event-posters',
  'event-posters',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists event_posters_public_read on storage.objects;
create policy event_posters_public_read
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'event-posters');

drop policy if exists event_posters_admin_insert on storage.objects;
create policy event_posters_admin_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'event-posters'
  and public.is_admin()
);

drop policy if exists event_posters_admin_update on storage.objects;
create policy event_posters_admin_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'event-posters'
  and public.is_admin()
)
with check (
  bucket_id = 'event-posters'
  and public.is_admin()
);

drop policy if exists event_posters_admin_delete on storage.objects;
create policy event_posters_admin_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'event-posters'
  and public.is_admin()
);

commit;
