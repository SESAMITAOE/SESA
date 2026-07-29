# SESA Website Development Guide

Use this repository as a polished, production-ready Next.js website for the Software Engineering Students Association. Maintain the current experience while making careful, low-risk improvements.

## Core principles
- Preserve the existing layout, information architecture, and page flow unless the request explicitly requires a redesign
- Respect the current design system: navy-and-gold palette, ivory backgrounds, serif display typography, subtle gradients, and elegant spacing
- Treat content in src/data/site.ts as the source of truth for events, team members, resources, and gallery items
- Keep UI changes consistent with the established component structure under src/components
- Avoid introducing unnecessary dependencies, major rewrites, or visual drift

## Update policy
- When making any code update, do not alter the existing layout or data unless the task explicitly asks for a content or structure change
- If content needs to be updated, edit the relevant data source first and keep the rest of the UI intact
- Preserve the current theme, tone, and navigation experience across all pages
- Favor small, targeted fixes that improve quality without disrupting the site

## Quality bar
- Write accessible, responsive, and readable UI
- Keep code clean and easy to reason about
- Prefer reusable components and existing patterns over duplicated logic
- Ensure changes remain consistent with the current brand and page composition

## Validation
Run these before considering the work complete:
- npm run lint
- npm run build
