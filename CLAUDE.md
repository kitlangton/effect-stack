# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A fullstack TypeScript application demonstrating Effect-TS with type-safe RPC communication over WebSockets. The application is a Todo app showcasing real-time bidirectional client-server communication with end-to-end type safety.

## Commands

### Development
```bash
bun dev              # Run both client (Vite) and server (Bun) with hot reload
bun dev:client       # Run only the Vite dev server
bun dev:server       # Run only the Bun server with --watch
```

### Testing & Quality
```bash
bun test             # Run tests using Bun's test runner
bun typecheck        # Type check without emitting files
bun lint             # Check code with Biome
bun lint:fix         # Auto-fix linting issues
bun format           # Format code with Biome
bun format:check     # Check formatting without writing
```

### Build
```bash
bun build            # Type check and build client with Vite
```

## Architecture

### RPC Communication Pattern

The application uses `@effect/rpc` for type-safe client-server communication:

1. **RPC Definitions** (`src/shared/rpc/`) - Define RPC contracts using `Rpc.make()` grouped into `RpcGroup`:
   - Each RPC specifies payload, success, and error schemas
   - Example: `TodoRpcs.ts` defines all Todo operations (getTodos, addTodo, toggleTodo, deleteTodo)

2. **Server Handlers** (`src/server/main.ts`) - Implement RPC handlers as an Effect Layer:
   - Use `TodoRpcs.toLayer()` to create handlers from service methods
   - Compose with `RpcServer.layer()` and WebSocket protocol layer
   - Wire dependencies: RPC → Handlers → Service → Database

3. **Client Usage** (`src/client/rpc/`) - Create type-safe RPC clients:
   - Extend `AtomRpc.Tag` to integrate with `@effect-atom/atom-react`
   - Use `RpcClient.layerProtocolSocket()` for WebSocket connection
   - Queries and mutations are accessed via `TodoClient.query()` and `TodoClient.mutation()`

### Effect Services Pattern

Services use the `Effect.Service` pattern (see `TodoService.ts:60`):

- **Default Layer** - Production implementation with SQL database
  - Requires `MigrationsLayer` and `BunFileSystem.layer`
  - Persists to SQLite file (configurable via `DATABASE_PATH` env var)

- **TestLayer** - In-memory implementation for unit tests
  - Array-based storage, fresh per test
  - No database setup overhead
  - Same interface as production service

All service methods return `Effect` types with typed errors (e.g., `TodoNotFoundError`, `TodoValidationError`, `UnknownTodoServiceError`).

### State Management with Atoms

The client uses `@effect-atom/atom-react` for reactive state:

- **Query Atoms** - Fetch data from RPC calls (e.g., `TodoClient.query("getTodos")`)
  - Specify `reactivityKeys` to coordinate updates
  - Results are wrapped in `Result` type for loading/error states

- **Derived Atoms** - Compute values from other atoms (e.g., `filteredTodosAtom`)
  - Use `Atom.make()` with a getter function
  - Automatically recompute when dependencies change

- **Mutations** - Trigger RPC mutations via `useAtomSet(TodoClient.mutation(...))`
  - Include `reactivityKeys` to invalidate related queries

### Path Aliases

The project uses TypeScript path aliases configured in `tsconfig.json` and `vite.config.ts`:

- `@shared/*` → `./src/shared/*` - Types, schemas, and RPC definitions
- `@client/*` → `./src/client/*` - React components and client code
- `@server/*` → `./src/server/*` - Server services and database

### Database Layer

SQLite database with Effect SQL (`src/server/db/client.ts`):

- Automatic case conversion: `camelCase` ↔ `snake_case`
- WAL mode enabled for better concurrency
- Tagged template SQL queries for type safety
- Migrations run automatically on startup (see `src/server/db/migrations.ts`)

### React Patterns

- **React 19** with React Compiler for automatic memoization (no manual `useMemo`/`useCallback` needed)
- Component structure in `src/client/components/`
- Tailwind CSS v4 for styling (utility-first)
- Motion library for animations
