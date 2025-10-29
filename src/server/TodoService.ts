import * as Effect from "effect/Effect"
import { Todo } from "@shared/types/Todo.js"

class InMemoryTodoStore {
  private todos: Todo[] = []
  private idCounter = 0

  addTodo(title: string): Todo {
    const newTodo = Todo.make({
      id: String(this.idCounter++),
      title,
      completed: false,
    })
    this.todos.push(newTodo)
    return newTodo
  }

  getTodos(): Todo[] {
    return [...this.todos]
  }

  toggleTodo(id: string): Todo {
    const index = this.todos.findIndex((t) => t.id === id)
    if (index === -1) {
      throw new Error(`Todo not found: ${id}`)
    }
    const todo = this.todos[index]
    const updatedTodo = Todo.make({
      id: todo.id,
      title: todo.title,
      completed: !todo.completed,
    })
    this.todos[index] = updatedTodo
    return updatedTodo
  }

  deleteTodo(id: string): string {
    const index = this.todos.findIndex((t) => t.id === id)
    if (index === -1) {
      throw new Error(`Todo not found: ${id}`)
    }
    this.todos.splice(index, 1)
    return id
  }
}

export class TodoService extends Effect.Service<TodoService>()("TodoService", {
  effect: Effect.gen(function* () {
    const store = new InMemoryTodoStore()

    const addTodo = (title: string) => Effect.sync(() => store.addTodo(title))

    const getTodos = () => Effect.sync(() => store.getTodos())

    const toggleTodo = (id: string) =>
      Effect.sync(() => store.toggleTodo(id))

    const deleteTodo = (id: string) =>
      Effect.sync(() => store.deleteTodo(id))

    return { addTodo, getTodos, toggleTodo, deleteTodo } as const
  }),
}) {}
