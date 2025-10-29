import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import { TodoService } from "./TodoService.js"

const withTodoService = <A>(
  program: Effect.Effect<A, unknown, TodoService>,
) => program.pipe(Effect.provide(TodoService.Default))

describe("TodoService", () => {
  it.effect("adds and lists todos", () =>
    withTodoService(
      Effect.gen(function* () {
        const service = yield* TodoService
        const created = yield* service.addTodo("write tests")
        const todos = yield* service.getTodos()

        expect(todos).toHaveLength(1)
        expect(todos[0]).toMatchObject({
          id: created.id,
          title: "write tests",
          completed: false,
        })
      }),
    ),
  )

  it.effect("toggles completion state", () =>
    withTodoService(
      Effect.gen(function* () {
        const service = yield* TodoService
        const created = yield* service.addTodo("flip status")

        const toggled = yield* service.toggleTodo(created.id)
        expect(toggled.completed).toBe(true)

        const toggledBack = yield* service.toggleTodo(created.id)
        expect(toggledBack.completed).toBe(false)
      }),
    ),
  )

  it.effect("deletes todos", () =>
    withTodoService(
      Effect.gen(function* () {
        const service = yield* TodoService
        const created = yield* service.addTodo("remove me")

        const removedId = yield* service.deleteTodo(created.id)
        expect(removedId).toBe(created.id)

        const todos = yield* service.getTodos()
        expect(todos).toHaveLength(0)
      }),
    ),
  )
})
