# Design System

## Stack UI

| Layer                | Technology               | Version       |
| -------------------- | ------------------------ | ------------- |
| Framework            | Next.js                  | 16.1.7        |
| UI Library           | React                    | 19.2.4        |
| Styling              | Tailwind CSS             | 4.2.1         |
| Component Primitives | Radix UI                 | 1.4.3         |
| Component Library    | shadcn/ui                | 4.1.2         |
| Icons                | Lucide React             | 1.7.0         |
| Theme                | next-themes              | 0.4.6         |
| Variants             | class-variance-authority | 0.7.1         |
| Class Merging        | clsx + tailwind-merge    | 2.1.1 + 3.5.0 |
| Animation            | tw-animate-css           | 1.4.0         |

## shadcn/ui Configuration

Config file: `components.json`

```json
{
  "style": "radix-vega",
  "rsc": true,
  "tsx": true,
  "baseColor": "olive",
  "cssVariables": true,
  "iconLibrary": "lucide",
  "menuColor": "inverted-translucent",
  "menuAccent": "subtle"
}
```

**Path aliases:**

| Alias             | Path             |
| ----------------- | ---------------- |
| `@/components`    | `components/`    |
| `@/components/ui` | `components/ui/` |
| `@/lib`           | `lib/`           |
| `@/hooks`         | `hooks/`         |

## Installed shadcn Components

| Component | File                       | Variants                                                          | Sizes                                                                |
| --------- | -------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------- |
| Button    | `components/ui/button.tsx` | `default`, `outline`, `secondary`, `ghost`, `destructive`, `link` | `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg` |

## Color Tokens & Theme Variables

### Color Space

All colors use **OKLCH** color space for better perceptual uniformity.

### Base Color

**Olive** — green-toned neutral palette (hue ~107°).

### Light Mode Tokens

| Token                    | Value (OKLCH)         | Usage                   |
| ------------------------ | --------------------- | ----------------------- |
| `--background`           | `1 0 0`               | Page background (white) |
| `--foreground`           | `0.153 0.006 107.1`   | Primary text            |
| `--card`                 | `1 0 0`               | Card backgrounds        |
| `--card-foreground`      | `0.153 0.006 107.1`   | Card text               |
| `--popover`              | `1 0 0`               | Popover backgrounds     |
| `--popover-foreground`   | `0.153 0.006 107.1`   | Popover text            |
| `--primary`              | `0.527 0.154 150.069` | Primary brand (green)   |
| `--primary-foreground`   | `0.982 0.018 155.826` | Text on primary         |
| `--secondary`            | `0.967 0.001 286.375` | Secondary backgrounds   |
| `--secondary-foreground` | `0.21 0.006 285.885`  | Text on secondary       |
| `--muted`                | `0.966 0.005 106.5`   | Muted backgrounds       |
| `--muted-foreground`     | `0.58 0.031 107.3`    | Muted text              |
| `--accent`               | `0.966 0.005 106.5`   | Accent backgrounds      |
| `--accent-foreground`    | `0.228 0.013 107.4`   | Text on accent          |
| `--destructive`          | `0.577 0.245 27.325`  | Error/destructive       |
| `--border`               | `0.93 0.007 106.5`    | Borders                 |
| `--input`                | `0.93 0.007 106.5`    | Input backgrounds       |
| `--ring`                 | `0.737 0.021 106.9`   | Focus rings             |

### Dark Mode Tokens

| Token          | Value (OKLCH)         | Notes                  |
| -------------- | --------------------- | ---------------------- |
| `--background` | `0.153 0.006 107.1`   | Dark surface           |
| `--foreground` | `0.988 0.003 106.5`   | Light text             |
| `--primary`    | `0.448 0.119 151.328` | Darker green           |
| `--border`     | `1 0 0 / 10%`         | Semi-transparent white |
| `--input`      | `1 0 0 / 15%`         | Semi-transparent white |

### Chart Colors

Five chart colors available (`--chart-1` through `--chart-5`), all green-toned variants for data visualization.

### Sidebar Tokens

Full set of sidebar-specific tokens: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring`.

### Border Radius

| Token          | Value                       |
| -------------- | --------------------------- |
| `--radius`     | `0.625rem` (base)           |
| `--radius-sm`  | `calc(var(--radius) * 0.6)` |
| `--radius-md`  | `calc(var(--radius) * 0.8)` |
| `--radius-lg`  | `var(--radius)`             |
| `--radius-xl`  | `calc(var(--radius) * 1.4)` |
| `--radius-2xl` | `calc(var(--radius) * 1.8)` |
| `--radius-3xl` | `calc(var(--radius) * 2.2)` |
| `--radius-4xl` | `calc(var(--radius) * 2.6)` |

## Styling Conventions

### The `cn()` Utility

Located at `@/lib/utils`. Combines `clsx` for conditional classes and `tailwind-merge` for deduplication:

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Always use `cn()`** when merging Tailwind classes — never use template literals or string concatenation.

### Component Variants with CVA

Components use `class-variance-authority` (CVA) for variant and size composition:

```ts
const buttonVariants = cva("base-classes-here", {
  variants: {
    variant: { default: "...", outline: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})
```

### Data Attributes for Styling Hooks

Components expose `data-slot` and `data-variant`/`data-size` attributes for external styling:

```tsx
<Comp
  data-slot="button"
  data-variant={variant}
  data-size={size}
  className={cn(buttonVariants({ variant, size, className }))}
/>
```

### Tailwind CSS v4 Syntax

This project uses **Tailwind CSS v4** with CSS-based configuration:

- `@import "tailwindcss"` instead of `@tailwind` directives
- `@theme inline` for custom design tokens
- `@custom-variant` for custom variants (e.g., `dark`)
- `@apply` in `@layer base` for global resets

### Class Application Patterns

| Pattern        | Example                                           |
| -------------- | ------------------------------------------------- |
| Semantic color | `bg-background text-foreground`                   |
| Primary action | `bg-primary text-primary-foreground`              |
| Muted text     | `text-muted-foreground`                           |
| Border         | `border border-border`                            |
| Focus ring     | `focus-visible:ring-3 focus-visible:ring-ring/50` |
| Conditional    | `cn("base", isActive && "bg-accent")`             |

## Example Usage

### Button Component

```tsx
import { Button } from "@/components/ui/button"

// Default variant
<Button>Click me</Button>

// Variant + size
<Button variant="outline" size="sm">Outline Small</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// Icon button
<Button variant="ghost" size="icon">
  <IconComponent />
</Button>

// With asChild (renders as Link instead of button)
import Link from "next/link"
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>

// Merging custom classes
<Button className="w-full">Full Width</Button>
```

### Available Button Variants

- `default` — Primary green button
- `outline` — Bordered with background
- `secondary` — Muted background
- `ghost` — Transparent, hover reveals
- `destructive` — Red/error styling
- `link` — Underlined text link

### Available Button Sizes

- `xs` — Extra small (h-6)
- `sm` — Small (h-8)
- `default` — Default (h-9)
- `lg` — Large (h-10)
- `icon` — Square icon button (9x9)
- `icon-xs` — Extra small icon (6x6)
- `icon-sm` — Small icon (8x8)
- `icon-lg` — Large icon (10x10)
