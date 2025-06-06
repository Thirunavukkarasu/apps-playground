// API functions that can be reused throughout the application
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
export async function fetchCustomers() {
    try {
        const response = await fetch(`${baseUrl}/api/customers`)
        const data = await response.json()

        if (!data.success) {
            throw new Error(data.error)
        }

        return data.customers
    } catch (error) {
        console.error("Failed to fetch customers:", error)
        throw error
    }
}

export async function fetchOverdueCustomers() {
    try {
        const response = await fetch(`${baseUrl}/api/customers/overdue`)
        const data = await response.json()

        if (!data.success) {
            throw new Error(data.error)
        }

        return {
            customers: data.customers,
            totalOverdue: data.totalOverdue,
            totalAmount: data.totalAmount,
        }
    } catch (error) {
        console.error("Failed to fetch overdue customers:", error)
        throw error
    }
}

export async function fetchCustomerById(customerId: number) {
    try {
        const response = await fetch(
            `${baseUrl}/api/customers/${customerId}`,
        )
        const data = await response.json()

        if (!data.success) {
            throw new Error(data.error)
        }

        return data.customer
    } catch (error) {
        console.error("Failed to fetch customer:", error)
        throw error
    }
}

export async function sendReminderEmails(customerIds?: number[]) {
    try {
        const response = await fetch(
            `${baseUrl}/api/emails/send-reminders`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ customerIds }),
            },
        )

        const data = await response.json()

        if (!data.success) {
            throw new Error(data.error)
        }

        return {
            emailsSent: data.emailsSent,
            recipients: data.recipients,
            message: data.message,
        }
    } catch (error) {
        console.error("Failed to send reminder emails:", error)
        throw error
    }
}

export async function generateCustomerReport() {
    try {
        const [customers, overdueData] = await Promise.all([fetchCustomers(), fetchOverdueCustomers()])

        return {
            totalCustomers: customers.length,
            currentCustomers: customers.filter((c: any) => c.status === "current").length,
            overdueCustomers: overdueData.totalOverdue,
            totalOverdueAmount: overdueData.totalAmount,
            customers,
            overdueDetails: overdueData.customers,
        }
    } catch (error) {
        console.error("Failed to generate customer report:", error)
        throw error
    }
}
