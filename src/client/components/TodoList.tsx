import { Result } from "@effect-atom/atom-react"
import type { Todo } from "@shared/types/Todo.js"
import { TodoItem } from "./TodoItem.js"

interface TodoListProps {
  todos: Result.Result<readonly Todo[]>
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  return (
    <div className="space-y-1">
      {Result.match(todos, {
        onInitial: () => (
          <div className="text-neutral-500 text-center py-8">Loading...</div>
        ),
        onFailure: (error) => (
          <div className="text-neutral-400 text-center py-8">
            Error: {String(error.cause)}
          </div>
        ),
        onSuccess: (success) => (
          <>
            {success.value.length === 0 ? (
              <div className="text-neutral-500 text-center py-8">
                No todos yet. Add one above!
              </div>
            ) : (
              success.value.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                />
              ))
            )}
          </>
        ),
      })}
    </div>
  )
}
