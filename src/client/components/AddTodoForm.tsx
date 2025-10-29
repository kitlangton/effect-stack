import { Atom, useAtom } from "@effect-atom/atom-react"

interface AddTodoFormProps {
  onAdd: (title: string) => void
}

const todoTitleAtom = Atom.make("")

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [newTodoTitle, setNewTodoTitle] = useAtom(todoTitleAtom)

  const handleAddTodo = () => {
    if (newTodoTitle.trim()) {
      onAdd(newTodoTitle)
      setNewTodoTitle("")
    }
  }

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddTodo()
          }
        }}
        placeholder="Add a new todo..."
        className="flex-1 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded focus:outline-none focus:border-neutral-700 text-neutral-100 placeholder-neutral-500"
      />
      <button
        onClick={handleAddTodo}
        className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded font-light text-sm transition-colors"
      >
        Add
      </button>
    </div>
  )
}
