import { experimental_createMCPClient, tool } from "ai"
import { z } from "zod"
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {
    fetchCustomers,
    fetchOverdueCustomers,
    fetchCustomerById,
    sendReminderEmails,
    generateCustomerReport,
} from "./apis"

// Initialize MCP client for external tools (if you have an MCP server)
let mcpClient: any = null

async function initializeMCPClient() {
    if (!mcpClient) {
        try {
            mcpClient = await experimental_createMCPClient({
                // transport: {
                //     type: "sse",
                //     url: process.env.MCP_SERVER_URL || "http://localhost:3000/api/mcp",
                // },
                name: "Customer Service",
                transport: new StreamableHTTPClientTransport(
                    new URL(process.env.MCP_SERVER_URL || "http://localhost:3000/api/mcp-custom")
                )
            })
        } catch (error) {
            console.warn("MCP client initialization failed:", error)
            // Continue without MCP tools if server is not available
        }
    }
    return mcpClient
}

// Custom tools using our APIs
const listCustomers = tool({
    description: "Get a list of all customers with their current status",
    parameters: z.object({}),
    execute: async () => {
        try {
            const customers = await fetchCustomers()
            return {
                customers,
                totalCustomers: customers.length,
            }
        } catch (error) {
            return {
                error: "Failed to fetch customers",
                customers: [],
            }
        }
    },
})

const getOverdueCustomers = tool({
    description: "Get a list of customers with overdue payments and analytics",
    parameters: z.object({}),
    execute: async () => {
        try {
            return await fetchOverdueCustomers()
        } catch (error) {
            return {
                error: "Failed to fetch overdue customers",
                customers: [],
                totalOverdue: 0,
                totalAmount: 0,
            }
        }
    },
})

const getCustomerDetails = tool({
    description: "Get detailed information about a specific customer",
    parameters: z.object({
        customerId: z.number().describe("The ID of the customer to get details for"),
    }),
    execute: async ({ customerId }) => {
        try {
            const customer = await fetchCustomerById(customerId)
            return { customer }
        } catch (error) {
            return { error: "Customer not found or failed to fetch details" }
        }
    },
})

const sendCustomerReminders = tool({
    description: "Send reminder emails to overdue customers",
    parameters: z.object({
        customerIds: z
            .array(z.number())
            .optional()
            .describe("Specific customer IDs to send emails to, or empty for all overdue customers"),
    }),
    execute: async ({ customerIds }) => {
        try {
            return await sendReminderEmails(customerIds)
        } catch (error) {
            return {
                error: "Failed to send reminder emails",
                emailsSent: 0,
                recipients: [],
            }
        }
    },
})

const generateReport = tool({
    description: "Generate a comprehensive customer report with analytics",
    parameters: z.object({}),
    execute: async () => {
        try {
            return await generateCustomerReport()
        } catch (error) {
            return {
                error: "Failed to generate customer report",
            }
        }
    },
})

const recommendAction = tool({
    description: "Recommend the best action to take for customer management",
    parameters: z.object({
        scenario: z.string().describe("The current scenario or problem to get recommendations for"),
    }),
    execute: async ({ scenario }) => {
        // This could call an external AI service or use business logic
        const recommendations = {
            "high overdue amounts": [
                "Send personalized reminder emails immediately",
                "Offer payment plans to customers with amounts over $1000",
                "Schedule follow-up calls for customers overdue more than 30 days",
            ],
            "many overdue customers": [
                "Implement automated reminder email sequences",
                "Review credit approval process",
                "Consider offering early payment discounts",
            ],
            "customer retention": [
                "Analyze payment patterns to identify at-risk customers",
                "Implement loyalty programs for consistent payers",
                "Provide proactive customer support",
            ],
        }

        const matchedRecommendations = Object.entries(recommendations).find(([key]) => scenario.toLowerCase().includes(key))

        return {
            scenario,
            recommendations: matchedRecommendations?.[1] || [
                "Analyze current customer data",
                "Identify patterns in customer behavior",
                "Implement targeted communication strategies",
            ],
        }
    },
})

export default async function getTools() {
    // Initialize MCP client and get external tools
    const client = await initializeMCPClient()
    let mcpTools = {}

    if (client) {
        try {
            mcpTools = await client.tools()
        } catch (error) {
            console.warn("Failed to get MCP tools:", error)
        }
    }
    console.log("MCP Tools:", mcpTools)
    // Combine MCP tools with our custom API-based tools
    return {
        // ...mcpTools, // External MCP tools (if available)
        listCustomers,
        getOverdueCustomers,
        getCustomerDetails,
        sendCustomerReminders,
        generateReport,
        recommendAction,
    }
}

// Export function to close MCP client when needed
export async function closeMCPClient() {
    if (mcpClient) {
        try {
            await mcpClient.close()
            mcpClient = null
        } catch (error) {
            console.warn("Failed to close MCP client:", error)
        }
    }
}
