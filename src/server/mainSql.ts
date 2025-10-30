import { HttpRouter } from "@effect/platform"
import { BunHttpServer, BunRuntime } from "@effect/platform-bun"
import { RpcServer, RpcSerialization } from "@effect/rpc"
import { Effect, Layer } from "effect"
import { TodoService } from "./services/todo-service/TodoService.js"
import { TodoRpcs } from "@shared/rpc/TodoRpcs.js"
import { DbLayer } from "./db/client.js"
import { MigrationsLayer } from "./db/migrations.js"

/**
 * Alternative server configuration using SQLite backend instead of in-memory.
 *
 * This demonstrates how to swap backend implementations in Effect by simply
 * changing the provided layers. The entire RPC/HTTP layer stack remains identical.
 *
 * To use this server:
 * 1. Update package.json dev:server script to: "bun --watch src/server/mainSql.ts"
 * 2. Run: bun run dev:server
 *
 * Data will be persisted in todos.db file.
 */

// Create Todo handlers layer
const TodoHandlersLive = TodoRpcs.toLayer(
  Effect.gen(function* () {
    const service = yield* TodoService
    return TodoRpcs.of({
      getTodos: () => service.getTodos(),
      addTodo: (payload: string) => service.addTodo(payload),
      toggleTodo: (payload: number) => service.toggleTodo(payload),
      deleteTodo: (payload: number) => service.deleteTodo(payload),
    })
  }),
)

// Create RPC server layer
const RpcLive = RpcServer.layer(TodoRpcs).pipe(
  Layer.provide(TodoHandlersLive),
)

// Create HTTP server with WebSocket protocol and SQLite backend
const HttpServerLive = HttpRouter.Default.serve().pipe(
  Layer.provide(RpcLive),
  Layer.provideMerge(RpcServer.layerProtocolWebsocket({ path: "/rpc" })),
  Layer.provide(BunHttpServer.layer({ port: 3000 })),
  Layer.provide(RpcSerialization.layerJson),
  // Provide SQLite backend
  Layer.provide(TodoService.Default),
  Layer.provide(MigrationsLayer),
  Layer.provide(DbLayer),
)

BunRuntime.runMain(Layer.launch(HttpServerLive))
