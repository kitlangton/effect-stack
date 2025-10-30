# Effect Stack

A fullstack TypeScript starter showcasing Effect-TS with type-safe RPC communication.

## Features

- **Effect-TS** - Functional programming with typed effects
- **Type-safe RPC** - End-to-end type safety between client and server
- **WebSocket Protocol** - Real-time bidirectional communication
- **React 19** - With React Compiler for automatic optimization
- **Bun Runtime** - Fast server runtime
- **Vite** - Lightning-fast development
- **Tailwind CSS** - Utility-first styling

## Getting Started

```bash
# Install dependencies
bun install

# Run development server (client + server)
bun dev

# Run tests
bun test

# Type check
bun typecheck
```

## Project Structure

```
src/
├── client/              # React frontend
│   ├── components/      # UI components (TodoList, TodoItem, etc.)
│   ├── rpc/             # RPC client setup (TodoClient)
│   ├── App.tsx          # Main app component
│   └── main.tsx         # React entry point
├── server/              # Bun backend
│   ├── db/              # Database layer
│   │   ├── client.ts    # SQLite client configuration
│   │   ├── migrations.ts
│   │   └── migrations/  # SQL migration files
│   ├── services/        # Business logic services
│   │   └── todo-service/
│   │       ├── TodoService.ts      # Service implementation
│   │       └── TodoService.test.ts # Service tests
│   └── main.ts          # Server entry point with RPC setup
└── shared/              # Shared types and RPC definitions
    ├── rpc/             # RPC contracts (TodoRpcs)
    └── types/           # Domain types (Todo, TodoId, errors)
```

## Tech Stack

- [Effect](https://effect.website/) - Typed functional effects for TypeScript
- [Effect Atom](https://github.com/tim-smart/effect-atom) - Reactive state management for Effect
- [Bun](https://bun.sh/) - Bun!
- [React](https://react.dev/) - UI library
- [Motion](https://motion.dev/) - Animation library for React
- [Vite](https://vite.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - It's Tailwind
