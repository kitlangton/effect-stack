import { SqliteClient } from "@effect/sql-sqlite-bun"
import * as String from "effect/String"

/**
 * SQLite database client layer for Bun runtime.
 *
 * Features:
 * - Persistent storage in todos.db
 * - Automatic case conversion (camelCase ↔ snake_case)
 * - WAL mode for better concurrency
 */
export const DbLayer = SqliteClient.layer({
  filename: "todos.db",
  transformQueryNames: String.camelToSnake,
  transformResultNames: String.snakeToCamel,
})
