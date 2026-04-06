# Agent Commands Documentation

## Database Commands

### `pnpm db:pull`

Generate TypeScript types from Supabase database schema.

- **Command**: `npx supabase gen types typescript --project-id phfuwunwgzkfzettekkh --schema public > types/database.types.ts`
- **Purpose**: Pull database types from remote Supabase project and generate TypeScript definitions
- **Output**: `types/database.types.ts` - Complete TypeScript types for all database tables, views, and enums
- **Prerequisites**: Valid Supabase project ID (phfuwunwgzkfzettekkh)
- **Usage**: Run whenever database schema changes to keep types up-to-date

### `pnpm db:push`

Push local database migrations to remote Supabase project.

- **Command**: `npx supabase db push`
- **Purpose**: Apply local migration files to the remote database
- **Prerequisites**: Project must be linked with `supabase link` or use appropriate flags
- **Usage**: Run after making schema changes locally that need to be deployed

## Testing Commands

### `pnpm test:pwa`

Test PWA functionality.

- **Command**: `bash scripts/test-pwa.sh`
- **Purpose**: Run automated tests for Progressive Web App features
- **Output**: Test results in terminal

## Development Commands

### `pnpm lint`

Run ESLint for code quality checks.

- **Command**: `eslint`
- **Purpose**: Check for code style and potential errors
- **Prerequisites**: ESLint configuration in project

### `pnpm typecheck`

Run TypeScript type checking.

- **Command**: `tsc --noEmit`
- **Purpose**: Verify TypeScript types without emitting files
- **Prerequisites**: TypeScript configuration

### `pnpm format`

Format code with Prettier.

- **Command**: `prettier --write "**/*.{ts,tsx}"`
- **Purpose**: Automatically format TypeScript and TSX files
- **Prerequisites**: Prettier configuration
