# SESA Administrator CMS Setup

This guide is for the junior maintainers who configure and operate the SESA
content-management system. Public students do not need accounts. Do not add a
student registration flow or expose privileged keys in application code.

## 1. Create the Supabase project

1. Create one Supabase project for the SESA website.
2. Record the project URL and anonymous public key from the project API
   settings.
3. Do not add a service-role key to this repository, `.env.local`, or Vercel's
   normal application variables. This application uses the anonymous key plus
   Row Level Security.
4. Keep the project region and ownership details in the association's private
   operational records.

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Only the variable names belong in Git. `.env.local` is ignored. If either value
is missing, public pages show verified fallback content and `/admin/login`
shows a safe configuration message.

## 3. Apply the migrations

Open the Supabase SQL editor and run these files in order:

```text
supabase/migrations/202607310001_admin_cms_foundation.sql
supabase/migrations/202607310002_gallery_resources_cms.sql
```

Review each file before running it. The foundation migration creates:

- `profiles` for approved administrators only
- `events`
- `team_members`
- `announcements`
- `public_team_members`, which masks private email addresses
- updated-at triggers, indexes, constraints, and RLS policies
- the public `event-posters` Storage bucket and administrator write policies

The additive Gallery/Resources migration creates:

- `gallery_items`, including optional event association and publishing order
- `resources`, supporting an external URL or an uploaded file
- private `gallery-images` and `resource-files` Storage buckets
- public read policies tied to published database records
- administrator-only table and Storage write policies
- ordering functions, indexes, constraints, and updated-at triggers

Do not edit or rerun a modified foundation migration on an existing project.
Apply the additive migration instead. Both new buckets are deliberately private:
the application creates short-lived signed URLs only after RLS confirms that a
record is published or that the requester is an approved administrator.

Do not run destructive reset commands against a production project.

## 4. Seed the senior-provided content

After the migration succeeds, run:

```text
supabase/seed.sql
```

The seed is non-destructive: existing conflicting records are left unchanged.
It contains the four senior-provided events and all 25 existing SESA committee
members in their original order. Member emails are preserved but start as
private. The stale CodeCraft placeholder announcement is not seeded, and no
replacement announcement is invented. The six existing resource descriptions
are preserved as drafts because no verified destination links or files were
provided. Add a valid destination before publishing them. No gallery image is
seeded because the existing visual cards were placeholders, not genuine event
photographs.

Confirm the seeded rows in the Supabase table editor before enabling the
database-backed site in production.

## 5. Disable public signup

In the Supabase Authentication settings:

1. Keep email/password authentication available for approved administrators.
2. Disable public user signup.
3. Do not add a signup link to the website.
4. Create administrator users manually through the Supabase dashboard.

The application never accepts an administrator role from the browser.

## 6. Create an approved administrator

Create the user manually in Supabase Authentication. Copy that user's UUID,
then run the following in the SQL editor after replacing the placeholders:

```sql
insert into public.profiles (id, full_name, role)
values ('AUTH_USER_UUID', 'Administrator Name', 'admin')
on conflict (id) do update
set full_name = excluded.full_name,
    role = 'admin';
```

Do not place a real UUID, password, or email in source control. An Auth user
without a matching `profiles.role = 'admin'` row is denied administrator
access and signed out.

## 7. Change or revoke an administrator role

This milestone supports only the `admin` role. To revoke access, remove the
person's `profiles` row or remove/disable the Auth user through the Supabase
dashboard. Because the database role constraint accepts only `admin`, do not
invent additional role strings without a reviewed schema change.

All `/admin/*` pages and every write action validate the authenticated user and
trusted profile on the server. RLS repeats the same check at the database
boundary.

## 8. Test locally

Run:

```text
npm install
npm run dev
```

Verify the public routes without signing in:

- `/`
- `/events`
- `/team`
- `/gallery`
- `/resources`
- `/contact`

Then verify:

- `/admin/login` accepts only a manually created approved administrator
- logged-out requests to `/admin` redirect to `/admin/login`
- an Auth user without the approved profile cannot enter `/admin`
- event publishing updates `/` and `/events`
- team activation and email visibility update `/team`
- only active, published, in-date announcements appear on `/`
- gallery publishing updates `/` and `/gallery`
- resource publishing updates `/` and `/resources`
- draft gallery items, draft resources, and their private files remain hidden
- raw Supabase errors are never displayed

Run `npm run lint` and `npm run build` before opening a pull request.

## 9. Configure Vercel

Add the two public Supabase variables to the appropriate Vercel project
environments:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Redeploy after changing an environment variable. Never paste private database
credentials or a service-role key into client-visible variables.

## 10. Manage content

Approved administrators use:

- `/admin/events` to create, edit, publish, feature, schedule, and delete events
- `/admin/team` to add, edit, reorder, activate, and control email visibility
- `/admin/announcements` to create, schedule, publish, pin, and delete notices
- `/admin/gallery` to upload, describe, associate, reorder, feature, publish,
  and delete gallery images
- `/admin/resources` to manage external resources and uploaded files, including
  classification, ordering, featuring, and publishing

Use `poster_url` for event posters in this milestone. Gallery and resource
forms include their own upload interfaces. Keep every item as a draft until its
content, destination, and accessibility details have been checked.

### Gallery workflow

1. Create a draft and upload one genuine SESA photograph.
2. Add a concise title and caption plus alt text describing visible people,
   activity, and setting.
3. Choose a category and optionally associate the image with an event.
4. Set the display order and feature state.
5. Publish only after previewing the image and description.

Accepted gallery formats are JPEG, PNG, WebP, and AVIF. The maximum size is
5 MB. Replacing an image removes the old stored object after the database update
succeeds. Deleting a gallery record also removes its stored object.

### Resources workflow

1. Create or edit a resource with a required title, description, category, and
   resource type.
2. Provide either a verified HTTP/HTTPS URL or one uploaded file.
3. Optionally record the intended audience and academic year.
4. Set ordering and featuring, then publish when the destination is verified.

Accepted uploaded resource formats are PDF, plain text, Markdown, Word, Excel,
PowerPoint, and ZIP. The maximum size is 10 MB. When changing an uploaded file
to an external URL, the stored file is removed after the record saves.

### Public publishing behaviour

- Public queries request only published Gallery and Resources records.
- Featured content appears first, followed by administrator display order and
  recency.
- The homepage and full public pages use the same shared data functions.
- If the additive migration is not yet available, public pages show the
  verified local fallback and a safe configuration notice.
- Missing images or destinations show a safe fallback rather than a raw error.

Keep titles and descriptions concise, verify dates and links, and leave content
unpublished until it is ready. Do not store information about all college
students in `team_members`; it is only for approved SESA committee records.

## Security summary

- Public users can read published events and current published announcements.
- Public users can read only published Gallery and Resources records.
- Public team reads use a masked view; email appears only when
  `is_email_public` is true.
- Public users cannot insert, update, or delete content.
- Public users cannot upload, replace, or delete Storage objects.
- Authenticated users without an approved admin profile cannot manage content.
- Administrator policies call the trusted `profiles` table through
  `public.is_admin()`.
- Gallery and resource buckets are private. Published content is served through
  short-lived signed URLs after database and Storage RLS checks.
- Event-poster reads remain public; all Storage writes require an approved
  administrator.

## Junior handover checklist

Before handing the CMS to another batch:

1. Confirm both migrations are recorded as applied in the shared Supabase
   project.
2. Confirm public signup remains disabled and review the approved `profiles`
   rows.
3. Test one temporary draft-to-published-to-draft workflow in Gallery and
   Resources, then delete only those temporary records.
4. Confirm both private buckets retain their file-size and MIME restrictions.
5. Run `npm run lint`, `npm run build`, and responsive public-page checks.
6. Record operational ownership privately. Never add passwords, private keys,
   session tokens, or real credentials to this repository.
