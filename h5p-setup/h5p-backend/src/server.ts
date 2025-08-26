import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "bun";
import { h5pApp, generalApp, docsApp } from "@/modules";

// Main app
const app = new Hono();

// Add CORS middleware
app.use('*', cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Route modules
app.route('/', generalApp);
app.route('/h5p', h5pApp);
app.route('/docs', docsApp);

// Start Bun server
serve({
    fetch: app.fetch,
    port: 3000,
});

console.log('🚀 H5P Server started successfully!');
console.log('📍 Server running at: http://localhost:3000');
console.log('💾 Storage type:', process.env.STORAGE_TYPE || 'memory');
console.log('📚 H5P Libraries available at: http://localhost:3000/h5p/libraries');
console.log('🏥 Health check at: http://localhost:3000/h5p/health');
console.log('📝 Content management at: http://localhost:3000/h5p/content');
console.log('✏️  Editor at: http://localhost:3000/h5p/editor/:contentId');
console.log('🎮 Player at: http://localhost:3000/h5p/player/:contentId');
console.log('📋 API info at: http://localhost:3000/api');

// Export app type for client generation
type AppType = typeof app;
export type { AppType };
