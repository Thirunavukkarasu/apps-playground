import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { mcpToolDefinitions, executeCustomerTool } from "./tools"
import express from "express"
import cors from "cors"

// Create MCP server instance
const server = new Server(
    {
        name: "customer-management-mcp-server-http",
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

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params

    try {
        console.log(`Executing tool: ${name} with arguments:`, args)
        const result = await executeCustomerTool(name, args)

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

// Create Express app for HTTP transport
const app = express()
app.use(cors())
app.use(express.json())

// Handle MCP requests over HTTP
app.post("/mcp", async (req, res) => {
    try {
        const request = req.body
        console.log("Received MCP request:", JSON.stringify(request, null, 2))

        // Process the request through the MCP server
        const response = await server.request(request, {
            ...(request.params?.progressToken && {
                meta: {
                    progressToken: request.params?.progressToken,
                },
            }),
        })

        console.log("Sending MCP response:", JSON.stringify(response, null, 2))
        res.json(response)
    } catch (error) {
        console.error("Error processing MCP request:", error)
        res.status(500).json({
            jsonrpc: "2.0",
            id: req.body.id,
            error: {
                code: -32603,
                message: "Internal error",
                data: error instanceof Error ? error.message : "Unknown error",
            },
        })
    }
})

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        server: "customer-management-mcp-server-http",
        version: "1.0.0",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    })
})

// Start HTTP server
const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`MCP HTTP Server running on port ${PORT}`)
    console.log(`MCP endpoint: http://localhost:${PORT}/mcp`)
    console.log(`Health check: http://localhost:${PORT}/health`)
})
