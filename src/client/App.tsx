import { Atom, Result, useAtomSet, useAtomValue } from "@effect-atom/atom-react"
import type { TodoId } from "@shared/types/TodoId.js"
import { AddTodoForm } from "./components/AddTodoForm.js"
import { filterAtom, TodoFilter } from "./components/TodoFilter.js"
import { TodoList } from "./components/TodoList.js"
import { TodoStats } from "./components/TodoStats.js"
import { TodoClient } from "./rpc/TodoClient.js"

const todosAtom = TodoClient.query("getTodos", void 0, {
	reactivityKeys: ["todos"],
})

const filteredTodosAtom = Atom.make((get) => {
	const todosResult = get(todosAtom)
	const filter = get(filterAtom)

	return Result.map(todosResult, (todos) =>
		filter === "all"
			? todos
			: filter === "completed"
				? todos.filter((t) => t.completed)
				: todos.filter((t) => !t.completed),
	)
})

function App() {
	const todos = useAtomValue(filteredTodosAtom)

	const addTodo = useAtomSet(TodoClient.mutation("addTodo"))
	const toggleTodo = useAtomSet(TodoClient.mutation("toggleTodo"))
	const deleteTodo = useAtomSet(TodoClient.mutation("deleteTodo"))

	const handleAddTodo = (title: string) => {
		addTodo({
			payload: title,
			reactivityKeys: ["todos"],
		})
	}

	const handleToggleTodo = (id: TodoId) => {
		toggleTodo({
			payload: id,
			reactivityKeys: ["todos"],
		})
	}

	const handleDeleteTodo = (id: TodoId) => {
		deleteTodo({
			payload: id,
			reactivityKeys: ["todos"],
		})
	}

	return (
		<div className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
			<div className="max-w-2xl mx-auto">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-semibold text-neutral-100">Todo App</h1>
					<TodoStats todos={useAtomValue(todosAtom)} />
				</div>
				<AddTodoForm onAdd={handleAddTodo} />
				<TodoFilter />
				<TodoList todos={todos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
			</div>
		</div>
	)
}

export default App
