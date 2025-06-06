"use client"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Users, AlertTriangle, Mail, BarChart3, Lightbulb, Search, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  const quickActions = [
    { text: "Show me all customers", icon: Users, color: "blue" },
    { text: "Find overdue customers", icon: AlertTriangle, color: "red" },
    { text: "Generate customer report", icon: BarChart3, color: "green" },
    { text: "Calculate customer metrics for this month", icon: TrendingUp, color: "purple" },
    { text: "Search for customers with 'john'", icon: Search, color: "orange" },
    { text: "Send reminder emails to overdue customers", icon: Mail, color: "blue" },
    { text: "Recommend actions for high overdue amounts", icon: Lightbulb, color: "yellow" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Customer Management Platform</h1>
          <p className="text-gray-600">AI-powered customer management with MCP Server integration</p>
          <div className="mt-2 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              MCP Server Active
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Quick Actions - Enhanced with MCP Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start gap-2 h-auto p-3 text-left"
                    onClick={() => {
                      const syntheticEvent = {
                        preventDefault: () => { },
                        target: { value: action.text },
                      } as any
                      handleInputChange(syntheticEvent)
                      handleSubmit(syntheticEvent)
                    }}
                  >
                    <action.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{action.text}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-white rounded-lg shadow-lg h-[700px] flex flex-col">
            <CardContent className="flex-1 flex flex-col p-6">
              <ScrollArea className="flex-1 mb-4 p-4 border rounded-lg bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Welcome to your AI Customer Assistant!</p>
                    <p className="text-sm">Ask me about customers, analytics, recommendations, or email management</p>
                    <p className="text-xs mt-2 text-gray-400">
                      Powered by MCP Server + Custom APIs for enhanced functionality
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message: any) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-blue-600 text-white" : "bg-white border shadow-sm"
                            }`}
                        >
                          {message.role === "assistant" && message.toolInvocations ? (
                            <div className="space-y-2">
                              {message.toolInvocations.map((tool: any, index: any) => (
                                <div key={index}>
                                  {/* List Customers Tool */}
                                  {tool.toolName === "listCustomers" && tool.result && (
                                    <div>
                                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Customer List (
                                        {tool.result.totalCustomers || tool.result.customers?.length || 0} total)
                                      </h4>
                                      {tool.result.customers && tool.result.customers.length > 0 ? (
                                        <div className="space-y-2">
                                          {tool.result.customers.map((customer: any) => (
                                            <div
                                              key={customer.id}
                                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                            >
                                              <div>
                                                <span className="font-medium">{customer.name}</span>
                                                <span className="text-sm text-gray-600 ml-2">{customer.email}</span>
                                              </div>
                                              <Badge
                                                variant={customer.status === "overdue" ? "destructive" : "secondary"}
                                              >
                                                {customer.status}
                                              </Badge>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="p-3 bg-gray-50 border rounded text-gray-600">
                                          No customers found
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Overdue Customers Tool */}
                                  {tool.toolName === "getOverdueCustomers" && tool.result && (
                                    <div>
                                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        Overdue Customers (
                                        {tool.result.totalOverdue || tool.result.customers?.length || 0})
                                        {tool.result.totalAmount && ` - Total: $${tool.result.totalAmount}`}
                                      </h4>
                                      {tool.result.customers && tool.result.customers.length > 0 ? (
                                        <div className="space-y-2">
                                          {tool.result.customers.map((customer: any) => (
                                            <div
                                              key={customer.id}
                                              className="p-3 bg-red-50 border border-red-200 rounded"
                                            >
                                              <div className="flex items-center justify-between">
                                                <div>
                                                  <span className="font-medium">{customer.name}</span>
                                                  <span className="text-sm text-gray-600 ml-2">{customer.email}</span>
                                                </div>
                                                <Badge variant="destructive">
                                                  ${customer.overdueAmount || customer.balance}
                                                </Badge>
                                              </div>
                                              {customer.daysPastDue && (
                                                <p className="text-sm text-red-600 mt-1">
                                                  {customer.daysPastDue} days overdue
                                                </p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700">
                                          No overdue customers found
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Customer Report Tool */}
                                  {(tool.toolName === "generateReport" || tool.toolName === "generateCustomerReport") &&
                                    tool.result && (
                                      <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                          <BarChart3 className="h-4 w-4 text-blue-500" />
                                          Customer Analytics Report
                                        </h4>
                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                          <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                              <strong>Total Customers:</strong> {tool.result.totalCustomers || 0}
                                            </div>
                                            <div>
                                              <strong>Current Customers:</strong> {tool.result.currentCustomers || 0}
                                            </div>
                                            <div>
                                              <strong>Overdue Customers:</strong> {tool.result.overdueCustomers || 0}
                                            </div>
                                            <div>
                                              <strong>Total Overdue Amount:</strong> $
                                              {tool.result.totalOverdueAmount || 0}
                                            </div>
                                          </div>
                                          {tool.result.summary && (
                                            <p className="text-sm text-blue-700 mt-2">{tool.result.summary}</p>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                  {/* Email Tool */}
                                  {(tool.toolName === "sendReminderEmails" ||
                                    tool.toolName === "sendCustomerReminders") &&
                                    tool.result && (
                                      <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                          <Mail className="h-4 w-4 text-green-500" />
                                          Email Status
                                        </h4>
                                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                                          <p className="text-green-800">
                                            ✅ {tool.result.message || `Sent ${tool.result.emailsSent || 0} emails`}
                                          </p>
                                          {tool.result.recipients && tool.result.recipients.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                              {tool.result.recipients.map((email: string, idx: number) => (
                                                <p key={idx} className="text-sm text-green-700">
                                                  • {email}
                                                </p>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                  {/* Customer Details Tool */}
                                  {tool.toolName === "getCustomerDetails" && tool.result && (
                                    <div>
                                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <Users className="h-4 w-4 text-blue-500" />
                                        Customer Details
                                      </h4>
                                      {tool.result.customer ? (
                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                          <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                              <strong>Name:</strong> {tool.result.customer.name}
                                            </div>
                                            <div>
                                              <strong>Email:</strong> {tool.result.customer.email}
                                            </div>
                                            <div>
                                              <strong>Status:</strong>
                                              <Badge
                                                className="ml-2"
                                                variant={
                                                  tool.result.customer.status === "overdue"
                                                    ? "destructive"
                                                    : "secondary"
                                                }
                                              >
                                                {tool.result.customer.status}
                                              </Badge>
                                            </div>
                                            <div>
                                              <strong>Balance:</strong> ${tool.result.customer.balance}
                                            </div>
                                            {tool.result.customer.phone && (
                                              <div>
                                                <strong>Phone:</strong> {tool.result.customer.phone}
                                              </div>
                                            )}
                                            <div>
                                              <strong>Last Payment:</strong> {tool.result.customer.lastPayment}
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
                                          {tool.result.error || "Customer not found"}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Recommendations Tool */}
                                  {tool.toolName === "recommendAction" && tool.result && (
                                    <div>
                                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                                        Recommendations {tool.result.scenario && `for: ${tool.result.scenario}`}
                                      </h4>
                                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                        {tool.result.recommendations && (
                                          <ul className="space-y-1">
                                            {tool.result.recommendations.map((rec: string, idx: number) => (
                                              <li key={idx} className="text-sm text-yellow-800">
                                                • {rec}
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                        {tool.result.summary && (
                                          <p className="text-sm text-yellow-700 mt-2">{tool.result.summary}</p>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Generic Tool Result - for any unhandled tools */}
                                  {![
                                    "listCustomers",
                                    "getOverdueCustomers",
                                    "generateReport",
                                    "generateCustomerReport",
                                    "sendReminderEmails",
                                    "sendCustomerReminders",
                                    "getCustomerDetails",
                                    "recommendAction",
                                  ].includes(tool.toolName) &&
                                    tool.result && (
                                      <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                          <BarChart3 className="h-4 w-4" />
                                          {tool.toolName
                                            .replace(/([A-Z])/g, " $1")
                                            .replace(/^./, (str: any) => str.toUpperCase())}
                                        </h4>
                                        <div className="p-3 bg-gray-50 border rounded">
                                          <pre className="text-sm overflow-auto whitespace-pre-wrap">
                                            {typeof tool.result === "string"
                                              ? tool.result
                                              : JSON.stringify(tool.result, null, 2)}
                                          </pre>
                                        </div>
                                      </div>
                                    )}
                                </div>
                              ))}
                              {message.content && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <p className="text-gray-700">{message.content}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p>{message.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about customers, request analytics, search, or get recommendations..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  )
}
