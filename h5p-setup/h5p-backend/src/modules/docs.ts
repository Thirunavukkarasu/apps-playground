import { Hono } from 'hono';
import { swaggerUI } from '@hono/swagger-ui';

const docsApp = new Hono();

// Swagger configuration
const swaggerConfig = {
    openapi: '3.0.0',
    info: {
        title: 'H5P Content Management API',
        version: '1.0.0',
        description: 'A modular API for managing H5P interactive content',
        contact: {
            name: 'API Support',
            email: 'support@example.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
    tags: [
        {
            name: 'H5P',
            description: 'H5P content management endpoints',
        },
        {
            name: 'General',
            description: 'General API information',
        },
    ],
    paths: {
        '/': {
            get: {
                tags: ['General'],
                summary: 'Get API overview',
                description: 'Returns basic information about the API',
                responses: {
                    '200': {
                        description: 'API overview',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                        version: { type: 'string' },
                                        endpoints: { type: 'object' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api': {
            get: {
                tags: ['General'],
                summary: 'Get detailed API information',
                description: 'Returns detailed information about the API and its modules',
                responses: {
                    '200': {
                        description: 'Detailed API information',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        description: { type: 'string' },
                                        version: { type: 'string' },
                                        modules: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    name: { type: 'string' },
                                                    description: { type: 'string' },
                                                    basePath: { type: 'string' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/h5p/health': {
            get: {
                tags: ['H5P'],
                summary: 'Health check',
                description: 'Returns server health status and statistics',
                responses: {
                    '200': {
                        description: 'Health status',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', enum: ['ok', 'error'] },
                                        timestamp: { type: 'string', format: 'date-time' },
                                        libraries: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    machineName: { type: 'string' },
                                                    majorVersion: { type: 'number' },
                                                    minorVersion: { type: 'number' },
                                                },
                                            },
                                        },
                                        contentCount: { type: 'number' },
                                        storageType: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/h5p/libraries': {
            get: {
                tags: ['H5P'],
                summary: 'List H5P libraries',
                description: 'Returns list of available H5P libraries',
                responses: {
                    '200': {
                        description: 'List of libraries',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            machineName: { type: 'string' },
                                            majorVersion: { type: 'number' },
                                            minorVersion: { type: 'number' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/h5p/content': {
            get: {
                tags: ['H5P'],
                summary: 'List content',
                description: 'Returns list of all stored H5P content',
                responses: {
                    '200': {
                        description: 'List of content',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'string' },
                                            title: { type: 'string' },
                                            mainLibrary: { type: 'string' },
                                            createdAt: { type: 'string', format: 'date-time' },
                                            updatedAt: { type: 'string', format: 'date-time' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/h5p/editor/{contentId}': {
            get: {
                tags: ['H5P'],
                summary: 'Get editor interface',
                description: 'Returns editor interface for H5P content',
                parameters: [
                    {
                        name: 'contentId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Content ID',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Editor interface',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        mock: { type: 'boolean' },
                                        message: { type: 'string' },
                                        contentId: { type: 'string' },
                                        editor: {
                                            type: 'object',
                                            properties: {
                                                title: { type: 'string' },
                                                library: { type: 'string' },
                                                params: { type: 'object' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['H5P'],
                summary: 'Save content',
                description: 'Saves or updates H5P content',
                parameters: [
                    {
                        name: 'contentId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Content ID',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string' },
                                    mainLibrary: { type: 'string' },
                                    parameters: { type: 'object' },
                                },
                                required: ['title', 'mainLibrary'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Content saved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        ok: { type: 'boolean' },
                                        contentId: { type: 'string' },
                                        message: { type: 'string' },
                                        data: { type: 'object' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/h5p/player/{contentId}': {
            get: {
                tags: ['H5P'],
                summary: 'Get player interface',
                description: 'Returns player interface for H5P content',
                parameters: [
                    {
                        name: 'contentId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Content ID',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Player interface',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        ok: { type: 'boolean' },
                                        contentId: { type: 'string' },
                                        data: { type: 'object' },
                                        message: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            Error: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                },
            },
        },
    },
};

// Serve Swagger UI
docsApp.get('/swagger', swaggerUI({ url: '/docs/swagger.json' }));

// Serve OpenAPI spec
docsApp.get('/swagger.json', (c) => c.json(swaggerConfig));

// Serve API documentation
docsApp.get('/', (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>H5P API Documentation</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; }
            .section { margin-bottom: 30px; }
            .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { font-weight: bold; color: #007bff; }
            .url { font-family: monospace; background: #e9ecef; padding: 2px 6px; border-radius: 3px; }
            a { color: #007bff; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>H5P Content Management API</h1>
                <p>Interactive API documentation and testing</p>
            </div>
            
            <div class="section">
                <h2>📚 Documentation</h2>
                <p><a href="/docs/swagger" target="_blank">📖 Interactive Swagger UI</a></p>
                <p><a href="/docs/swagger.json" target="_blank">📄 OpenAPI Specification (JSON)</a></p>
            </div>
            
            <div class="section">
                <h2>🚀 Quick Start</h2>
                <div class="endpoint">
                    <div class="method">GET</div>
                    <div class="url">/</div>
                    <p>Get API overview and available endpoints</p>
                </div>
                <div class="endpoint">
                    <div class="method">GET</div>
                    <div class="url">/h5p/health</div>
                    <p>Check server health and status</p>
                </div>
                <div class="endpoint">
                    <div class="method">GET</div>
                    <div class="url">/h5p/content</div>
                    <p>List all stored H5P content</p>
                </div>
            </div>
            
            <div class="section">
                <h2>🔗 Related Links</h2>
                <p><a href="/api">📋 API Information</a></p>
                <p><a href="/h5p/libraries">📚 Available Libraries</a></p>
            </div>
        </div>
    </body>
    </html>
  `);
});

export { docsApp };
