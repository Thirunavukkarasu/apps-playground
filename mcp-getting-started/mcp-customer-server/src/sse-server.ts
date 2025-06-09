import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { mcpToolDefinitions, executeCustomerTool } from "./tools"
import express from "express"
import cors from "cors"

// Create MCP server instance
const server = new Server(
    {
        name: "customer-management-mcp-server-sse",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    },
)

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: Object.values(mcpToolDefinitions),
    }
})

// Handle tool calls with progress updates
server.setRequestHandler(CallToolRequestSchema, async (request, extra: any) => {
    const { name, arguments: args } = request.params
    const progressToken = extra?.meta?.progressToken

    try {
        console.log(`Executing tool: ${name} with arguments:`, args)

        // Send progress update if supported
        if (progressToken && server.notification) {
            await server.notification({
                method: "notifications/progress",
                params: {
                    progressToken,
                    progress: 0,
                    total: 100,
                },
            })
        }

        // Execute the tool
        const result = await executeCustomerTool(name, args)

        // Send completion progress
        if (progressToken && server.notification) {
            await server.notification({
                method: "notifications/progress",
                params: {
                    progressToken,
                    progress: 100,
                    total: 100,
                },
            })
        }

        return {
            content: result.content || [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        }
    } catch (error) {
        console.error(`Error executing tool ${name}:`, error)
        return {
            content: [
                {
                    type: "text",
                    text: `Error executing tool ${name}: ${error instanceof Error ? error.message : "Unknown error"}`,
                },
            ],
            isError: true,
        }
    }
})

// Create Express app for SSE transport
const app = express()
app.use(cors())
app.use(express.json())

// Store active SSE connections
const sseConnections = new Map<string, express.Response>()

// SSE endpoint
app.get("/sse", (req, res) => {
    const clientId =
        (req.query.clientId as string) || `client-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.flushHeaders()

    // Store connection
    sseConnections.set(clientId, res)
    console.log(`SSE client connected: ${clientId}`)

    // Send initial message
    res.write(
        `data: ${JSON.stringify({
            type: "connection",
            clientId,
            message: "Connected to MCP SSE server",
        })}\n\n`,
    )

    // Handle client disconnect
    req.on("close", () => {
        sseConnections.delete(clientId)
        console.log(`SSE client disconnected: ${clientId}`)
    })
})

// MCP over SSE endpoint
app.post("/sse/:clientId/mcp", async (req: any, res: any) => {
    const { clientId } = req.params
    const sseConnection = sseConnections.get(clientId)

    if (!sseConnection) {
        return res.status(404).json({ error: "SSE client not found" })
    }

    try {
        const request = req.body
        console.log(`Processing MCP request for SSE client ${clientId}:`, JSON.stringify(request, null, 2))

        // Process the request through the MCP server
        const response = await server.request(request, {
            ...(request.params?.progressToken && {
                meta: {
                    progressToken: request.params?.progressToken,
                },
            }),
        })

        // Send response via SSE
        sseConnection.write(`data: ${JSON.stringify(response)}\n\n`)

        res.json({ success: true, message: "Request processed and sent via SSE" })
    } catch (error) {
        console.error("Error processing MCP request:", error)

        // Send error via SSE
        const errorResponse = {
            jsonrpc: "2.0",
            id: req.body.id,
            error: {
                code: -32603,
                message: "Internal error",
                data: error instanceof Error ? error.message : "Unknown error",
            },
        }

        sseConnection.write(`data: ${JSON.stringify(errorResponse)}\n\n`)
        res.status(500).json({ error: "Internal error" })
    }
})

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        server: "customer-management-mcp-server-sse",
        version: "1.0.0",
        connections: sseConnections.size,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    })
})

// Start SSE server
const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
    console.log(`MCP SSE Server running on port ${PORT}`)
    console.log(`SSE endpoint: http://localhost:${PORT}/sse`)
    console.log(`MCP over SSE: http://localhost:${PORT}/sse/:clientId/mcp`)
    console.log(`Health check: http://localhost:${PORT}/health`)
})
