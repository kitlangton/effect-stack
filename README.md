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
├── client/          # React frontend
│   ├── components/  # UI components
│   └── rpc/         # RPC client setup
├── server/          # Bun backend
│   └── TodoService.ts
└── shared/          # Shared types and RPC definitions
    ├── rpc/
    └── types/
```

## Tech Stack

- [Effect](https://effect.website/) - Typed functional effects for TypeScript
- [Bun](https://bun.sh/) - Fast all-in-one JavaScript runtime
- [React](https://react.dev/) - UI library
- [Vite](https://vite.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
