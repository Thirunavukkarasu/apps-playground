# MCP Server Implementation

This is a basic Model Completion Protocol (MCP) server implementation using Bun and Express.

## Setup

1. Install dependencies:
```
bun install
```

2. Set up environment variables:
Copy the `.env` file and adjust as needed.

3. Start the server:
```
bun run start
```

For development with auto-reload:
```
bun run dev
```

## API Endpoints

### Models
- `GET /v1/models` - List available models

### Conversations
- `POST /v1/conversations` - Create a new conversation
- `GET /v1/conversations/:id` - Get conversation details
- `POST /v1/conversations/:id/messages` - Add message to conversation

### Completions
- `POST /v1/completions` - Create a new completion
- `GET /v1/completions/:id` - Get completion status and response
- `POST /v1/completions/stream` - Stream completion response

## Authentication
All endpoints require an API key, which should be passed in the `api-key` header or as the `api_key` query parameter.

## Notes
This is a simplified implementation for demonstration purposes. In a production environment, you would need to:
- Implement proper error handling
- Add robust authentication and authorization
- Integrate with actual AI models
- Use a persistent database instead of in-memory storage
- Add more comprehensive validation
- Implement proper logging
