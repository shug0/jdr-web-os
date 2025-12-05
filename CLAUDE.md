# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this JDR Coffee monorepo.

## 📑 Table des Matières

- [⚡ Quick Start](#quick-start)
- [🏗️ Architecture Overview](#architecture-overview)
- [🔧 Development Commands](#development-commands)
- [🚨 Critical Safety Rules](#critical-safety-rules)
- [📋 Quick Reference Checklists](#quick-reference-checklists)
- [🎨 Styling Guidelines](#styling-guidelines)
- [🔄 State Management](#state-management)
- [📝 Forms & Validation](#forms--validation)
- [🔧 TypeScript Standards](#typescript-standards)
- [🌍 Environment Configuration](#environment-configuration)
- [💻 Common Code Patterns](#common-code-patterns)

## Project Overview

**JDR Coffee** is a monorepo containing multiple React/TypeScript applications for tabletop RPG (JDR) tools. Built with modern web standards, this project uses Turborepo for efficient builds and shared packages for code reuse across applications.

### Applications & Architecture
- **web** (`os.jdr.coffee`) - Main landing page and app switcher
- **combien** (`combien.jdr.coffee`) - Medieval fantasy item pricing tool 
  - Data: Notion → Supabase → Admin proxy → Combien app
- **pnj** (`pnj.jdr.coffee`) - NPC generator with AI descriptions
  - Data: Hardcoded + Google Gemini API for descriptions
- **admin** (`admin.jdr.coffee`) - Administrative tools and Notion proxy management
  - Purpose: Proxy Notion databases to other apps via Supabase

### Shared Packages
- **@workspace/ui** - Shared UI components (shadcn/ui based)
- **@workspace/features** - Cross-app features (navigation, layouts, etc.)
- **@workspace/brand** - Brand identity components (taskbar, wallpaper, theme)
- **@workspace/data** - Database integration and auth (Supabase)
- **@workspace/foundation** - Base schemas, types, and utilities
- **@workspace/typescript-config** - Shared TypeScript configurations

### Key Integrations
- **Notion API** - Data source (proxied via Admin app)
- **Google Gemini** - AI description generation (PNJ app)
- **Supabase** - Database layer (Admin app)
- **MCP (planned)** - Future integration for enhanced functionality

## ⚡ Quick Start

**New to this project? Start here:**
1. `pnpm install` - Install dependencies
2. Copy environment configuration (`.env.example` → `.env.local`) for each app
3. Start development server - see [Development Commands](#development-commands)
4. Visit development URLs:
   - Web: `http://localhost:3000`
   - Combien: `http://localhost:3001` 
   - PNJ: `http://localhost:3002`
   - Admin: `http://localhost:3003`

**Key Commands:**
- `pnpm dev` - Start all development servers
- `pnpm check-types` - **Run before every commit** (TypeScript validation)
- `pnpm build` - Build all applications for production
- `pnpm lint` - Check code quality with Biome

## 🔧 Development Commands

### Essential Commands
- `pnpm dev` - Start all development servers with Turbo
- `pnpm build` - Build all applications (includes TypeScript check)
- `pnpm check-types` - **Run all quality checks (required before commits)**
- `pnpm lint` - Check code quality with Biome across all packages
- `pnpm format` - Format code with Biome

### Per-Application Commands
```bash
# Run commands for specific apps
pnpm --filter=web dev           # Start only web app
pnpm --filter=combien build     # Build only combien app
pnpm --filter=pnj typecheck     # Check types for PNJ app

# Multiple apps
pnpm --filter={web,combien} dev # Start web and combien only
```

### Development Notes
- **No tests configured yet** - Focus on rapid prototyping
- **No CI/CD pipeline** - Manual deployment to Vercel
- **Single developer** - No complex branching/review process needed

## 🚨 Critical Safety Rules

### Production Safety
- **NEVER** run destructive commands against production without explicit confirmation
- **NEVER** commit sensitive data (API keys, passwords, tokens)
- **ALWAYS** use environment variables for configuration
- **ALWAYS** verify environment before running database operations

### MCP (Model Context Protocol) Safety
- **CRITICAL**: Before using ANY MCP write operations (apply_migration, execute_sql, deploy_edge_function, etc.), ALWAYS get explicit and clear validation from the user
- **MANDATORY**: Never perform database writes, migrations, or destructive operations via MCP without user confirmation
- **READ-ONLY by default**: MCP tools for reading data (list_tables, get_logs, etc.) are safe to use without confirmation
- **WRITE operations require approval**: Any MCP tool that modifies data, schema, or deployments must be explicitly approved by the user

### Development Workflow
- **MANDATORY**: Run `pnpm check-types` before every commit
- **MANDATORY**: All TypeScript errors must be resolved
- **MANDATORY**: All builds must pass before merging
- **FORBIDDEN**: Committing code with `any` types (use `unknown` instead)
- **FORBIDDEN**: Unused imports or variables (auto-removed by Biome)

## 📋 Quick Reference Checklists

### Before Each Commit ✅ (MANDATORY)
- [ ] `pnpm check-types` passes (TypeScript validation across all packages)
- [ ] `pnpm build` succeeds (all apps build successfully)
- [ ] `pnpm lint` passes (Biome linting)
- [ ] No TypeScript errors or warnings
- [ ] No unused imports/variables
- [ ] No `any` types
- [ ] No sensitive data in code (API keys, Notion tokens)

### Before Production Deploy ✅ (Vercel)
- [ ] All builds succeed without warnings
- [ ] Environment variables configured for each app in Vercel
- [ ] Subdomain routing working correctly
- [ ] API proxies functioning (Admin → other apps)
- [ ] Mobile responsiveness verified

### Debug Checklist 🔧
- [ ] Environment variables set correctly (check each app's `.env.local`)
- [ ] Development servers running on correct ports
- [ ] Shared packages building correctly
- [ ] Turbo cache working (check `.turbo/` folders)
- [ ] TypeScript errors resolved across all packages

## 🏗️ Architecture Overview

### Core Stack (Non-Negotiable)
- **Frontend**: Next.js 15+ + React 19+ + TypeScript
- **Monorepo**: Turborepo with pnpm workspaces
- **State Management**: Zustand (client state) + React Query (server state) where needed
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS + shadcn/ui design system
- **Code Quality**: Biome (linting + formatting) + TypeScript strict mode
- **Package Manager**: pnpm (required for workspace management)

### Monorepo Structure
```
jdr-coffee/
├── apps/
│   ├── web/                    # Main landing page
│   ├── combien/               # Item pricing tool
│   ├── pnj/                   # NPC generator
│   └── admin/                 # Admin tools
├── packages/
│   ├── ui/                    # Shared UI components (shadcn/ui)
│   ├── shared-features/       # Cross-app features
│   ├── utils/                 # Utility functions
│   ├── supabase/             # Database integration
│   ├── schemas/              # Shared Zod schemas
│   └── typescript-config/    # Shared TypeScript config
├── package.json              # Root workspace configuration
├── turbo.json               # Turborepo configuration
└── pnpm-lock.yaml          # Lockfile for exact dependencies
```

### Feature-Based Architecture (Per App)
```
apps/[app-name]/
├── app/                       # Next.js app directory
│   ├── features/[feature]/    # Feature-specific code
│   │   ├── components/        # UI components
│   │   ├── hooks/            # Business logic hooks
│   │   ├── api/              # API calls
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Feature utilities
│   ├── api/                  # Next.js API routes
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Root page
├── lib/                      # App-specific utilities
├── components/               # App-specific components
├── types/                    # App-specific types
└── package.json             # App dependencies
```

### File Naming Conventions (STRICT)
- **Files/folders**: kebab-case
- **Components**: PascalCase
- **Hooks**: camelCase starting with `use`
- **Required suffixes**:
  - `.tsx` - React components
  - `.ts` - TypeScript files
  - `.hook.ts` - Custom hooks
  - `.schema.ts` - Zod schemas
  - `.types.ts` - TypeScript types
  - `.utils.ts` - Utility functions

## 🎨 Styling Guidelines

### JDR Coffee Design System (MANDATORY)

**Theme Philosophy: Medieval Fantasy meets Modern UI**
- **Mobile-first responsive design** - All layouts start from mobile
- **Fantasy aesthetics** - Medieval/RPG visual language
- **Modern UX** - Clean, accessible interface patterns

### Typography System
```css
/* Custom font variables - defined in @workspace/ui/styles/fonts.css */
--font-code: "Google Sans Code"      /* Code/data display */
--font-sans: system fonts           /* Body text */
--font-mono: monospace fonts        /* Monospace data */
```

**Usage patterns:**
```tsx
<h1 className="text-4xl font-bold">Page Title</h1>      // Hero titles
<h2 className="text-2xl font-semibold">Section</h2>     // Section headers
<code className="font-code text-sm">API Response</code> // Code/data
<p className="font-sans">Body text</p>                  // Regular content (default)
```

### Color System (shadcn/ui + JDR extensions)

✅ **Primary Design Tokens** (shadcn/ui):
- `primary/primary-foreground`
- `secondary/secondary-foreground` 
- `muted/muted-foreground`
- `card/card-foreground`
- `background/foreground`
- `border/input/ring`

✅ **Semantic colors for stats/game data**:
```tsx
// Character stats (acceptable for RPG context)
<span className="text-green-600 font-medium">High stat</span>
<span className="text-red-600 font-medium">Low stat</span>

// Prefer semantic tokens when possible
<span className="text-destructive">Error state</span>
<span className="text-muted-foreground">Secondary info</span>
```

❌ **Forbidden**:
- Random Tailwind colors without semantic meaning
- Hardcoded hex colors in components

### Responsive Design (Mobile-First)

**Breakpoint Strategy:**
```tsx
// ✅ Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<span className="hidden sm:inline">Desktop text</span>
<span className="sm:hidden">Mobile text</span>

// ✅ Navigation patterns
<nav className="hidden md:flex">Desktop Nav</nav>
<MobileNav className="md:hidden" />
```

**Standard breakpoints:**
- `sm:` - 640px+ (small tablets)
- `md:` - 768px+ (tablets/small laptops)  
- `lg:` - 1024px+ (laptops)
- `xl:` - 1280px+ (desktops)

### CSS Class Combination (MANDATORY)
```tsx
import { cn } from '@workspace/utils'

<div className={cn(
  "base-classes",
  isActive && "active-state",
  variant === "primary" && "primary-variant",
  "responsive-classes md:different-layout"
)}>
```

### Animation Guidelines
```css
/* Subtle, fantasy-appropriate animations */
.filter-button-active {
  animation: pulse-subtle 2s ease-in-out infinite;
}

/* Collapsible content - smooth reveals */
.animate-collapsible-down {
  animation: collapsible-down .2s ease-out;
}
```

## 🔄 State Management

### State Boundaries (STRICT)
- **Server State**: React Query where needed (data from APIs)
- **Global Client State**: Zustand stores (user preferences, app settings)
- **Local Component State**: `useState` (simple component state)
- **Form State**: React Hook Form (form-specific state)

### Zustand Store Pattern
```tsx
// ✅ App-specific store structure
interface AppState {
  // UI state
  theme: 'light' | 'dark'
  sidebar: { isOpen: boolean }
  
  // Actions
  toggleTheme: () => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  sidebar: { isOpen: false },
  
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  toggleSidebar: () => set((state) => ({ 
    sidebar: { isOpen: !state.sidebar.isOpen } 
  }))
}))
```

## 📝 Forms & Validation

### Schema-First Approach (MANDATORY)
Define Zod schema first, infer TypeScript types:

```tsx
// ✅ Schema-first with type inference
const userFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be at least 18')
})

type UserFormData = z.infer<typeof userFormSchema>

export function UserForm({ onSubmit }: { onSubmit: (data: UserFormData) => void }) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      age: 18
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

## 🔧 TypeScript Standards

### Type Safety Rules (STRICT)
- **NO `any` types** - use `unknown` for dynamic cases
- **Use `satisfies` over type assertions** for better type inference
- **Use `Record<string, unknown>`** instead of generic objects
- **Strict mode enabled** - no implicit any, strict null checks

### Import Strategy
- Use path aliases (`@/` for app-specific, `@workspace/` for shared packages)
- **NO barrel files (index.ts)** - import directly from source files
- Imports auto-sorted by Biome
- Group imports: external → workspace → internal → relative

```tsx
// ✅ Good import order
import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { useAppStore } from '@/lib/store'
import { cn } from '../utils/cn'
```

## 🌍 Environment Configuration

### Per-App Environment Setup
Each app manages its own environment variables:

```bash
# apps/web/.env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000

# apps/combien/.env.local  
NEXT_PUBLIC_APP_URL=http://localhost:3001
# No API keys needed - data comes via Admin proxy

# apps/pnj/.env.local
NEXT_PUBLIC_APP_URL=http://localhost:3002
GOOGLE_AI_API_KEY=your_gemini_api_key_here

# apps/admin/.env.local
NEXT_PUBLIC_APP_URL=http://localhost:3003
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NOTION_TOKEN=your_notion_integration_token
# Admin proxies Notion data to other apps
```

### Production Environment (Vercel)
```bash
# Production URLs
https://os.jdr.coffee                 # Web app
https://combien.jdr.coffee           # Combien app  
https://pnj.jdr.coffee              # PNJ app
https://admin.jdr.coffee            # Admin app

# Vercel environment variables configured per app
# Each app deployment has its own environment settings
```

### Zod Environment Validation (RECOMMENDED)
```tsx
// lib/env.ts (per app)
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  // Add app-specific variables
})

export const env = envSchema.parse(process.env)
```

## 💻 Common Code Patterns

### Adaptive Layout System
All apps use the shared `AdaptiveLayout` component from `@workspace/features` which automatically handles different display contexts:

```tsx
// In app layout.tsx
import { AdaptiveLayout } from '@workspace/features'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdaptiveLayout 
      currentApp="app-name"
      metadata={{
        title: 'App Title',
        description: 'App description',
        icons: { icon: '/app-icon.png' }
      }}
    >
      {children}
    </AdaptiveLayout>
  )
}
```

The `AdaptiveLayout` automatically detects the context and renders:
- **Desktop OS mode** (web app): Full OS interface with desktop, windows, taskbar
- **Standalone mode**: Brand layout with taskbar + wallpaper
- **iFrame mode** (`?windowMode=true`): Minimal clean layout for embedding

### Component with Styling Pattern
```tsx
// ✅ Standard component pattern
import { cn } from '@workspace/utils'

interface CardProps {
  variant?: 'default' | 'outlined'
  children: React.ReactNode
  className?: string
}

export function Card({ variant = 'default', children, className }: CardProps) {
  return (
    <div className={cn(
      "rounded-lg p-4",
      variant === 'default' && "bg-card text-card-foreground border",
      variant === 'outlined' && "border-2 border-border bg-background",
      className
    )}>
      {children}
    </div>
  )
}
```

### Custom Hook Pattern
```tsx
// ✅ App-specific custom hook
interface UseFeatureOptions {
  onSuccess?: () => void
  initialData?: SomeData
}

export function useFeature({ onSuccess, initialData }: UseFeatureOptions = {}) {
  const [state, setState] = useState(initialData)
  
  const handleAction = useCallback(() => {
    // Business logic
    onSuccess?.()
  }, [onSuccess])
  
  return {
    state,
    handleAction,
    isLoading: false
  }
}
```

## Quality Standards (NON-NEGOTIABLE)

### TypeScript Standards
- **NO `any` types** - use `unknown` for dynamic cases
- **Strict mode enabled** in all packages
- **Explicit prop types** - always define interfaces for component props
- **Shared types** in `@workspace/schemas` or app-specific `types/`

### Code Standards
- **Functional components only** - no class components
- **Named function syntax** for exported components
- **Extract complex logic** to custom hooks
- **One file, one responsibility**
- **Remove unused variables/imports** - auto-cleaned by Biome

### Monorepo Standards
- **Shared packages** for common functionality
- **Workspace protocol** for internal dependencies (`workspace:*`)
- **Turbo tasks** for efficient builds and type checking
- **Consistent tooling** across all packages (TypeScript, Biome, etc.)

---

## Project-Specific Features & Architecture

### JDR Coffee Navigation System
The monorepo includes a sophisticated navigation system in `@workspace/shared-features`:
- **Adaptive linking** - Works in development and production environments
- **App switching** - Easy navigation between RPG tools
- **Theme support** - Consistent theming across all apps
- **Mobile responsive** - Full mobile navigation experience
- **App-specific actions** - Each app can add custom nav actions

### Data Flow Architecture
```
Notion Database (Source of Truth)
       ↓
Admin App (Supabase + Proxy Layer)
       ↓
API Endpoints (/api/notion-proxy/:proxyId)
       ↓
Combien App (Item Data Consumption)
```

### AI Integration (PNJ App)
- **Google Gemini API** for NPC description generation
- **Markov chains** for procedural name generation
- **Configurable prompts** in `lib/prompts/description-prompt.ts`
- **Client-side generation** with error handling
- **Hardcoded base data** for character attributes

### Proxy System (Admin App)
- **Notion API integration** - Fetches database content
- **Supabase caching** - Reduces API calls and improves performance  
- **CORS handling** - Enables cross-app data sharing
- **Proxy management** - Admin interface for managing data sources

### Future Integrations
- **MCP (Model Context Protocol)** - Planned for enhanced AI capabilities
- **Additional Notion databases** - Expanding data sources
- **More RPG tools** - Additional apps in the monorepo

---

## Development Workflow

### Working with the Monorepo
1. **Always run from root**: Use `pnpm` commands from the monorepo root
2. **Filter by app**: Use `--filter` to run commands on specific apps
3. **Shared packages**: Changes to shared packages affect all apps
4. **Turbo cache**: Leverage Turbo's intelligent caching for faster builds

### Adding New RPG Tools
1. **Create new app**: Follow existing app structure patterns
2. **Add to navigation**: Update `@workspace/shared-features` config
3. **Configure deployment**: Add Vercel subdomain configuration  
4. **Update CLAUDE.md**: Document new app and its data sources

### Data Integration Patterns
1. **Admin proxy approach**: Route external APIs through Admin app
2. **Direct API integration**: For simple/fast APIs (like Gemini)
3. **Hardcoded data**: For stable reference data (character races, classes)
4. **Hybrid approach**: Combine multiple data sources as needed

### Debugging Common Issues
- **TypeScript errors**: Run `pnpm check-types` to see all errors at once
- **Build failures**: Check Turbo logs in `.turbo/` folders  
- **Import errors**: Verify workspace dependencies in `package.json`
- **Environment issues**: Check each app's `.env.local` file
- **Proxy issues**: Check Admin app logs and Supabase connection
- **Mobile layout**: Test responsive breakpoints on actual devices

### Performance Considerations
- **Turbo caching**: Shared packages are cached for faster builds
- **Vercel edge functions**: Consider for high-performance API routes
- **Image optimization**: Use Next.js Image component for sprites/assets
- **Bundle analysis**: Monitor app sizes as features are added