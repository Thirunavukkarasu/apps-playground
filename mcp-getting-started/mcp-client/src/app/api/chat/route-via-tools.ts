import { openai } from "@ai-sdk/openai"
import { streamText, tool } from "ai"
import { z } from "zod"

// Mock customer data
const customers = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        status: "current",
        balance: 0,
        lastPayment: "2024-01-15",
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        status: "overdue",
        balance: 1250.0,
        overdueAmount: 1250.0,
        dueDate: "2023-12-15",
        daysPastDue: 23,
        lastPayment: "2023-11-10",
    },
    {
        id: 3,
        name: "Mike Davis",
        email: "mike.davis@example.com",
        status: "current",
        balance: 500.0,
        lastPayment: "2024-01-10",
    },
    {
        id: 4,
        name: "Emily Wilson",
        email: "emily.wilson@example.com",
        status: "overdue",
        balance: 2100.0,
        overdueAmount: 2100.0,
        dueDate: "2023-12-20",
        daysPastDue: 18,
        lastPayment: "2023-10-15",
    },
    {
        id: 5,
        name: "Robert Brown",
        email: "robert.brown@example.com",
        status: "overdue",
        balance: 750.0,
        overdueAmount: 750.0,
        dueDate: "2023-12-10",
        daysPastDue: 28,
        lastPayment: "2023-09-20",
    },
]

export async function POST(req: Request) {
    const { messages } = await req.json()

    const result = streamText({
        model: openai("gpt-4"),
        messages,
        system: `You are a helpful customer management assistant. You can help with:
    - Listing all customers
    - Finding overdue customers
    - Sending reminder emails
    
    Always be professional and provide clear, actionable information about customer accounts.`,
        tools: {
            listCustomers: tool({
                description: "Get a list of all customers with their current status",
                parameters: z.object({}),
                execute: async () => {
                    return {
                        customers: customers.map((customer) => ({
                            id: customer.id,
                            name: customer.name,
                            email: customer.email,
                            status: customer.status,
                            balance: customer.balance,
                            lastPayment: customer.lastPayment,
                        })),
                    }
                },
            }),

            getOverdueCustomers: tool({
                description: "Get a list of customers with overdue payments",
                parameters: z.object({}),
                execute: async () => {
                    const overdueCustomers = customers.filter((customer) => customer.status === "overdue")
                    return {
                        customers: overdueCustomers.map((customer) => ({
                            id: customer.id,
                            name: customer.name,
                            email: customer.email,
                            overdueAmount: customer.overdueAmount,
                            dueDate: customer.dueDate,
                            daysPastDue: customer.daysPastDue,
                            lastPayment: customer.lastPayment,
                        })),
                    }
                },
            }),

            sendReminderEmails: tool({
                description: "Send reminder emails to overdue customers",
                parameters: z.object({
                    customerIds: z
                        .array(z.number())
                        .optional()
                        .describe("Specific customer IDs to send emails to, or empty for all overdue customers"),
                }),
                execute: async ({ customerIds }) => {
                    const overdueCustomers = customers.filter(
                        (customer) => customer.status === "overdue" && (!customerIds || customerIds.includes(customer.id)),
                    )

                    // Simulate sending emails
                    const emailPromises = overdueCustomers.map(async (customer) => {
                        // In a real app, you would integrate with an email service like:
                        // - Resend
                        // - SendGrid
                        // - Nodemailer
                        // - AWS SES

                        console.log(`Sending reminder email to ${customer.email}`)
                        console.log(`Subject: Payment Reminder - Account Overdue`)
                        console.log(`Amount Due: $${customer.overdueAmount}`)
                        console.log(`Days Overdue: ${customer.daysPastDue}`)

                        // Simulate email sending delay
                        await new Promise((resolve) => setTimeout(resolve, 100))

                        return customer.email
                    })

                    const sentEmails = await Promise.all(emailPromises)

                    return {
                        emailsSent: sentEmails.length,
                        recipients: sentEmails,
                        message: `Successfully sent ${sentEmails.length} reminder emails`,
                    }
                },
            }),

            getCustomerDetails: tool({
                description: "Get detailed information about a specific customer",
                parameters: z.object({
                    customerId: z.number().describe("The ID of the customer to get details for"),
                }),
                execute: async ({ customerId }) => {
                    const customer = customers.find((c) => c.id === customerId)
                    if (!customer) {
                        return { error: "Customer not found" }
                    }
                    return { customer }
                },
            }),
        },
    })

    return result.toDataStreamResponse()
}
