import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { mcpToolDefinitions, executeCustomerTool } from "./tools"

// Create MCP server instance
const server = new Server(
    {
        name: "customer-management-mcp-server",
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

// Start the server with stdio transport
async function main() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    console.error("Customer Management MCP Server running on stdio")
}

main().catch((error) => {
    console.error("Server failed to start:", error)
    process.exit(1)
})
