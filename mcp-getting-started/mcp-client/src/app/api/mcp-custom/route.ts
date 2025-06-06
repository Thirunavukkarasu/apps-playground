import { type NextRequest, NextResponse } from "next/server"
import { mcpToolDefinitions, executeCustomerTool, mcpServerInfo, toolExists } from "./tools"

// Handle CORS for MCP client
function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders(),
    })
}

// MCP server implementation
export async function GET() {
    return NextResponse.json(
        {
            jsonrpc: "2.0",
            result: {
                protocolVersion: mcpServerInfo.protocolVersion,
                capabilities: mcpServerInfo.capabilities,
                serverInfo: {
                    name: `${mcpServerInfo.name}-custom`,
                    version: mcpServerInfo.version,
                },
            },
        },
        {
            headers: corsHeaders(),
        },
    )
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        console.log("MCP Custom Request:", JSON.stringify(body, null, 2))

        // Handle different MCP methods
        switch (body.method) {
            case "initialize":
                const initResponse = {
                    jsonrpc: "2.0",
                    id: body.id,
                    result: {
                        protocolVersion: mcpServerInfo.protocolVersion,
                        capabilities: mcpServerInfo.capabilities,
                        serverInfo: {
                            name: `${mcpServerInfo.name}-custom`,
                            version: mcpServerInfo.version,
                        },
                    },
                }
                console.log("Initialize Response:", JSON.stringify(initResponse, null, 2))
                return NextResponse.json(initResponse, {
                    headers: corsHeaders(),
                })

            case "tools/list":
                const toolsResponse = {
                    jsonrpc: "2.0",
                    id: body.id,
                    result: {
                        tools: Object.values(mcpToolDefinitions),
                    },
                }
                console.log("Tools List Response:", JSON.stringify(toolsResponse, null, 2))
                return NextResponse.json(toolsResponse, {
                    headers: corsHeaders(),
                })

            case "tools/call":
                // Fix: Extract parameters from either 'parameters' or 'arguments'
                const { name, parameters: toolParams, arguments: toolArgs } = body.params
                const actualParams = toolParams || toolArgs

                if (!toolExists(name)) {
                    return NextResponse.json(
                        {
                            jsonrpc: "2.0",
                            id: body.id,
                            error: {
                                code: -32601,
                                message: `Tool not found: ${name}`,
                            },
                        },
                        {
                            headers: corsHeaders(),
                        },
                    )
                }

                try {
                    const result = await executeCustomerTool(name, actualParams)
                    const toolResponse = {
                        jsonrpc: "2.0",
                        id: body.id,
                        result,
                    }
                    console.log("Tool Call Response:", JSON.stringify(toolResponse, null, 2))
                    return NextResponse.json(toolResponse, {
                        headers: corsHeaders(),
                    })
                } catch (error) {
                    return NextResponse.json(
                        {
                            jsonrpc: "2.0",
                            id: body.id,
                            error: {
                                code: -32603,
                                message: `Tool execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                            },
                        },
                        {
                            headers: corsHeaders(),
                        },
                    )
                }

            default:
                return NextResponse.json(
                    {
                        jsonrpc: "2.0",
                        id: body.id,
                        error: {
                            code: -32601,
                            message: `Method not found: ${body.method}`,
                        },
                    },
                    {
                        headers: corsHeaders(),
                    },
                )
        }
    } catch (error) {
        console.error("MCP Custom Server Error:", error)
        return NextResponse.json(
            {
                jsonrpc: "2.0",
                error: {
                    code: -32700,
                    message: "Parse error",
                },
            },
            {
                status: 400,
                headers: corsHeaders(),
            },
        )
    }
}
