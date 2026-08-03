# SESA Website

Official website of the Software Engineering Student Association, Department
of Computer Engineering (Software Engineering), MIT Academy of Engineering,
Pune.

**Dream • Build • Achieve**

## Technology

- Next.js 15 App Router
- React 19 and strict TypeScript
- Tailwind CSS 4 and local shadcn-style components
- Supabase PostgreSQL, Auth, and Storage
- Vercel deployment

## Local development

1. Install the repository's Node.js dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Add the Supabase project URL and anonymous key. Never commit `.env.local`.
4. Start the site with `npm run dev`.

The public site remains usable with verified static content when Supabase is not
configured. Administrator routes require a configured Supabase project and an
approved `profiles` row with the `admin` role.

## Content and administration

Public visitors never need an account. Approved administrators sign in at
`/admin/login` to manage events, committee members, announcements, gallery
images, and resources.

Gallery and resource uploads are stored in private Supabase Storage buckets.
Published records receive short-lived signed file URLs on the server; drafts
remain unavailable to anonymous visitors. Apply both migrations in order before
using the new administrator modules.

See [docs/ADMIN_CMS_SETUP.md](docs/ADMIN_CMS_SETUP.md) for database setup,
Storage policies, file constraints, seed data, administrator workflows, local
verification, junior handover, and Vercel deployment.

## Quality checks

```text
npm run lint
npm run build
```
