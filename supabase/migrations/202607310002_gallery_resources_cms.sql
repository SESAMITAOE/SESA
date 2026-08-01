begin;

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(btrim(title)) > 0),
  caption text not null default '',
  alt_text text not null check (length(btrim(alt_text)) > 0),
  image_url text,
  storage_path text unique,
  category text not null default 'General' check (length(btrim(category)) > 0),
  event_id uuid references public.events(id) on delete set null,
  captured_at timestamptz,
  display_order integer not null default 0 check (display_order >= 0),
  is_featured boolean not null default false,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gallery_items_published_image check (
    not is_published or image_url is not null or storage_path is not null
  )
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(btrim(title)) > 0),
  description text not null check (length(btrim(description)) > 0),
  category text not null default 'General' check (length(btrim(category)) > 0),
  resource_type text not null default 'other' check (
    resource_type in ('document', 'link', 'video', 'repository', 'guide', 'other')
  ),
  external_url text,
  file_url text,
  storage_path text unique,
  audience text,
  academic_year text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  display_order integer not null default 0 check (display_order >= 0),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resources_published_destination check (
    not is_published
    or external_url is not null
    or file_url is not null
    or storage_path is not null
  )
);

create index if not exists gallery_items_public_listing_idx
  on public.gallery_items (
    is_published,
    is_featured desc,
    display_order,
    captured_at desc,
    created_at desc
  );

create index if not exists gallery_items_event_idx
  on public.gallery_items (event_id)
  where event_id is not null;

create index if not exists resources_public_listing_idx
  on public.resources (
    is_published,
    is_featured desc,
    display_order,
    created_at desc
  );

drop trigger if exists gallery_items_set_updated_at on public.gallery_items;
create trigger gallery_items_set_updated_at
before update on public.gallery_items
for each row execute function public.set_updated_at();

drop trigger if exists resources_set_updated_at on public.resources;
create trigger resources_set_updated_at
before update on public.resources
for each row execute function public.set_updated_at();

create or replace function public.swap_gallery_item_order(
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
  from public.gallery_items
  where id = first_id;

  select display_order into second_order
  from public.gallery_items
  where id = second_id;

  if first_order is null or second_order is null then
    raise exception 'gallery item not found';
  end if;

  update public.gallery_items
  set display_order = case
    when id = first_id then second_order
    when id = second_id then first_order
    else display_order
  end
  where id in (first_id, second_id);
end;
$$;

create or replace function public.swap_resource_order(
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
  from public.resources
  where id = first_id;

  select display_order into second_order
  from public.resources
  where id = second_id;

  if first_order is null or second_order is null then
    raise exception 'resource not found';
  end if;

  update public.resources
  set display_order = case
    when id = first_id then second_order
    when id = second_id then first_order
    else display_order
  end
  where id in (first_id, second_id);
end;
$$;

revoke all on function public.swap_gallery_item_order(uuid, uuid) from public;
grant execute on function public.swap_gallery_item_order(uuid, uuid)
  to authenticated;

revoke all on function public.swap_resource_order(uuid, uuid) from public;
grant execute on function public.swap_resource_order(uuid, uuid)
  to authenticated;

alter table public.gallery_items enable row level security;
alter table public.resources enable row level security;

drop policy if exists gallery_items_public_read on public.gallery_items;
create policy gallery_items_public_read
on public.gallery_items
for select
to anon, authenticated
using (is_published = true);

drop policy if exists gallery_items_admin_manage on public.gallery_items;
create policy gallery_items_admin_manage
on public.gallery_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists resources_public_read on public.resources;
create policy resources_public_read
on public.resources
for select
to anon, authenticated
using (is_published = true);

drop policy if exists resources_admin_manage on public.resources;
create policy resources_admin_manage
on public.resources
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

revoke all on public.gallery_items from anon, authenticated;
grant select on public.gallery_items to anon;
grant select, insert, update, delete on public.gallery_items to authenticated;

revoke all on public.resources from anon, authenticated;
grant select on public.resources to anon;
grant select, insert, update, delete on public.resources to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'gallery-images',
    'gallery-images',
    false,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'resource-files',
    'resource-files',
    false,
    10485760,
    array[
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/zip'
    ]
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists gallery_images_published_read on storage.objects;
create policy gallery_images_published_read
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'gallery-images'
  and exists (
    select 1
    from public.gallery_items
    where gallery_items.storage_path = storage.objects.name
      and gallery_items.is_published = true
  )
);

drop policy if exists gallery_images_admin_read on storage.objects;
create policy gallery_images_admin_read
on storage.objects
for select
to authenticated
using (bucket_id = 'gallery-images' and public.is_admin());

drop policy if exists gallery_images_admin_insert on storage.objects;
create policy gallery_images_admin_insert
on storage.objects
for insert
to authenticated
with check (bucket_id = 'gallery-images' and public.is_admin());

drop policy if exists gallery_images_admin_update on storage.objects;
create policy gallery_images_admin_update
on storage.objects
for update
to authenticated
using (bucket_id = 'gallery-images' and public.is_admin())
with check (bucket_id = 'gallery-images' and public.is_admin());

drop policy if exists gallery_images_admin_delete on storage.objects;
create policy gallery_images_admin_delete
on storage.objects
for delete
to authenticated
using (bucket_id = 'gallery-images' and public.is_admin());

drop policy if exists resource_files_published_read on storage.objects;
create policy resource_files_published_read
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'resource-files'
  and exists (
    select 1
    from public.resources
    where resources.storage_path = storage.objects.name
      and resources.is_published = true
  )
);

drop policy if exists resource_files_admin_read on storage.objects;
create policy resource_files_admin_read
on storage.objects
for select
to authenticated
using (bucket_id = 'resource-files' and public.is_admin());

drop policy if exists resource_files_admin_insert on storage.objects;
create policy resource_files_admin_insert
on storage.objects
for insert
to authenticated
with check (bucket_id = 'resource-files' and public.is_admin());

drop policy if exists resource_files_admin_update on storage.objects;
create policy resource_files_admin_update
on storage.objects
for update
to authenticated
using (bucket_id = 'resource-files' and public.is_admin())
with check (bucket_id = 'resource-files' and public.is_admin());

drop policy if exists resource_files_admin_delete on storage.objects;
create policy resource_files_admin_delete
on storage.objects
for delete
to authenticated
using (bucket_id = 'resource-files' and public.is_admin());

commit;
