import type { Todo } from "@shared/types/Todo.js"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded hover:border-neutral-700 transition-colors">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-4 h-4 rounded border-neutral-700 bg-neutral-800"
      />
      <span
        className={`flex-1 ${
          todo.completed
            ? "line-through text-neutral-500"
            : "text-neutral-200"
        }`}
      >
        {todo.title}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="px-3 py-1 text-neutral-500 hover:text-neutral-300 text-sm font-light transition-colors"
      >
        Delete
      </button>
    </div>
  )
}
