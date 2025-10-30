import * as Schema from "effect/Schema"

/**
 * Error thrown when a todo with the given ID doesn't exist.
 */
export class TodoNotFoundError extends Schema.TaggedError<TodoNotFoundError>()("TodoNotFoundError", {
  id: Schema.Number,
}) {}

/**
 * Error thrown when data validation/parsing fails.
 * This abstracts away implementation-specific parse errors.
 */
export class TodoValidationError extends Schema.TaggedError<TodoValidationError>()("TodoValidationError", {
  message: Schema.String,
}) {}

/**
 * Error thrown when a service operation fails unexpectedly.
 * This abstracts away implementation-specific database errors.
 */
export class UnknownTodoServiceError extends Schema.TaggedError<UnknownTodoServiceError>()("UnknownTodoServiceError", {
  message: Schema.String,
}) {}

/**
 * Union of all possible TodoService errors.
 */
export const TodoServiceError = Schema.Union(
  TodoNotFoundError,
  TodoValidationError,
  UnknownTodoServiceError,
)

export type TodoServiceError = Schema.Schema.Type<typeof TodoServiceError>

