// Common MCP tools definitions and implementations

import { customers } from "./data"


// MCP Tool definitions - matching your API function signatures
export const mcpToolDefinitions = {
    listCustomers: {
        name: "listCustomers",
        description: "Get a list of all customers with their current status",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    getOverdueCustomers: {
        name: "getOverdueCustomers",
        description: "Get a list of customers with overdue payments and analytics",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    getCustomerDetails: {
        name: "getCustomerDetails",
        description: "Get detailed information about a specific customer",
        inputSchema: {
            type: "object",
            properties: {
                customerId: {
                    type: "number",
                    description: "The ID of the customer to get details for",
                },
            },
            required: ["customerId"],
        },
    },
    sendCustomerReminders: {
        name: "sendCustomerReminders",
        description: "Send reminder emails to overdue customers",
        inputSchema: {
            type: "object",
            properties: {
                customerIds: {
                    type: "array",
                    items: {
                        type: "number",
                    },
                    description: "Specific customer IDs to send emails to, or empty for all overdue customers",
                },
            },
            required: [],
        },
    },
    generateReport: {
        name: "generateReport",
        description: "Generate a comprehensive customer report with analytics",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    recommendAction: {
        name: "recommendAction",
        description: "Recommend the best action to take for customer management",
        inputSchema: {
            type: "object",
            properties: {
                scenario: {
                    type: "string",
                    description: "The current scenario or problem to get recommendations for",
                },
            },
            required: ["scenario"],
        },
    },
    // Legacy tool names for backward compatibility
    fetchCustomers: {
        name: "fetchCustomers",
        description: "Fetch all customers from the system (alias for listCustomers)",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    fetchOverdueCustomers: {
        name: "fetchOverdueCustomers",
        description: "Fetch customers with overdue payments (alias for getOverdueCustomers)",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    fetchCustomerById: {
        name: "fetchCustomerById",
        description: "Fetch a specific customer by their ID (alias for getCustomerDetails)",
        inputSchema: {
            type: "object",
            properties: {
                customerId: {
                    type: "number",
                    description: "The ID of the customer to fetch",
                },
            },
            required: ["customerId"],
        },
    },
    sendReminderEmails: {
        name: "sendReminderEmails",
        description: "Send reminder emails to customers (alias for sendCustomerReminders)",
        inputSchema: {
            type: "object",
            properties: {
                customerIds: {
                    type: "array",
                    items: {
                        type: "number",
                    },
                    description: "Specific customer IDs to send emails to",
                },
            },
            required: [],
        },
    },
    generateCustomerReport: {
        name: "generateCustomerReport",
        description: "Generate a comprehensive customer report (alias for generateReport)",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
}

// Tool implementations - returning data structures that match your API functions
export async function executeCustomerTool(name: string, parameters: any) {
    try {
        switch (name) {
            case "listCustomers":
            case "fetchCustomers": {
                const customerList = customers.map((customer) => ({
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    status: customer.status,
                    balance: customer.balance,
                    lastPayment: customer.lastPayment,
                }))

                // Return structure matching your fetchCustomers API
                return {
                    content: [
                        {
                            type: "text",
                            text: `Retrieved ${customerList.length} customers from the system`,
                        },
                    ],
                    // This is what your AI will receive - matching your API structure
                    customers: customerList,
                    totalCustomers: customerList.length,
                }
            }

            case "getOverdueCustomers":
            case "fetchOverdueCustomers": {
                const overdueCustomers = customers.filter((customer) => customer.status === "overdue")
                const totalOverdueAmount = overdueCustomers.reduce((sum, customer) => sum + (customer.overdueAmount || 0), 0)

                const overdueData = overdueCustomers.map((customer) => ({
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    overdueAmount: customer.overdueAmount,
                    dueDate: customer.dueDate,
                    daysPastDue: customer.daysPastDue,
                    lastPayment: customer.lastPayment,
                }))

                // Return structure matching your fetchOverdueCustomers API
                return {
                    content: [
                        {
                            type: "text",
                            text: `Found ${overdueCustomers.length} customers with overdue payments (Total: $${totalOverdueAmount.toFixed(2)})`,
                        },
                    ],
                    // This is what your AI will receive - matching your API structure
                    customers: overdueData,
                    totalOverdue: overdueCustomers.length,
                    totalAmount: totalOverdueAmount,
                }
            }

            case "getCustomerDetails":
            case "fetchCustomerById": {
                console.log("Executing getCustomerDetails with parameters:", parameters)
                const { customerId } = parameters
                const customer = customers.find((c) => c.id === customerId)

                if (!customer) {
                    // Return structure matching your error handling
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Customer with ID ${customerId} not found`,
                            },
                        ],
                        error: "Customer not found or failed to fetch details",
                    }
                }

                // Return structure matching your fetchCustomerById API
                return {
                    content: [
                        {
                            type: "text",
                            text: `Customer details for ${customer.name} (ID: ${customer.id})`,
                        },
                    ],
                    // This is what your AI will receive - matching your API structure
                    customer: {
                        ...customer,
                        accountAge: "2 years",
                        totalLifetimeValue: 5000.0,
                        riskLevel: customer.status === "overdue" ? "High" : "Low",
                    },
                }
            }

            case "sendCustomerReminders":
            case "sendReminderEmails": {
                const { customerIds } = parameters || {}
                let targetCustomers = customers

                if (customerIds && customerIds.length > 0) {
                    targetCustomers = customers.filter((customer) => customerIds.includes(customer.id))
                } else {
                    // If no specific IDs, target overdue customers
                    targetCustomers = customers.filter((customer) => customer.status === "overdue")
                }

                if (targetCustomers.length === 0) {
                    // Return structure matching your error handling
                    return {
                        content: [
                            {
                                type: "text",
                                text: "No customers found matching the criteria for email sending",
                            },
                        ],
                        error: "Failed to send reminder emails",
                        emailsSent: 0,
                        recipients: [],
                    }
                }

                // Simulate sending emails
                const recipients = targetCustomers.map((customer) => customer.email)

                // Simulate email sending delay
                await new Promise((resolve) => setTimeout(resolve, 100))

                // Return structure matching your sendReminderEmails API
                return {
                    content: [
                        {
                            type: "text",
                            text: `Successfully sent ${recipients.length} reminder emails to: ${recipients.join(", ")}`,
                        },
                    ],
                    // This is what your AI will receive - matching your API structure
                    emailsSent: recipients.length,
                    recipients,
                    message: `Successfully sent ${recipients.length} reminder emails`,
                }
            }

            case "generateReport":
            case "generateCustomerReport": {
                const totalCustomers = customers.length
                const currentCustomers = customers.filter((c) => c.status === "current").length
                const overdueCustomers = customers.filter((c) => c.status === "overdue")
                const totalOverdueAmount = overdueCustomers.reduce((sum, c) => sum + (c.overdueAmount || 0), 0)

                const overdueDetails = overdueCustomers.map((customer) => ({
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    overdueAmount: customer.overdueAmount,
                    dueDate: customer.dueDate,
                    daysPastDue: customer.daysPastDue,
                    lastPayment: customer.lastPayment,
                }))

                // Return structure matching your generateCustomerReport API
                return {
                    content: [
                        {
                            type: "text",
                            text: `Customer Report Summary:
  • Total Customers: ${totalCustomers}
  • Current Customers: ${currentCustomers}
  • Overdue Customers: ${overdueCustomers.length}
  • Total Overdue Amount: $${totalOverdueAmount.toFixed(2)}`,
                        },
                    ],
                    // This is what your AI will receive - matching your API structure
                    totalCustomers,
                    currentCustomers,
                    overdueCustomers: overdueCustomers.length,
                    totalOverdueAmount,
                    customers: customers.map((customer) => ({
                        id: customer.id,
                        name: customer.name,
                        email: customer.email,
                        status: customer.status,
                        balance: customer.balance,
                        lastPayment: customer.lastPayment,
                    })),
                    overdueDetails,
                }
            }

            case "recommendAction": {
                const { scenario } = parameters

                // Business logic for recommendations
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

                const matchedRecommendations = Object.entries(recommendations).find(([key]) =>
                    scenario.toLowerCase().includes(key),
                )

                // Return structure matching your recommendAction tool
                return {
                    content: [
                        {
                            type: "text",
                            text: `Recommendations for scenario: ${scenario}`,
                        },
                    ],
                    // This is what your AI will receive
                    scenario,
                    recommendations:
                        matchedRecommendations?.[1] || [
                            "Analyze current customer data",
                            "Identify patterns in customer behavior",
                            "Implement targeted communication strategies",
                        ],
                }
            }

            default:
                throw new Error(`Unknown tool: ${name}`)
        }
    } catch (error) {
        console.error(`Error executing tool ${name}:`, error)
        throw error
    }
}

// Server info for MCP servers
export const mcpServerInfo = {
    name: "customer-management-mcp-server",
    version: "1.0.0",
    description: "Customer management system with tools for handling customer data and overdue payments",
    protocolVersion: "2024-11-05",
    capabilities: {
        tools: {},
    },
}

// Helper function to get all tool names
export function getAllToolNames(): string[] {
    return Object.keys(mcpToolDefinitions)
}

// Helper function to get tool definition by name
export function getToolDefinition(name: string) {
    return mcpToolDefinitions[name as keyof typeof mcpToolDefinitions]
}

// Helper function to check if tool exists
export function toolExists(name: string): boolean {
    return name in mcpToolDefinitions
}
