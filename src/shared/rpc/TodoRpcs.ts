import * as Rpc from "@effect/rpc/Rpc"
import * as RpcGroup from "@effect/rpc/RpcGroup"
import * as Schema from "effect/Schema"
import { Todo } from "@shared/types/Todo.js"

export class TodoRpcs extends RpcGroup.make(
  Rpc.make("getTodos", {
    success: Schema.Array(Todo),
  }),
  Rpc.make("addTodo", {
    payload: Schema.String,
    success: Todo,
  }),
  Rpc.make("toggleTodo", {
    payload: Schema.String,
    success: Todo,
  }),
  Rpc.make("deleteTodo", {
    payload: Schema.String,
    success: Schema.String,
  }),
) {}
