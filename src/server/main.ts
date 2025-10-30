import { HttpRouter } from "@effect/platform"
import { BunContext, BunHttpServer, BunRuntime } from "@effect/platform-bun"
import { RpcSerialization, RpcServer } from "@effect/rpc"
import { TodoRpcs } from "@shared/rpc/TodoRpcs.js"
import type { TodoId } from "@shared/types/TodoId.js"
import { Effect, Layer } from "effect"
import { DbLayer } from "./db/client.js"
import { TodoService } from "./services/todo-service/TodoService.js"

// Create Todo handlers layer
const TodoHandlersLive = TodoRpcs.toLayer(
	Effect.gen(function* () {
		const service = yield* TodoService
		return TodoRpcs.of({
			getTodos: () => service.getTodos(),
			addTodo: (payload: string) => service.addTodo(payload),
			toggleTodo: (payload: TodoId) => service.toggleTodo(payload),
			deleteTodo: (payload: TodoId) => service.deleteTodo(payload),
		})
	}),
)

// Create RPC server layer
const RpcLive = RpcServer.layer(TodoRpcs).pipe(Layer.provide(TodoHandlersLive))

// Create HTTP server with WebSocket protocol
const HttpServerLive = HttpRouter.Default.serve().pipe(
	Layer.provide(RpcLive),
	Layer.provideMerge(RpcServer.layerProtocolWebsocket({ path: "/rpc" })),
	Layer.provide(BunHttpServer.layer({ port: 3000 })),
	Layer.provide(RpcSerialization.layerJson),
	Layer.provide(TodoService.Default),
	Layer.provide(DbLayer),
	Layer.provide(BunContext.layer),
)

BunRuntime.runMain(Layer.launch(HttpServerLive))
