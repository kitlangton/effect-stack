import * as BrowserSocket from "@effect/platform-browser/BrowserSocket"
import * as RpcClient from "@effect/rpc/RpcClient"
import * as RpcSerialization from "@effect/rpc/RpcSerialization"
import { AtomRpc } from "@effect-atom/atom-react"
import { TodoRpcs } from "@shared/rpc/TodoRpcs.js"
import * as Layer from "effect/Layer"

class TodoClient extends AtomRpc.Tag<TodoClient>()("TodoClient", {
	group: TodoRpcs,
	protocol: RpcClient.layerProtocolSocket({
		retryTransientErrors: true,
	}).pipe(
		Layer.provide(BrowserSocket.layerWebSocket("ws://localhost:3000/rpc")),
		Layer.provide(RpcSerialization.layerJson),
	),
}) {}

export { TodoClient }
