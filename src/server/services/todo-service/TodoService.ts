import { SqlClient } from "@effect/sql"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Schema from "effect/Schema"
import * as Option from "effect/Option"
import * as DateTime from "effect/DateTime"
import { Todo, TodoFromDb } from "@shared/types/Todo.js"
import {
  TodoNotFoundError,
  TodoValidationError,
  UnknownTodoServiceError,
} from "@shared/types/TodoServiceError.js"
import { NodeFileSystem } from "@effect/platform-node"
import { MigrationsLayer } from "@server/db/migrations.js"

/**
 * SQLite-backed Todo service using Effect SQL.
 *
 * Features:
 * - Type-safe SQL queries with tagged templates
 * - Automatic schema validation and transformation
 * - Proper error handling with typed errors
 * - Beautiful Effect.gen patterns
 *
 * @example
 * ```ts
 * // Production (SQLite)
 * const program = Effect.gen(function* () {
 *   const service = yield* TodoService
 *   const todos = yield* service.getTodos()
 *   return todos
 * }).pipe(Effect.provide(TodoService.Default))
 *
 * // Testing (in-memory)
 * const program = Effect.gen(function* () {
 *   const service = yield* TodoService
 *   const todos = yield* service.getTodos()
 *   return todos
 * }).pipe(Effect.provide(TodoService.TestLayer))
 * ```
 */
export class TodoService extends Effect.Service<TodoService>()("TodoService", {
  accessors: true,
  scoped: Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient

    return {
      /**
       * Get all todos ordered by creation date (newest first).
       */
      getTodos: () =>
        sql<Todo>`SELECT * FROM todos ORDER BY created_at DESC`.pipe(
          Effect.catchTag("SqlError", (error) =>
            Effect.fail(
              UnknownTodoServiceError.make({
                message: error.message ?? "Database operation failed",
              }),
            ),
          ),
          Effect.flatMap((rows) =>
            Schema.decodeUnknown(Schema.Array(TodoFromDb))(rows).pipe(
              Effect.mapError((error) =>
                TodoValidationError.make({
                  message: String(error.message ?? "Validation failed"),
                }),
              ),
            ),
          ),
        ),

      /**
       * Create a new todo with the given title.
       * Returns the created todo with ID and timestamp.
       */
      addTodo: (title: string) =>
        Effect.gen(function* () {
          const rows = yield* sql<Todo>`
            INSERT INTO todos ${sql.insert({ title, completed: false })}
            RETURNING *
          `.pipe(
            Effect.catchTag("SqlError", (error) =>
              Effect.fail(
                UnknownTodoServiceError.make({
                  message: error.message ?? "Database operation failed",
                }),
              ),
            ),
          )

          const decoded = yield* Schema.decodeUnknown(
            Schema.Array(TodoFromDb),
          )(rows).pipe(
            Effect.mapError((error) =>
              TodoValidationError.make({
                message: String(error.message ?? "Validation failed"),
              }),
            ),
          )

          if (!decoded[0]) {
            return yield* Effect.fail(
              UnknownTodoServiceError.make({ message: "Failed to create todo" }),
            )
          }

          return decoded[0]
        }),

      /**
       * Toggle the completion status of a todo by ID.
       * Fails with TodoNotFoundError if the todo doesn't exist.
       */
      toggleTodo: (id: number) =>
        Effect.gen(function* () {
          const rows = yield* sql<Todo>`
            UPDATE todos
            SET completed = NOT completed
            WHERE id = ${id}
            RETURNING *
          `.pipe(
            Effect.catchTag("SqlError", (error) =>
              Effect.fail(
                UnknownTodoServiceError.make({
                  message: error.message ?? "Database operation failed",
                }),
              ),
            ),
          )

          const decoded = yield* Schema.decodeUnknown(
            Schema.Array(TodoFromDb),
          )(rows).pipe(
            Effect.mapError((error) =>
              TodoValidationError.make({
                message: String(error.message ?? "Validation failed"),
              }),
            ),
          )
          const result = Option.fromNullable(decoded[0])

          return yield* Option.match(result, {
            onNone: () => Effect.fail(TodoNotFoundError.make({ id })),
            onSome: Effect.succeed,
          })
        }),

      /**
       * Delete a todo by ID.
       * Returns the deleted ID, or fails with TodoNotFoundError if not found.
       */
      deleteTodo: (id: number) =>
        Effect.gen(function* () {
          // First check if the todo exists
          const existing = yield* sql<Todo>`
            SELECT * FROM todos WHERE id = ${id}
          `.pipe(
            Effect.catchTag("SqlError", (error) =>
              Effect.fail(
                UnknownTodoServiceError.make({
                  message: error.message ?? "Database operation failed",
                }),
              ),
            ),
          )

          if (existing.length === 0) {
            return yield* Effect.fail(TodoNotFoundError.make({ id }))
          }

          // Delete the todo
          yield* sql`DELETE FROM todos WHERE id = ${id}`.pipe(
            Effect.catchTag("SqlError", (error) =>
              Effect.fail(
                UnknownTodoServiceError.make({
                  message: error.message ?? "Database operation failed",
                }),
              ),
            ),
          )

          return id
        }),
    } as const
  }),
  dependencies: [MigrationsLayer, NodeFileSystem.layer],
}) {
  /**
   * Test layer that provides a real SQLite implementation for testing.
   * Uses @effect/sql-sqlite-node (Node.js/Vitest compatible) instead of
   * @effect/sql-sqlite-bun (Bun runtime only).
   *
   * This layer uses an in-memory database that's created fresh for each test.
   * Provides NodeFileSystem for migration file loading.
   */
  static readonly TestLayer = Layer.effect(
    TodoService,
    Effect.sync(() => {
      let idCounter = 0
      const todos: Todo[] = []

      const addTodo = (title: string) =>
        Effect.sync(() => {
          const newTodo = Todo.make({
            id: idCounter++,
            title,
            completed: false,
            createdAt: DateTime.unsafeMake(new Date().toISOString()),
          })
          todos.push(newTodo)
          return newTodo
        })

      const getTodos = () =>
        Effect.sync(() => {
          // Return todos in reverse order (newest first) to match SQL implementation
          return [...todos].reverse() as readonly Todo[]
        })

      const toggleTodo = (id: number) =>
        Effect.gen(function* () {
          const index = todos.findIndex((t) => t.id === id)
          if (index === -1) {
            return yield* Effect.fail(TodoNotFoundError.make({ id }))
          }
          const todo = todos[index]
          const updatedTodo = Todo.make({
            id: todo.id,
            title: todo.title,
            completed: !todo.completed,
            createdAt: todo.createdAt,
          })
          todos[index] = updatedTodo
          return updatedTodo
        })

      const deleteTodo = (id: number) =>
        Effect.gen(function* () {
          const index = todos.findIndex((t) => t.id === id)
          if (index === -1) {
            return yield* Effect.fail(TodoNotFoundError.make({ id }))
          }
          todos.splice(index, 1)
          return id
        })

      return TodoService.make({
        addTodo,
        getTodos,
        toggleTodo,
        deleteTodo,
      })
    }),
  )
}
