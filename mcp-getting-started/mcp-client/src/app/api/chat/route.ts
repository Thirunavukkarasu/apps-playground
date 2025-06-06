import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import getTools, { closeMCPClient } from "@/lib/ai-tools"

export async function POST(req: Request) {
    const { messages } = await req.json()

    try {
        // Get all tools (both MCP and custom API-based tools)
        const tools = await getTools()

        const result = streamText({
            model: openai("gpt-4"),
            messages,
            system: `You are a helpful customer management assistant powered by both internal APIs and external MCP tools. You can help with:
      
      **Customer Management:**
      - List all customers with their status
      - Find overdue customers with detailed analytics
      - Get specific customer details and history
      - Generate comprehensive customer reports
      
      **Communication:**
      - Send automated reminder emails to overdue customers
      - Recommend best practices for customer communication
      - Provide actionable insights for customer retention
      
      **Analytics & Recommendations:**
      - Analyze customer payment patterns
      - Recommend actions based on current scenarios
      - Generate reports with key metrics and insights
      
      Always be professional, provide clear actionable information, and use the most appropriate tool for each request. If you have access to external MCP tools, leverage them when they can provide additional value.`,
            tools,
            onFinish: async () => {
                // Clean up MCP client connection when response is finished
                await closeMCPClient()
            },
        })

        return result.toDataStreamResponse()
    } catch (error) {
        console.error("Chat API error:", error)

        // Ensure MCP client is closed even if there's an error
        await closeMCPClient()

        return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}
