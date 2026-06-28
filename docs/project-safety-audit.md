# Project Safety Audit

This document outlines the safety architecture of the **AI Voice Portfolio & SaaS Platform**, identifying the framework, routes, auth, database integrations, styling, and structural components.

---

## 1. Technical Stack

* **Framework**: Next.js 16.1.6 (App Router)
* **Library**: React 19.2.3
* **Database / Backend**: Supabase SSR (`@supabase/ssr` v0.10.3) & `@supabase/supabase-js` v2.105.3
* **Styling System**: Tailwind CSS v4.0.0 with `@tailwindcss/postcss` & `@tailwindcss/typography`
* **Rich Text Editor**: Tiptap Editor (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`)
* **Voice Agent Clients**: Vapi Web SDK (`@vapi-ai/web`), Retell JS SDK (`retell-client-js-sdk`)
* **Drag-and-Drop system**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`

---

## 2. Active Application Routes

| Path | Component Type | Authentication | Description |
| :--- | :--- | :--- | :--- |
| `/` | Public Static | None | Main agency and voice portfolio landing page |
| `/blog` | Public Static | None | Blog post list |
| `/blog/[slug]` | Public Dynamic | None | Dynamic blog post reading route |
| `/portfolio` | Public Static | None | Portfolio case studies list |
| `/playground` | Public Static | None | Interactive playground/live testing voice agents |
| `/privacy` | Public Static | None | Privacy Policy page |
| `/admin/login` | Public Static | Non-Auth Redirect | Login page for administrator panel |
| `/admin/dashboard` | Admin Dashboard | Supabase Auth Required | Panel for portfolio settings and analytics |
| `/admin/blog` | Admin Dashboard | Supabase Auth Required | Managing blog posts (list, add, edit) |
| `/admin/lead-tracker` | Admin Dashboard | Supabase Auth Required | Managing client contact entries and lead statuses |
| `/admin/settings` | Admin Dashboard | Supabase Auth Required | Core site settings (Abimbola's details, socials) |
| `/admin/use-cases` | Admin Dashboard | Supabase Auth Required | Managing industry use cases |
| `/templates/charity_gainlove` | Template Preview | None | Preview sandbox for the Gainlove non-profit theme |
| `/api/*` | API Endpoints | Mixed | Auth callbacks, playground sync, lead submissions |

---

## 3. Core Architectures

### Authentication System
* Managed by **Supabase Auth** & `@supabase/ssr` cookies handler.
* Middleware file `src/middleware.ts` intercepts `/admin/*` and `/saas/*` paths:
  * Redirects unauthenticated requests to `/admin/login` or `/saas/login`.
  * Redirects authenticated users accessing login routes back to the respective dashboards.

### Subdomain Dynamic Publishing System
* Subdomain routing is defined in `src/middleware.ts` (lines 68-116).
* Standard main domains are defined inside `mainDomains` array:
  * `abimbola-ai-portfolio.vercel.app`
  * `abimbola.ai`
  * `localhost:3000`
* Requests coming from other hostnames (e.g. `client.abimbola.ai`) are rewritten internally to `/sites/[subdomain]`.
* Excluded paths (e.g. `/_next`, `/api`, `/admin`, `/saas`, `/blog`, `/privacy`, files with extensions) bypass the subdomain rewrite.

### Database Integration
* Connects to Supabase PostgreSQL database using server-side cookies validation and client-side anonymous keys:
  * Server client helper: `src/lib/supabase/server.ts`
  * Browser client helper: `src/lib/supabase/client.ts`
  * Public client helper: `src/lib/supabase/public.ts`

---

## 4. Protected vs. Safely Editable Files

> [!WARNING]
> Editing protected files can disrupt production routing, break existing administration consoles, or leak client domain connections.

### Safely Editable Scopes
* A new template directory under `src/templates/[template-id]/` (or `src/app/templates/[template-id]/`).
* Scoped style sheets e.g. `src/templates/[template-id]/styles/template.module.css`.
* Dynamic preview wrappers specific to a single template ID.
* The template registry (via incremental addition of new keys).

### Protected Scopes (Do Not Modify)
* `src/middleware.ts`: Controls all dynamic route rewrites, host mappings, and admin authentication guards.
* `src/app/admin/`: Code base for the administrative control panel.
* `src/components/`: Core shared modules (e.g. `Navbar.tsx`, `Footer.tsx`, voice client components `RetellVoiceDemo.tsx`, `WebRTCVoiceDemo.tsx`).
* `src/lib/supabase/`: Client database credentials wrappers.
* `src/app/globals.css`: Global styles.
* `package.json` / `next.config.ts`: Dependency settings.
