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
        address: "123 Main St, New York, NY 10001",
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
        address: "456 Oak Ave, Los Angeles, CA 90210",
        joinDate: "2023-03-20",
    },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const customerId = Number.parseInt(params.id)
        const customer = customers.find((c) => c.id === customerId)

        if (!customer) {
            return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            customer,
        })
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch customer details" }, { status: 500 })
    }
}
