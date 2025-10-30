import { useAtomSet, useAtomValue } from "@effect-atom/atom-react"
import { TodoClient } from "./rpc/TodoClient.js"
import { AddTodoForm } from "./components/AddTodoForm.js"
import { TodoList } from "./components/TodoList.js"

function App() {
  const todos = useAtomValue(
    TodoClient.query("getTodos", void 0, {
      reactivityKeys: ["todos"],
    }),
  )

  const addTodo = useAtomSet(TodoClient.mutation("addTodo"))
  const toggleTodo = useAtomSet(TodoClient.mutation("toggleTodo"))
  const deleteTodo = useAtomSet(TodoClient.mutation("deleteTodo"))

  const handleAddTodo = (title: string) => {
    addTodo({
      payload: title,
      reactivityKeys: ["todos"],
    })
  }

  const handleToggleTodo = (id: number) => {
    toggleTodo({
      payload: id,
      reactivityKeys: ["todos"],
    })
  }

  const handleDeleteTodo = (id: number) => {
    deleteTodo({
      payload: id,
      reactivityKeys: ["todos"],
    })
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-light mb-8 text-neutral-300">Todo App</h1>
        <AddTodoForm onAdd={handleAddTodo} />
        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
        />
      </div>
    </div>
  )
}

export default App
