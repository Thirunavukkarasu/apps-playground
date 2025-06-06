import { NextResponse } from "next/server"

const overdueCustomers = [
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

export async function GET() {
    try {
        return NextResponse.json({
            success: true,
            customers: overdueCustomers.map((customer) => ({
                id: customer.id,
                name: customer.name,
                email: customer.email,
                overdueAmount: customer.overdueAmount,
                dueDate: customer.dueDate,
                daysPastDue: customer.daysPastDue,
                lastPayment: customer.lastPayment,
            })),
            totalOverdue: overdueCustomers.length,
            totalAmount: overdueCustomers.reduce((sum, customer) => sum + customer.overdueAmount, 0),
        })
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch overdue customers" }, { status: 500 })
    }
}
