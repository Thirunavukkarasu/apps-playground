# H5P Setup with React Frontend

This project provides a complete H5P (HTML5 Package) setup with a Bun-based backend API and a React frontend for managing interactive content.

## Project Structure

```
h5p-setup/
├── h5p-backend/          # Bun + Hono backend with H5P server
├── h5p-frontend/         # React + Vite frontend with Tailwind CSS
└── README.md
```

## Features

- **H5P Backend**: RESTful API for creating, editing, and playing H5P content
- **React Frontend**: Modern UI for managing H5P content with Tailwind CSS
- **Content Management**: Create, view, and manage interactive H5P content
- **Real-time API**: Live communication between frontend and backend

## Prerequisites

- [Bun](https://bun.sh/) (for backend)
- [Node.js](https://nodejs.org/) (for frontend)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd h5p-backend
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Create H5P directories:

   ```bash
   mkdir -p h5p/content h5p/libraries h5p/temp
   ```

4. Start the backend server:
   ```bash
   bun run server.ts
   ```

The backend will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd h5p-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Backend API (Port 3000)

- `GET /h5p/editor/:contentId` - Get editor data for a content
- `POST /h5p/editor/:contentId` - Save/update content
- `GET /h5p/player/:contentId` - Get player data for a content

### Frontend Features

- **Content List**: View all created H5P content
- **Create Content**: Generate new H5P content with default settings
- **Load Editor**: View editor data for selected content
- **Load Player**: View player data for selected content
- **Real-time Updates**: Live API communication with loading states

## Usage

1. **Start Both Servers**: Ensure both backend and frontend are running
2. **Create Content**: Click "New Content" to create your first H5P content
3. **Manage Content**: Use the sidebar to select and manage different content
4. **View Data**: Click "Load Editor" or "Load Player" to see the H5P data

## Technology Stack

### Backend

- **Bun**: Fast JavaScript runtime
- **Hono**: Lightweight web framework
- **@lumieducation/h5p-server**: H5P server implementation
- **TypeScript**: Type-safe development

### Frontend

- **React**: UI library
- **Vite**: Build tool and dev server
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Latest utility-first CSS framework
- **Axios**: HTTP client for API calls

## Development

### Backend Development

```bash
cd h5p-backend
bun run server.ts
```

### Frontend Development

```bash
cd h5p-frontend
npm run dev
```

### Type Checking

```bash
# Backend
cd h5p-backend
bun run tsc --noEmit

# Frontend
cd h5p-frontend
npm run build
```

## File Structure

### Backend (`h5p-backend/`)

- `server.ts` - Main server file with H5P endpoints
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `h5p/` - H5P storage directories

### Frontend (`h5p-frontend/`)

- `src/App.tsx` - Main React component
- `src/main.tsx` - React entry point
- `src/index.css` - Tailwind CSS v4 import
- `tailwind.config.js` - Tailwind CSS v4 configuration
- `postcss.config.cjs` - PostCSS configuration for Tailwind CSS v4
- `package.json` - Dependencies and scripts

## H5P Content Types

The system supports various H5P content types including:

- Question Sets
- Interactive Videos
- Presentations
- Quizzes
- And more...

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both backend and frontend
5. Submit a pull request

## License

This project is open source and available under the MIT License.
