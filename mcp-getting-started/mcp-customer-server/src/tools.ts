// Common MCP tools definitions and implementations

import { customers } from "./mock-data"

// MCP Tool definitions - matching your API function signatures
export const mcpToolDefinitions = [
    {
        name: "listCustomers",
        description: "Get a list of all customers with their current status",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "getOverdueCustomers",
        description: "Get a list of customers with overdue payments and analytics",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
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
    {
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
    {
        name: "generateReport",
        description: "Generate a comprehensive customer report with analytics",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
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
]

// Tool implementations - returning data structures that match your API functions
export async function executeCustomerTool(name: string, parameters: any) {
    try {
        switch (name) {
            case "listCustomers": {
                const customerList = customers.map((customer) => ({
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    status: customer.status,
                    balance: customer.balance,
                    lastPayment: customer.lastPayment,
                }))

                return {
                    content: [
                        {
                            type: "text",
                            text: `Retrieved ${customerList.length} customers from the system`,
                        },
                        {
                            type: "json",
                            json: {
                                customers: customerList,
                                totalCustomers: customerList.length,
                            },
                        },
                    ],
                    customers: customerList,
                    totalCustomers: customerList.length,
                }
            }

            case "getOverdueCustomers": {
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

                return {
                    content: [
                        {
                            type: "text",
                            text: `Found ${overdueCustomers.length} customers with overdue payments (Total: $${totalOverdueAmount.toFixed(2)})`,
                        },
                        {
                            type: "json",
                            json: {
                                customers: overdueData,
                                totalOverdue: overdueCustomers.length,
                                totalAmount: totalOverdueAmount,
                            },
                        },
                    ],
                    customers: overdueData,
                    totalOverdue: overdueCustomers.length,
                    totalAmount: totalOverdueAmount,
                }
            }

            case "getCustomerDetails": {
                const { customerId } = parameters || {}
                const customer = customers.find((c) => c.id === customerId)

                if (!customer) {
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

                const customerDetails = {
                    ...customer,
                    accountAge: "2 years",
                    totalLifetimeValue: 5000.0,
                    riskLevel: customer.status === "overdue" ? "High" : "Low",
                }

                return {
                    content: [
                        {
                            type: "text",
                            text: `Customer details for ${customer.name} (ID: ${customer.id})`,
                        },
                        {
                            type: "json",
                            json: { customer: customerDetails },
                        },
                    ],
                    customer: customerDetails,
                }
            }

            case "sendCustomerReminders": {
                const { customerIds } = parameters || {}
                let targetCustomers = customers

                if (customerIds && customerIds.length > 0) {
                    targetCustomers = customers.filter((customer) => customerIds.includes(customer.id))
                } else {
                    targetCustomers = customers.filter((customer) => customer.status === "overdue")
                }

                if (targetCustomers.length === 0) {
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

                const recipients = targetCustomers.map((customer) => customer.email)
                await new Promise((resolve) => setTimeout(resolve, 100))

                return {
                    content: [
                        {
                            type: "text",
                            text: `Successfully sent ${recipients.length} reminder emails to: ${recipients.join(", ")}`,
                        },
                        {
                            type: "json",
                            json: {
                                emailsSent: recipients.length,
                                recipients,
                                message: `Successfully sent ${recipients.length} reminder emails`,
                            },
                        },
                    ],
                    emailsSent: recipients.length,
                    recipients,
                    message: `Successfully sent ${recipients.length} reminder emails`,
                }
            }

            //             case "generateReport": {
            //                 const totalCustomers = customers.length
            //                 const currentCustomers = customers.filter((c) => c.status === "current").length
            //                 const overdueCustomers = customers.filter((c) => c.status === "overdue")
            //                 const totalOverdueAmount = overdueCustomers.reduce((sum, c) => sum + (c.overdueAmount || 0), 0)

            //                 const overdueDetails = overdueCustomers.map((customer) => ({
            //                     id: customer.id,
            //                     name: customer.name,
            //                     email: customer.email,
            //                     overdueAmount: customer.overdueAmount,
            //                     dueDate: customer.dueDate,
            //                     daysPastDue: customer.daysPastDue,
            //                     lastPayment: customer.lastPayment,
            //                 }))

            //                 const reportData = {
            //                     totalCustomers,
            //                     currentCustomers,
            //                     overdueCustomers: overdueCustomers.length,
            //                     totalOverdueAmount,
            //                     customers: customers.map((customer) => ({
            //                         id: customer.id,
            //                         name: customer.name,
            //                         email: customer.email,
            //                         status: customer.status,
            //                         balance: customer.balance,
            //                         lastPayment: customer.lastPayment,
            //                     })),
            //                     overdueDetails,
            //                 }

            //                 return {
            //                     content: [
            //                         {
            //                             type: "text",
            //                             text: `Customer Report Summary:
            //   • Total Customers: ${totalCustomers}
            //   • Current Customers: ${currentCustomers}
            //   • Overdue Customers: ${overdueCustomers.length}
            //   • Total Overdue Amount: $${totalOverdueAmount.toFixed(2)}`,
            //                         },
            //                         {
            //                             type: "json",
            //                             json: reportData,
            //                         },
            //                     ],
            //                     ...reportData,
            //                 }
            //             }

            case "recommendAction": {
                const { scenario } = parameters || {}

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
                    scenario?.toLowerCase().includes(key),
                )

                const result = {
                    scenario,
                    recommendations: matchedRecommendations?.[1] || [
                        "Analyze current customer data",
                        "Identify patterns in customer behavior",
                        "Implement targeted communication strategies",
                    ],
                }

                return {
                    content: [
                        {
                            type: "text",
                            text: `Recommendations for scenario: ${scenario}`,
                        },
                        {
                            type: "json",
                            json: result,
                        },
                    ],
                    ...result,
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
