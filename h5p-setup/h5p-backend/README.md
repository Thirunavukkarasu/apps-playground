# H5P Content Management Backend

A modular H5P content management API built with Bun, Hono, and TypeScript.

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) runtime
- Node.js 18+ (for development tools)

### Installation

```bash
# Install dependencies
bun install

# Set up environment (optional)
cp env.example .env
```

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

## 📁 Project Structure

```
h5p-backend/
├── src/                    # Source code
│   ├── server.ts          # Main server entry point
│   ├── modules/           # Route modules
│   │   ├── h5p.ts        # H5P-specific routes
│   │   ├── general.ts    # General API routes
│   │   └── index.ts      # Module exports
│   └── storage/          # Storage implementations
│       ├── index.ts      # Storage factory
│       ├── memoryStorage.ts
│       └── fileSystemStorage.ts
├── h5p/                   # H5P libraries and content
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── Dockerfile             # Container configuration
└── docker-compose.yml     # Multi-service setup
```

## 🔧 Features

- **Modular Architecture**: Clean separation of concerns with route modules
- **Flexible Storage**: Environment-driven storage (memory, filesystem, database, cloud)
- **H5P Integration**: Full H5P content management (create, edit, play)
- **TypeScript**: Fully typed with excellent IDE support
- **Docker Ready**: Containerized deployment with Docker Compose
- **CORS Support**: Cross-origin resource sharing for frontend integration

## 🌐 API Endpoints

### General

- `GET /` - API overview
- `GET /api` - Detailed API information

### H5P Content Management

- `GET /h5p/health` - Server health check
- `GET /h5p/libraries` - List available H5P libraries
- `GET /h5p/content` - List all stored content
- `GET /h5p/editor/:contentId` - Get editor interface
- `POST /h5p/editor/:contentId` - Save/update content
- `GET /h5p/player/:contentId` - Get player interface

## 🗄️ Storage Options

### Memory Storage (Default)

```bash
STORAGE_TYPE=memory bun run dev
```

### File System Storage

```bash
STORAGE_TYPE=filesystem bun run dev
```

### Database Storage (Future)

```bash
STORAGE_TYPE=database bun run dev
```

## 🐳 Docker Deployment

### Development

```bash
# Memory storage
docker-compose --profile dev up

# File system storage
docker-compose --profile dev-fs up
```

### Production

```bash
# File system storage
docker-compose --profile prod up

# Database storage
docker-compose --profile prod-db up
```

## 🔗 Frontend Integration

The backend is designed to work with the H5P frontend React application:

```bash
# Start backend
cd h5p-backend && bun run dev

# Start frontend (in another terminal)
cd h5p-frontend && npm run dev
```

## 📚 Documentation

- [Source Code Documentation](./src/README.md)
- [Module Documentation](./src/modules/README.md)
- [Storage Documentation](./src/storage/README.md)

## 🤝 Contributing

1. Follow the modular structure in `src/`
2. Add new modules to `src/modules/`
3. Implement storage types in `src/storage/`
4. Update documentation as needed

## 📄 License

This project is part of the H5P Content Management System.
