# Protected Files List

The following files and folders form the core structure of the host website and backend systems. They must not be modified, renamed, moved, or deleted when implementing templates.

---

## 1. Locked Directories

### `src/app/admin/`
* **Purpose**: Host administrative dashboard. Handles portfolio management, playground settings, lead tracker database UI, and custom blog publisher.
* **Lock Status**: **LOCKED**. Never edit dashboard layout files, sidebar configurations, or admin-specific route states.

### `src/components/` (Shared Layout & Voice Components)
* **Purpose**: General frontend components used globally.
* **Key Components**:
  * [Navbar.tsx](file:///c:/Users/DELL/Documents/My%20portfolio/ai-voice-portfolio/src/components/Navbar.tsx): Global site header.
  * [Footer.tsx](file:///c:/Users/DELL/Documents/My%20portfolio/ai-voice-portfolio/src/components/Footer.tsx): Global site footer.
  * [RetellVoiceDemo.tsx](file:///c:/Users/DELL/Documents/My%20portfolio/ai-voice-portfolio/src/components/RetellVoiceDemo.tsx): Custom Retell Voice widget.
  * [WebRTCVoiceDemo.tsx](file:///c:/Users/DELL/Documents/My%20portfolio/ai-voice-portfolio/src/components/WebRTCVoiceDemo.tsx): Standard WebRTC voice call demo.
  * [FloatingChatbot.tsx](file:///c:/Users/DELL/Documents/My%20portfolio/ai-voice-portfolio/src/components/FloatingChatbot.tsx): Floating voice help widget.
* **Lock Status**: **LOCKED**. Visual components must not be changed, as this would distort the public facing website.

### `src/lib/supabase/`
* **Purpose**: Credentials loader and client instantiations for Supabase operations.
* **Files**: `client.ts`, `server.ts`, `public.ts`.
* **Lock Status**: **LOCKED**.

---

## 2. Locked Config Files

### `src/middleware.ts`
* **Purpose**: Manages routing rules, Supabase session validation, and redirects. Handles the custom regex matching that maps subdomains dynamically to internal paths.
* **Lock Status**: **LOCKED**. Modifications will lead to runtime routing errors and break dynamic sites.

### `package.json` / `package-lock.json`
* **Purpose**: Dependency tree mapping.
* **Lock Status**: **LOCKED**. Do not run `npm install`, `npm update`, or alter package definitions without explicit permission.

### `next.config.ts` / `eslint.config.mjs` / `tsconfig.json`
* **Purpose**: Framework compiler config.
* **Lock Status**: **LOCKED**.

---

## 3. General Modification Guidelines
* New templates must remain isolated.
* Shared styles (`src/app/globals.css`) are strictly read-only.
* Templates must use **CSS Modules** (`*.module.css`) or unique classes to prevent style leakage.
