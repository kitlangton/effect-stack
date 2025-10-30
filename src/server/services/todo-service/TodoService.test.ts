import { describe, expect, test } from "bun:test"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { TodoService } from "./TodoService.js"
import * as SqliteClient from "@effect/sql-sqlite-bun/SqliteClient"

/**
 * Shared test suite for TodoService implementations.
 * Tests both in-memory and SQLite backends with the same test cases.
 *
 * This demonstrates Effect's layered architecture - we can test the same
 * service interface with different backing implementations by swapping layers.
 *
 * Run with: bun test
 */

/**
 * Shared test suite that works with any TodoService implementation
 */
function testTodoService(
  name: string,
  getLayer: () => Layer.Layer<TodoService, never, never>,
) {
  describe(`TodoService (${name})`, () => {
    test("should start with empty todos", async () => {
      const program = Effect.gen(function* () {
        const todos = yield* TodoService.getTodos()

        expect(todos).toEqual([])
      }).pipe(Effect.provide(getLayer()))

      await Effect.runPromise(program)
    })

    test("should add a todo", async () => {
      const program = Effect.gen(function* () {
        const todo = yield* TodoService.addTodo("Buy milk")

        expect(todo.title).toBe("Buy milk")
        expect(todo.completed).toBe(false)
        expect(typeof todo.id).toBe("number")
        expect(todo.createdAt).toBeDefined()
      }).pipe(Effect.provide(getLayer()))

      await Effect.runPromise(program)
    })

    test("should get all todos", async () => {
      const program = Effect.gen(function* () {
        yield* TodoService.addTodo("First todo")
        yield* TodoService.addTodo("Second todo")

        const todos = yield* TodoService.getTodos()

        expect(todos.length).toBe(2)
        expect(todos[0].title).toBe("Second todo") // Newest first
        expect(todos[1].title).toBe("First todo")
      }).pipe(Effect.provide(getLayer()))

      await Effect.runPromise(program)
    })

    test("should toggle todo completion", async () => {
      const program = Effect.gen(function* () {
        const todo = yield* TodoService.addTodo("Test todo")

        expect(todo.completed).toBe(false)

        const toggled = yield* TodoService.toggleTodo(todo.id)
        expect(toggled.completed).toBe(true)
        expect(toggled.id).toBe(todo.id)

        const toggledAgain = yield* TodoService.toggleTodo(todo.id)
        expect(toggledAgain.completed).toBe(false)
      }).pipe(Effect.provide(getLayer()))

      await Effect.runPromise(program)
    })

    test("should delete a todo", async () => {
      const program = Effect.gen(function* () {
        const todo = yield* TodoService.addTodo("Delete me")

        const deletedId = yield* TodoService.deleteTodo(todo.id)
        expect(deletedId).toBe(todo.id)

        const todos = yield* TodoService.getTodos()
        expect(todos.length).toBe(0)
      }).pipe(Effect.provide(getLayer()))

      await Effect.runPromise(program)
    })

    test("should maintain todo order (newest first)", async () => {
      const program = Effect.gen(function* () {
        const first = yield* TodoService.addTodo("First")
        const second = yield* TodoService.addTodo("Second")
        const third = yield* TodoService.addTodo("Third")

        const todos = yield* TodoService.getTodos()

        expect(todos[0].id).toBe(third.id)
        expect(todos[1].id).toBe(second.id)
        expect(todos[2].id).toBe(first.id)
      }).pipe(Effect.provide(getLayer()))

      await Effect.runPromise(program)
    })
  })
}

export const TestDbLayer = SqliteClient.layer({
  filename: ":memory:",
  transformQueryNames: String.camelToSnake,
  transformResultNames: String.snakeToCamel,
})

// Test SQLite implementation
testTodoService("SQLite", () =>
  Layer.provide(TodoService.Default, TestDbLayer),
)

// Test in-memory implementation
testTodoService("InMemory", () => TodoService.TestLayer)
