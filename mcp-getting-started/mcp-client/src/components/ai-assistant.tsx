"use client"
import { useEffect, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Users, AlertTriangle, Mail, BarChart3, Lightbulb, User, X } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface AIAssistantProps {
    onClose?: () => void
    className?: string
}

export default function AIAssistant({ onClose, className }: AIAssistantProps) {
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/chat",
    })

    const quickActions = [
        { text: "Show me all customers", icon: Users, color: "blue" },
        { text: "Find overdue customers", icon: AlertTriangle, color: "red" },
        { text: "Generate customer report", icon: BarChart3, color: "green" },
        { text: "Send reminder emails to overdue customers", icon: Mail, color: "purple" },
        { text: "Recommend actions for high overdue amounts", icon: Lightbulb, color: "yellow" },
    ]

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
    }, [messages])

    const handleQuickAction = (actionText: string) => {
        const syntheticEvent = {
            preventDefault: () => { },
            target: { value: actionText },
        } as any
        handleInputChange(syntheticEvent)
        handleSubmit(syntheticEvent)
    }

    const renderToolResult = (tool: any, index: number) => {
        const { toolName, result } = tool

        switch (toolName) {
            case "listCustomers":
                return (
                    <div key={index} className="mb-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-500" />
                            Customer List ({result?.totalCustomers || 0} total)
                        </h4>
                        {result?.success ? (
                            <div className="space-y-2">
                                {result.customers?.map((customer: any) => (
                                    <div key={customer.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <div>
                                            <span className="font-medium">{customer.name}</span>
                                            <span className="text-sm text-gray-600 ml-2">{customer.email}</span>
                                        </div>
                                        <Badge variant={customer.status === "overdue" ? "destructive" : "secondary"}>
                                            {customer.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{result?.error}</div>
                        )}
                    </div>
                )

            case "getOverdueCustomers":
                return (
                    <div key={index} className="mb-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            Overdue Customers ({result?.totalOverdue || 0}) - Total: ${result?.totalAmount || 0}
                        </h4>
                        {result?.success ? (
                            <div className="space-y-2">
                                {result.customers?.map((customer: any) => (
                                    <div key={customer.id} className="p-3 bg-red-50 border border-red-200 rounded">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-medium">{customer.name}</span>
                                                <span className="text-sm text-gray-600 ml-2">{customer.email}</span>
                                            </div>
                                            <Badge variant="destructive">${customer.overdueAmount}</Badge>
                                        </div>
                                        <p className="text-sm text-red-600 mt-1">
                                            Due: {customer.dueDate} ({customer.daysPastDue} days overdue)
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{result?.error}</div>
                        )}
                    </div>
                )

            case "generateReport":
                return (
                    <div key={index} className="mb-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-green-500" />
                            Customer Analytics Report
                        </h4>
                        {result?.success ? (
                            <div className="p-3 bg-green-50 border border-green-200 rounded">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <strong>Total Customers:</strong> {result.totalCustomers}
                                    </div>
                                    <div>
                                        <strong>Current Customers:</strong> {result.currentCustomers}
                                    </div>
                                    <div>
                                        <strong>Overdue Customers:</strong> {result.overdueCustomers}
                                    </div>
                                    <div>
                                        <strong>Total Overdue Amount:</strong> ${result.totalOverdueAmount}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{result?.error}</div>
                        )}
                    </div>
                )

            case "sendReminderEmails":
                return (
                    <div key={index} className="mb-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Mail className="h-4 w-4 text-purple-500" />
                            Email Status
                        </h4>
                        {result?.success ? (
                            <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                                <p className="text-purple-800">✅ {result.message}</p>
                                <div className="mt-2 space-y-1">
                                    {result.recipients?.map((email: string, idx: number) => (
                                        <p key={idx} className="text-sm text-purple-700">
                                            • {email}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{result?.error}</div>
                        )}
                    </div>
                )

            case "recommendAction":
                return (
                    <div key={index} className="mb-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-yellow-500" />
                            Recommendations for: {result?.scenario}
                        </h4>
                        {result?.success ? (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                <ul className="space-y-1">
                                    {result.recommendations?.map((rec: string, idx: number) => (
                                        <li key={idx} className="text-sm text-yellow-800">
                                            • {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{result?.error}</div>
                        )}
                    </div>
                )

            case "getCustomerDetails":
                return (
                    <div key={index} className="mb-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-500" />
                            Customer Details
                        </h4>
                        {result?.success && result.customer ? (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <strong>Name:</strong> {result.customer.name}
                                    </div>
                                    <div>
                                        <strong>Email:</strong> {result.customer.email}
                                    </div>
                                    <div>
                                        <strong>Status:</strong>
                                        <Badge
                                            className="ml-2"
                                            variant={result.customer.status === "overdue" ? "destructive" : "secondary"}
                                        >
                                            {result.customer.status}
                                        </Badge>
                                    </div>
                                    <div>
                                        <strong>Balance:</strong> ${result.customer.balance}
                                    </div>
                                    {result.customer.phone && (
                                        <div>
                                            <strong>Phone:</strong> {result.customer.phone}
                                        </div>
                                    )}
                                    <div>
                                        <strong>Last Payment:</strong> {result.customer.lastPayment}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{result?.error}</div>
                        )}
                    </div>
                )

            default:
                return (
                    <div key={index} className="mb-4">
                        <h4 className="font-semibold mb-2">{toolName}</h4>
                        <div className="p-3 bg-gray-50 border rounded">
                            <pre className="text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div>
                    <h2 className="text-xl font-semibold">AI Customer Assistant</h2>
                    <p className="text-sm text-gray-600">Powered by MCP Tools + Custom APIs</p>
                </div>
                {onClose && (
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b">
                <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {quickActions.map((action, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="justify-start gap-2 h-auto p-2"
                            onClick={() => handleQuickAction(action.text)}
                            disabled={isLoading}
                        >
                            <action.icon className="h-3 w-3" />
                            <span className="text-xs">{action.text}</span>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={messagesContainerRef}>
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Ask me about customers, analytics, recommendations, or email management!</p>
                        <p className="text-sm mt-2">Enhanced with MCP tools + custom APIs</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-blue-600 text-white" : "bg-white border shadow-sm"
                                        }`}
                                >
                                    {message.role === "assistant" && message.toolInvocations ? (
                                        <div>
                                            {message.toolInvocations.map((tool, index) => renderToolResult(tool, index))}
                                            {message.content && (
                                                <div className="mt-2">
                                                    <div className="prose prose-sm max-w-none">
                                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="prose prose-sm max-w-none text-inherit">
                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask about customers, get recommendations, or request analytics..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
