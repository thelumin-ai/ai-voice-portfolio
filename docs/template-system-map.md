# Template System Map

This document describes how website templates are structured, isolated, registered, and served inside the SaaS framework.

---

## 1. Directory Structure

A template is organized in a self-contained folder to prevent leakages:

```
src/templates/[template-id]/
  ├── template.manifest.ts     # Metadata (ID, name, category, thumbnail)
  ├── default-content.ts       # Structured default copywriting content
  ├── content-schema.ts        # Zod validation schema for custom fields
  ├── theme.ts                 # Visual token values (colors, typography)
  ├── design-fingerprint.json  # Structural JSON mapping archetypes
  ├── Template.tsx             # Root layout renderer
  ├── sections/                # Sub-components (Header, Hero, Services, Footer)
  │   ├── Header.tsx
  │   ├── Hero.tsx
  │   └── Footer.tsx
  └── styles/
      └── template.module.css  # Scoped styling sheet
```

---

## 2. Rendering Flow

The website builder supports two rendering flows:

```mermaid
graph TD
    A[User Request] --> B{Routing Layer}
    B -- /templates/[template-id] --> C[Isolated Sandbox Preview]
    B -- Subdomain request --> D[Subdomain Rewrite Middleware]
    D --> E[/sites/[subdomain]]
    E --> F[Database fetch: Tenant Profile]
    F --> G[Resolve selected template_id]
    G --> H[Render Target Template with Tenant Content]
```

### Preview Route
* **Path**: `/templates/[template-id]`
* **Purpose**: Serves as a standalone, live preview matching the reference design. Renders standard structured placeholders.

### Subdomain Publishing Route
* **Path**: `/sites/[subdomain]`
* **Purpose**: Renders the custom layout. The backend fetches database records (`saas_tenants`, `saas_services`) and feeds the custom details to the resolved template component dynamically.

---

## 3. Style Isolation Strategy

To ensure customer websites look distinct and do not inherit the SaaS dashboard styles, the template system uses **scoped styling**:

1. **CSS Modules**: Visual layouts import scoped `template.module.css` files. Class styles are compiled into unique hashed descriptors.
2. **Body Reset Namespace**: A custom wrapper class specific to the template ID (e.g. `.template-charity-gainlove`) surrounds the template root element to allow scoped font overrides and color assignments without leaking to the global HTML.
3. **Icons & Assets**: Icon components are loaded locally from `lucide-react`. Custom images use local static files or curated Unsplash placements.
