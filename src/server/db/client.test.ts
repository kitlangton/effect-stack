import { SqliteClient } from "@effect/sql-sqlite-node"
import * as String from "effect/String"

/**
 * SQLite database client layer for Node.js/Vitest testing.
 *
 * Uses @effect/sql-sqlite-node (better-sqlite3) instead of
 * @effect/sql-sqlite-bun to be compatible with Vitest's Node.js runtime.
 *
 * Features:
 * - In-memory database (:memory:) for isolated tests
 * - Automatic case conversion (camelCase ↔ snake_case)
 * - Same interface as production Bun client
 */
export const TestDbLayer = SqliteClient.layer({
  filename: ":memory:",
  transformQueryNames: String.camelToSnake,
  transformResultNames: String.snakeToCamel,
})
