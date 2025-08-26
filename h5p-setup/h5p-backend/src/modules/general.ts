import { Hono } from "hono";

// General routes
const generalApp = new Hono();

// Root endpoint
generalApp.get("/", (c) => {
    return c.json({
        message: "H5P Content Management API",
        version: "1.0.0",
        endpoints: {
            h5p: "/h5p",
            health: "/h5p/health",
            libraries: "/h5p/libraries",
            content: "/h5p/content",
            editor: "/h5p/editor/:contentId",
            player: "/h5p/player/:contentId"
        }
    });
});

// API info endpoint
generalApp.get("/api", (c) => {
    return c.json({
        name: "H5P Content Management API",
        description: "A modular API for managing H5P interactive content",
        version: "1.0.0",
        modules: [
            {
                name: "H5P",
                description: "H5P content management endpoints",
                basePath: "/h5p"
            }
        ]
    });
});

export { generalApp };
