# Code Migration Mapping

## Current Structure → Monorepo Structure

### Components Mapping

#### Shared UI Components (→ packages/ui/)
- `components/ui/*` → `packages/ui/src/components/ui/`
  - All shadcn/ui components stay in UI package
  - Includes: accordion, alert, avatar, badge, button, card, input, etc.

#### Feature Components (→ apps/web/components/)
- `components/home/` → `apps/web/components/home/`
- `components/conversation/` → `apps/web/components/conversation/`
- `components/assistant/` → `apps/web/components/assistant/`
- `components/workflow/` → `apps/web/components/workflow/`
- `components/projects/` → `apps/web/components/projects/`
- `components/preferences/` → `apps/web/components/preferences/`
- `components/account/` → `apps/web/components/account/`
- `components/billing/` → `apps/web/components/billing/`
- `components/team/` → `apps/web/components/team/`
- `components/llms/` → `apps/web/components/llms/`
- `components/auth/` → `apps/web/components/auth/`
- `components/layout/` → `apps/web/components/layout/`
- `components/context/` → `apps/web/components/context/`
- `components/figma/` → `apps/web/components/figma/`
- `components/shared/` → `apps/web/components/shared/`

### Types (→ packages/types/)
- `types/*` → `packages/types/src/`

### Hooks (→ apps/web/lib/hooks/)
- `hooks/*` → `apps/web/lib/hooks/`

### Contexts (→ apps/web/lib/contexts/)
- `contexts/*` → `apps/web/lib/contexts/`

### Constants (→ packages/config/)
- `constants/*` → `packages/config/src/constants.ts`

### Styles (→ apps/web/styles/)
- `styles/*` → `apps/web/styles/`

### Assets (→ apps/web/public/)
- `assets/*` → `apps/web/public/assets/`

### Root Files
- `App.tsx` → `apps/web/app/layout.tsx` (will be converted)
- `main.tsx` → `apps/web/app/page.tsx` (home page)
- `index.css` → `apps/web/styles/globals.css` (merged with styles/globals.css)

