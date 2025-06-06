import { NextResponse } from "next/server"

const customers = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        status: "current",
        balance: 0,
        lastPayment: "2024-01-15",
        phone: "+1-555-0101",
        joinDate: "2023-06-15",
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
        phone: "+1-555-0102",
        joinDate: "2023-03-20",
    },
    {
        id: 3,
        name: "Mike Davis",
        email: "mike.davis@example.com",
        status: "current",
        balance: 500.0,
        lastPayment: "2024-01-10",
        phone: "+1-555-0103",
        joinDate: "2023-08-12",
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
        phone: "+1-555-0104",
        joinDate: "2023-02-28",
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
        phone: "+1-555-0105",
        joinDate: "2023-01-10",
    },
]

export async function GET() {
    try {
        return NextResponse.json({
            success: true,
            customers: customers.map((customer) => ({
                id: customer.id,
                name: customer.name,
                email: customer.email,
                status: customer.status,
                balance: customer.balance,
                lastPayment: customer.lastPayment,
                phone: customer.phone,
                joinDate: customer.joinDate,
            })),
        })
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch customers" }, { status: 500 })
    }
}
