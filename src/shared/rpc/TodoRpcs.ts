import * as Rpc from "@effect/rpc/Rpc"
import * as RpcGroup from "@effect/rpc/RpcGroup"
import * as Schema from "effect/Schema"
import { Todo } from "@shared/types/Todo.js"
import { TodoServiceError } from "@shared/types/TodoServiceError.js"

export class TodoRpcs extends RpcGroup.make(
  Rpc.make("getTodos", {
    success: Schema.Array(Todo),
    error: TodoServiceError,
  }),
  Rpc.make("addTodo", {
    payload: Schema.String,
    success: Todo,
    error: TodoServiceError,
  }),
  Rpc.make("toggleTodo", {
    payload: Schema.Number,
    success: Todo,
    error: TodoServiceError,
  }),
  Rpc.make("deleteTodo", {
    payload: Schema.Number,
    success: Schema.Number,
    error: TodoServiceError,
  }),
) {}
