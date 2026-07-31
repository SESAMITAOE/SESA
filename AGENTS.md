# SESA Website Agent Guide

This repository contains the production website for the Software Engineering Students Association. Treat every change as a careful maintenance update for a polished public-facing experience.

## Project context
- Framework: Next.js 15, React 19, TypeScript
- Styling: Tailwind CSS with a custom theme defined in src/app/globals.css
- Content: Supabase is the primary source for events, team members, and announcements when configured. The verified arrays in src/data/site.ts remain the public fallback until database setup and seeding have been verified. Resources and gallery placeholders remain local.
- Shared UI: Reusable sections and components live under src/components and should be preserved unless a targeted improvement is explicitly requested

## Non-negotiable rules
- Preserve the existing layout, navigation, page structure, and content hierarchy unless the request explicitly asks for a redesign
- Do not change existing data or copy without clear approval; prefer updating source data files rather than scattering hardcoded text across components
- Maintain the current visual theme at all times: navy, gold, ivory, serif display typography, refined spacing, soft cards, subtle gradients, and elegant motion
- Keep the site production-grade: accessible, responsive, consistent, and easy to maintain
- Avoid broad refactors, dependency churn, or unnecessary rewrites when a small, focused fix will do

## Working expectations
- Reuse the existing components and design tokens instead of introducing new patterns
- Keep copy concise, professional, and aligned with the student-association brand voice
- When adding new sections or content, ensure they fit naturally with the current UI and content model
- Prefer minimal, low-risk updates that preserve user experience and visual quality

## Verification
Before concluding any work, validate the project with:
- npm run lint
- npm run build

## Implementation notes
- Keep route behavior intact and avoid breaking existing pages or shared layouts
- If managed content changes are needed, use the protected administrator routes after Supabase setup. Keep the verified static fallback aligned until the database rollout is confirmed.
- When editing components, maintain the current structure, spacing, and visual tone so the site feels cohesive
