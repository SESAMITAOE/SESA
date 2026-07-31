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

## 3. Apply the migration

Open the Supabase SQL editor and run:

```text
supabase/migrations/202607310001_admin_cms_foundation.sql
```

Review the SQL before running it. The migration is idempotent and creates:

- `profiles` for approved administrators only
- `events`
- `team_members`
- `announcements`
- `public_team_members`, which masks private email addresses
- updated-at triggers, indexes, constraints, and RLS policies
- the public `event-posters` Storage bucket and administrator write policies

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
replacement announcement is invented.

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

Use `poster_url` for event posters in this milestone. The `event-posters`
bucket and policies are ready for a later, deliberately scoped upload
interface.

Keep titles and descriptions concise, verify dates and links, and leave content
unpublished until it is ready. Do not store information about all college
students in `team_members`; it is only for approved SESA committee records.

## Security summary

- Public users can read published events and current published announcements.
- Public team reads use a masked view; email appears only when
  `is_email_public` is true.
- Public users cannot insert, update, or delete content.
- Authenticated users without an approved admin profile cannot manage content.
- Administrator policies call the trusted `profiles` table through
  `public.is_admin()`.
- Storage reads are public for event posters; writes require an approved admin.
