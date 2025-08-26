# H5P Backend Modules

This directory contains the modular route structure for the H5P Content Management API.

## Structure

```
modules/
├── index.ts          # Main exports for all modules
├── h5p.ts           # H5P-specific routes and logic
├── general.ts       # General API routes
└── README.md        # This documentation
```

## Modules

### H5P Module (`h5p.ts`)

Contains all H5P-related functionality:

- **Editor Routes**: `/h5p/editor/:contentId`

  - `GET`: Render editor interface
  - `POST`: Save/update content

- **Player Routes**: `/h5p/player/:contentId`

  - `GET`: Render content for playback

- **Content Management**: `/h5p/content`

  - `GET`: List all stored content

- **Library Management**: `/h5p/libraries`

  - `GET`: List available H5P libraries

- **Health Check**: `/h5p/health`
  - `GET`: Server status and statistics

### General Module (`general.ts`)

Contains general API endpoints:

- **Root**: `/`

  - `GET`: API overview and endpoint documentation

- **API Info**: `/api`
  - `GET`: Detailed API information and module structure

## Usage

### Adding New Modules

1. Create a new file in the `modules/` directory (e.g., `users.ts`)
2. Export a Hono app instance
3. Add the export to `modules/index.ts`
4. Route it in the main `server.ts`

Example:

```typescript
// modules/users.ts
import { Hono } from "hono";

const usersApp = new Hono()
  .get("/", (c) => c.json({ result: "list users" }))
  .post("/", (c) => c.json({ result: "create user" }))
  .get("/:id", (c) => c.json({ result: `get user ${c.req.param("id")}` }));

export { usersApp };
```

```typescript
// modules/index.ts
export { h5pApp } from "./h5p";
export { generalApp } from "./general";
export { usersApp } from "./users";
```

```typescript
// server.ts
import { h5pApp, generalApp, usersApp } from "./modules";

const app = new Hono();
app.route("/", generalApp);
app.route("/h5p", h5pApp);
app.route("/users", usersApp);
```

### Benefits

- **Separation of Concerns**: Each module handles its own domain
- **Maintainability**: Easier to find and modify specific functionality
- **Scalability**: Easy to add new modules without cluttering main server
- **Reusability**: Modules can be imported and used independently
- **Testing**: Each module can be tested in isolation

## Current Endpoints

### Root Level

- `GET /` - API overview
- `GET /api` - Detailed API information

### H5P Module (`/h5p`)

- `GET /h5p/editor/:contentId` - Get editor interface
- `POST /h5p/editor/:contentId` - Save content
- `GET /h5p/player/:contentId` - Get player interface
- `GET /h5p/content` - List all content
- `GET /h5p/libraries` - List available libraries
- `GET /h5p/health` - Health check

## TypeScript Support

All modules are fully typed with TypeScript. The main app type can be exported for client generation:

```typescript
// server.ts
type AppType = typeof app;
export type { AppType };
```

This enables type-safe client generation using Hono's client utilities.
