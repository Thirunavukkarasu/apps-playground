import express from "express";
import cors from "cors";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

import { server } from "./server-logic";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Initialize the SSE server transport
// This will handle incoming SSE connections and messages
// The transport will be used to send messages to connected clients
let transport: any;
app.get("/sse", async (req, res) => {
    transport = new SSEServerTransport("/messages", res);
    await server.connect(transport);
});

app.post("/messages", async (req, res) => {
    if (!transport) {
        res.status(500).json({ error: "No active SSE transport" });
        return;
    }
    await transport.handlePostMessage(req, res);
});

const port = process.env.PORT || 8081;
app.listen(port, () => {
    console.log(`MCP SSE Server is running on http://localhost:${port}/sse`);
});