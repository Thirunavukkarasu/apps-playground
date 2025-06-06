// Example using a hypothetical MCP handler library
import { createMcpHandler } from "@vercel/mcp-adapter"
import { z } from "zod"
import { customers } from "../mcp-custom/data"

// Create MCP handler with tools
const handler = createMcpHandler((server: any) => {
    // Set server info
    server.setServerInfo({
        name: "customer-management-mcp-server",
        version: "1.0.0",
        description: "A customer management system with tools for handling customer data and overdue payments",
    })

    // List all customers tool
    server.tool(
        "listCustomers",
        "Get a list of all customers with their current status",
        z.object({}),
        async () => {
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
                        text: `Found ${customers.length} customers in the system:`,
                    },
                    {
                        type: "json",
                        json: customerList,
                    },
                ],
                data: {
                    customers: customerList,
                    totalCount: customers.length,
                },
            }
        },
    )

    // Get overdue customers tool
    server.tool(
        "getOverdueCustomers",
        "Get a list of customers with overdue payments",
        z.object({
            sortBy: z.enum(["daysPastDue", "overdueAmount", "name"]).optional().describe("Sort overdue customers by field"),
            order: z.enum(["asc", "desc"]).optional().default("desc").describe("Sort order"),
        }),
        async ({ sortBy = "daysPastDue", order = "desc" }) => {
            let overdueCustomers = customers.filter((customer) => customer.status === "overdue")

            // Sort customers based on criteria
            if (sortBy) {
                overdueCustomers.sort((a, b) => {
                    let aValue: any, bValue: any

                    switch (sortBy) {
                        case "daysPastDue":
                            aValue = a.daysPastDue || 0
                            bValue = b.daysPastDue || 0
                            break
                        case "overdueAmount":
                            aValue = a.overdueAmount || 0
                            bValue = b.overdueAmount || 0
                            break
                        case "name":
                            aValue = a.name
                            bValue = b.name
                            break
                        default:
                            return 0
                    }

                    if (order === "asc") {
                        return aValue > bValue ? 1 : -1
                    } else {
                        return aValue < bValue ? 1 : -1
                    }
                })
            }

            const overdueData = overdueCustomers.map((customer) => ({
                id: customer.id,
                name: customer.name,
                email: customer.email,
                overdueAmount: customer.overdueAmount,
                dueDate: customer.dueDate,
                daysPastDue: customer.daysPastDue,
                lastPayment: customer.lastPayment,
            }))

            const totalOverdueAmount = overdueCustomers.reduce((sum, customer) => sum + (customer.overdueAmount || 0), 0)

            return {
                content: [
                    {
                        type: "text",
                        text: `Found ${overdueCustomers.length} customers with overdue payments (Total: $${totalOverdueAmount.toFixed(2)}):`,
                    },
                    {
                        type: "json",
                        json: overdueData,
                    },
                ],
                data: {
                    customers: overdueData,
                    totalOverdueCustomers: overdueCustomers.length,
                    totalOverdueAmount,
                    sortedBy: sortBy,
                    sortOrder: order,
                },
            }
        },
    )

    // Send reminder emails tool
    server.tool(
        "sendReminderEmails",
        "Send reminder emails to overdue customers",
        z.object({
            customerIds: z
                .array(z.number())
                .optional()
                .describe("Specific customer IDs to send emails to, or empty for all overdue customers"),
            emailTemplate: z
                .enum(["gentle", "urgent", "final"])
                .optional()
                .default("gentle")
                .describe("Email template to use"),
            dryRun: z.boolean().optional().default(false).describe("If true, simulate sending without actually sending"),
        }),
        async ({ customerIds, emailTemplate = "gentle", dryRun = false }: any) => {
            const overdueCustomers = customers.filter(
                (customer) => customer.status === "overdue" && (!customerIds || customerIds.includes(customer.id)),
            )

            if (overdueCustomers.length === 0) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "No overdue customers found matching the criteria.",
                        },
                    ],
                    data: {
                        emailsSent: 0,
                        recipients: [],
                        message: "No emails sent - no matching overdue customers",
                    },
                }
            }

            // Email templates
            const templates: any = {
                gentle: {
                    subject: "Friendly Payment Reminder",
                    tone: "polite and understanding",
                },
                urgent: {
                    subject: "Urgent: Payment Required",
                    tone: "firm but professional",
                },
                final: {
                    subject: "Final Notice: Immediate Payment Required",
                    tone: "serious and direct",
                },
            }

            const template = templates[emailTemplate]

            // Simulate sending emails
            const emailPromises = overdueCustomers.map(async (customer) => {
                const emailContent = {
                    to: customer.email,
                    subject: template.subject,
                    customerName: customer.name,
                    overdueAmount: customer.overdueAmount,
                    daysPastDue: customer.daysPastDue,
                    dueDate: customer.dueDate,
                    template: emailTemplate,
                }

                if (!dryRun) {
                    console.log(`Sending ${emailTemplate} reminder email to ${customer.email}`)
                    console.log(`Subject: ${template.subject}`)
                    console.log(`Amount Due: $${customer.overdueAmount}`)
                    console.log(`Days Overdue: ${customer.daysPastDue}`)
                    console.log(`Template: ${template.tone}`)

                    // Simulate email sending delay
                    await new Promise((resolve) => setTimeout(resolve, 100))
                } else {
                    console.log(`[DRY RUN] Would send ${emailTemplate} email to ${customer.email}`)
                }

                return emailContent
            })

            const emailResults = await Promise.all(emailPromises)
            const recipients = emailResults.map((email) => email.to)

            return {
                content: [
                    {
                        type: "text",
                        text: dryRun
                            ? `[DRY RUN] Would send ${emailResults.length} ${emailTemplate} reminder emails to: ${recipients.join(", ")}`
                            : `Successfully sent ${emailResults.length} ${emailTemplate} reminder emails to: ${recipients.join(", ")}`,
                    },
                    {
                        type: "json",
                        json: emailResults,
                    },
                ],
                data: {
                    emailsSent: emailResults.length,
                    recipients,
                    template: emailTemplate,
                    dryRun,
                    message: dryRun
                        ? `Dry run completed - ${emailResults.length} emails would be sent`
                        : `Successfully sent ${emailResults.length} reminder emails`,
                },
            }
        },
    )

    // Get customer details tool
    server.tool(
        "getCustomerDetails",
        "Get detailed information about a specific customer",
        z.object({
            customerId: z.number().describe("The ID of the customer to get details for"),
            includeHistory: z.boolean().optional().default(false).describe("Include payment history if available"),
        }),
        async ({ customerId, includeHistory = false }: any) => {
            const customer = customers.find((c) => c.id === customerId)

            if (!customer) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Customer with ID ${customerId} not found.`,
                        },
                    ],
                    data: {
                        error: "Customer not found",
                        customerId,
                    },
                }
            }

            // Mock payment history if requested
            const paymentHistory = includeHistory
                ? [
                    {
                        date: customer.lastPayment,
                        amount: customer.status === "current" ? customer.balance : 500.0,
                        method: "Credit Card",
                        status: "Completed",
                    },
                    {
                        date: "2023-10-15",
                        amount: 750.0,
                        method: "Bank Transfer",
                        status: "Completed",
                    },
                ]
                : undefined

            const customerDetails = {
                ...customer,
                ...(includeHistory && { paymentHistory }),
                accountAge: "2 years",
                totalLifetimeValue: 5000.0,
                riskLevel: customer.status === "overdue" ? "High" : "Low",
            }

            return {
                content: [
                    {
                        type: "text",
                        text: `Customer details for ${customer.name} (ID: ${customer.id}):`,
                    },
                    {
                        type: "json",
                        json: customerDetails,
                    },
                ],
                data: {
                    customer: customerDetails,
                    includeHistory,
                },
            }
        },
    )

    // Add customer tool
    server.tool(
        "addCustomer",
        "Add a new customer to the system",
        z.object({
            name: z.string().describe("Customer's full name"),
            email: z.string().email().describe("Customer's email address"),
            initialBalance: z.number().optional().default(0).describe("Initial account balance"),
        }),
        async ({ name, email, initialBalance = 0 }: any) => {
            // Check if customer already exists
            const existingCustomer = customers.find((c) => c.email.toLowerCase() === email.toLowerCase())

            if (existingCustomer) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Customer with email ${email} already exists (ID: ${existingCustomer.id}).`,
                        },
                    ],
                    data: {
                        error: "Customer already exists",
                        existingCustomer,
                    },
                }
            }

            // Create new customer
            const newCustomer = {
                id: Math.max(...customers.map((c) => c.id)) + 1,
                name,
                email,
                status: "current" as const,
                balance: initialBalance,
                lastPayment: new Date().toISOString().split("T")[0],
            }

            // Add to customers array (in real app, this would be a database operation)
            customers.push(newCustomer)

            return {
                content: [
                    {
                        type: "text",
                        text: `Successfully added new customer: ${name} (ID: ${newCustomer.id})`,
                    },
                    {
                        type: "json",
                        json: newCustomer,
                    },
                ],
                data: {
                    customer: newCustomer,
                    message: "Customer added successfully",
                },
            }
        },
    )

    // Update customer status tool
    server.tool(
        "updateCustomerStatus",
        "Update a customer's status and balance",
        z.object({
            customerId: z.number().describe("The ID of the customer to update"),
            status: z.enum(["current", "overdue"]).describe("New customer status"),
            balance: z.number().optional().describe("New account balance"),
            overdueAmount: z.number().optional().describe("Overdue amount if status is overdue"),
            dueDate: z.string().optional().describe("Due date for overdue payments (YYYY-MM-DD)"),
        }),
        async ({ customerId, status, balance, overdueAmount, dueDate }: any) => {
            const customerIndex = customers.findIndex((c) => c.id === customerId)

            if (customerIndex === -1) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Customer with ID ${customerId} not found.`,
                        },
                    ],
                    data: {
                        error: "Customer not found",
                        customerId,
                    },
                }
            }

            const customer = customers[customerIndex]
            const oldStatus = customer.status

            // Update customer
            customer.status = status
            if (balance !== undefined) customer.balance = balance

            if (status === "overdue") {
                if (overdueAmount !== undefined) customer.overdueAmount = overdueAmount
                if (dueDate) customer.dueDate = dueDate
                if (dueDate) {
                    const due = new Date(dueDate)
                    const today = new Date()
                    customer.daysPastDue = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
                }
            } else {
                // Clear overdue fields if status is current
                delete customer.overdueAmount
                delete customer.dueDate
                delete customer.daysPastDue
            }

            return {
                content: [
                    {
                        type: "text",
                        text: `Successfully updated customer ${customer.name} (ID: ${customerId}) status from "${oldStatus}" to "${status}"`,
                    },
                    {
                        type: "json",
                        json: customer,
                    },
                ],
                data: {
                    customer,
                    oldStatus,
                    newStatus: status,
                    message: "Customer status updated successfully",
                },
            }
        },
    )

    // Get customer statistics tool
    server.tool(
        "getCustomerStatistics",
        "Get overall statistics about customers and payments",
        z.object({}),
        async () => {
            const totalCustomers = customers.length
            const currentCustomers = customers.filter((c) => c.status === "current").length
            const overdueCustomers = customers.filter((c) => c.status === "overdue").length
            const totalBalance = customers.reduce((sum, c) => sum + c.balance, 0)
            const totalOverdueAmount = customers
                .filter((c) => c.status === "overdue")
                .reduce((sum, c) => sum + (c.overdueAmount || 0), 0)

            const averageBalance = totalCustomers > 0 ? totalBalance / totalCustomers : 0
            const overduePercentage = totalCustomers > 0 ? (overdueCustomers / totalCustomers) * 100 : 0

            const statistics = {
                totalCustomers,
                currentCustomers,
                overdueCustomers,
                totalBalance: parseFloat(totalBalance.toFixed(2)),
                totalOverdueAmount: parseFloat(totalOverdueAmount.toFixed(2)),
                averageBalance: parseFloat(averageBalance.toFixed(2)),
                overduePercentage: parseFloat(overduePercentage.toFixed(2)),
                generatedAt: new Date().toISOString(),
            }

            return {
                content: [
                    {
                        type: "text",
                        text: `Customer Statistics Summary:
• Total Customers: ${totalCustomers}
• Current Customers: ${currentCustomers}
• Overdue Customers: ${overdueCustomers} (${overduePercentage.toFixed(1)}%)
• Total Balance: $${totalBalance.toFixed(2)}
• Total Overdue Amount: $${totalOverdueAmount.toFixed(2)}
• Average Balance: $${averageBalance.toFixed(2)}`,
                    },
                    {
                        type: "json",
                        json: statistics,
                    },
                ],
                data: statistics,
            }
        },
    )
})

// Export the handler for all HTTP methods
export { handler as GET, handler as POST, handler as DELETE }
