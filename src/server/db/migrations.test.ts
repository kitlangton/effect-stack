import { SqliteMigrator } from "@effect/sql-sqlite-node"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Migration system for test database (Node.js/Vitest compatible).
 *
 * Uses @effect/sql-sqlite-node migrator instead of
 * @effect/sql-sqlite-bun to work with Vitest's Node.js runtime.
 *
 * Migrations are stored in ./migrations/ as TypeScript Effect programs.
 * They run automatically when tests start.
 */
export const TestMigrationsLayer = SqliteMigrator.layer({
  loader: SqliteMigrator.fromFileSystem(join(__dirname, "migrations")),
  table: "effect_sql_migrations",
})
