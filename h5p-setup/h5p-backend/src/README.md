# H5P Backend Source Code

This directory contains all the source code for the H5P Content Management API.

## Structure

```
src/
├── server.ts           # Main server entry point
├── modules/            # Route modules
│   ├── index.ts        # Module exports
│   ├── h5p.ts         # H5P-specific routes
│   ├── general.ts     # General API routes
│   └── README.md      # Module documentation
├── storage/            # Storage implementations
│   ├── index.ts        # Storage factory
│   ├── memoryStorage.ts
│   ├── fileSystemStorage.ts
│   └── README.md      # Storage documentation
├── contentStorage.ts   # Legacy content storage (deprecated)
└── README.md          # This file
```

## Architecture

### Server Entry Point (`server.ts`)

- Main application setup
- CORS middleware configuration
- Route registration
- Server startup

### Modules (`modules/`)

- **H5P Module**: All H5P-related functionality
- **General Module**: API information and root endpoints
- **Future Modules**: Users, analytics, etc.

### Storage (`storage/`)

- **Storage Factory**: Environment-driven storage selection
- **Memory Storage**: In-memory content storage
- **File System Storage**: Local file-based storage
- **Future Storage**: Database, cloud storage

## Development

### Running the Server

```bash
# Development with watch mode
bun run dev

# Production
bun run start

# With specific storage type
STORAGE_TYPE=memory bun run dev
STORAGE_TYPE=filesystem bun run dev
```

### Adding New Modules

1. Create a new module in `modules/`
2. Export the Hono app instance
3. Add to `modules/index.ts`
4. Register in `server.ts`

### Adding New Storage Types

1. Create a new storage implementation in `storage/`
2. Implement the `IContentStorage` interface
3. Add to the `StorageFactory`
4. Update environment configuration

## File Organization

### Why `src/` Directory?

- **Separation**: Keeps source code separate from configuration files
- **Clarity**: Clear distinction between source and project files
- **Standards**: Follows Node.js/TypeScript project conventions
- **Build Process**: Easier to configure build tools and bundlers
- **IDE Support**: Better IDE organization and navigation

### Benefits

- 🎯 **Clear Structure**: Source code is clearly organized
- 🔧 **Easy Navigation**: IDE can better understand the project structure
- 📦 **Build Ready**: Ready for bundling and deployment
- 🧪 **Testing**: Easier to set up test directories
- 📚 **Documentation**: Clear separation of concerns

## Import Paths

All imports use relative paths within the `src/` directory:

```typescript
// From server.ts
import { h5pApp, generalApp } from "./modules";

// From modules/h5p.ts
import { StorageFactory, type ContentData } from "../storage";

// From storage/index.ts
import { MemoryStorage } from "./memoryStorage";
import { FileSystemStorage } from "./fileSystemStorage";
```

## Configuration

The main configuration files remain in the root directory:

- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `Dockerfile` - Container configuration
- `docker-compose.yml` - Multi-service setup
- `env.example` - Environment variables template

## Next Steps

- [ ] Add TypeScript path mapping for cleaner imports
- [ ] Set up build process for production
- [ ] Add test directory structure
- [ ] Configure linting and formatting
- [ ] Add API documentation generation
