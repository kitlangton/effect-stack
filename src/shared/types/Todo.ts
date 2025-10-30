import * as Schema from "effect/Schema"

/**
 * Database representation of a Todo.
 * Uses DateFromSelf for native Date objects from SQLite.
 */
const TodoDb = Schema.Struct({
  id: Schema.Number, // SQLite uses INTEGER for auto-increment
  title: Schema.String,
  completed: Schema.Boolean,
  createdAt: Schema.DateFromSelf,
})

/**
 * Domain model for a Todo item.
 * Uses DateTimeUtc for ISO string representation in the app.
 */
export class Todo extends Schema.Class<Todo>("Todo")({
  id: Schema.Number,
  title: Schema.String,
  completed: Schema.Boolean,
  createdAt: Schema.DateTimeUtc,
}) {}

/**
 * Transforms between database and domain representations.
 * - DB: Date objects from SQLite
 * - Domain: ISO string timestamps
 */
export const TodoFromDb = Schema.transform(TodoDb, Todo, {
  strict: true,
  decode: (db) => ({
    id: db.id,
    title: db.title,
    completed: db.completed,
    createdAt: db.createdAt.toISOString(),
  }),
  encode: (todo) => ({
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    createdAt: new Date(todo.createdAt),
  }),
})

/**
 * Input schema for creating a new Todo.
 */
export class CreateTodoInput extends Schema.Class<CreateTodoInput>(
  "CreateTodoInput",
)({
  title: Schema.String,
}) {}
