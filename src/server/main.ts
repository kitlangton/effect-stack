import { HttpRouter } from "@effect/platform"
import { BunHttpServer, BunRuntime } from "@effect/platform-bun"
import { RpcServer, RpcSerialization } from "@effect/rpc"
import { Effect, Layer } from "effect"
import { TodoService } from "./TodoService.js"
import { TodoRpcs } from "@shared/rpc/TodoRpcs.js"

// Create Todo handlers layer
const TodoHandlersLive = TodoRpcs.toLayer(
  Effect.gen(function* () {
    const service = yield* TodoService
    return TodoRpcs.of({
      getTodos: () => service.getTodos(),
      addTodo: (payload: string) => service.addTodo(payload),
      toggleTodo: (payload: string) => service.toggleTodo(payload),
      deleteTodo: (payload: string) => service.deleteTodo(payload),
    })
  }),
)

// Create RPC server layer
const RpcLive = RpcServer.layer(TodoRpcs).pipe(
  Layer.provide(TodoHandlersLive),
)

// Create HTTP server with WebSocket protocol
const HttpServerLive = HttpRouter.Default.serve().pipe(
  Layer.provide(RpcLive),
  Layer.provideMerge(RpcServer.layerProtocolWebsocket({ path: "/rpc" })),
  Layer.provide(BunHttpServer.layer({ port: 3000 })),
  Layer.provide(RpcSerialization.layerJson),
  Layer.provide(TodoService.Default),
)

BunRuntime.runMain(Layer.launch(HttpServerLive))
