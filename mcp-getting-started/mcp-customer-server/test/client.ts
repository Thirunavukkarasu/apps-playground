import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"
import { spawn } from "child_process"

async function testMCPClient() {
    // Start the MCP server as a subprocess
    const serverProcess = spawn("bun", ["../src/server.ts"], {
        stdio: ["pipe", "pipe", "inherit"],
    })

    // Create client with stdio transport
    const transport = new StdioClientTransport({
        command: "bun",
        args: ["../src/server.ts"],
    })

    const client = new Client(
        {
            name: "customer-service-client",
            version: "1.0.0",
        },
        {
            capabilities: {},
        },
    )

    try {
        // Connect to the server
        await client.connect(transport)
        console.log("Connected to MCP server")

        // List available tools
        const toolsResponse = await client.listTools()
        console.log(
            "Available tools:",
            toolsResponse.tools.map((t) => t.name),
        )

        // Call listCustomers tool
        const customersResult = await client.callTool({
            name: "listCustomers",
            arguments: {},
        })
        console.log("Customers result:", customersResult)

        // Call getCustomerDetails tool
        const customerDetailsResult = await client.callTool({
            name: "getCustomerDetails",
            arguments: { customerId: 1 },
        })
        console.log("Customer details result:", customerDetailsResult)

        // Call getOverdueCustomers tool
        const overdueResult = await client.callTool({
            name: "getOverdueCustomers",
            arguments: {},
        })
        console.log("Overdue customers result:", overdueResult)
    } catch (error) {
        console.error("Error:", error)
    } finally {
        // Clean up
        await client.close()
        serverProcess.kill()
    }
}

testMCPClient().catch(console.error)
