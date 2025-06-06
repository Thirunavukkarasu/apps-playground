import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export const server = new McpServer({
  name: "Fulfillment MCP Server",
  version: "1.0.0",
});

server.tool("getOrders", "Get product orders", async () => {
  console.error("Fetching orders");
  const orders = [
    {
      id: 1,
      customerName: "Alice",
      items: [
        { guitarId: 101, quantity: 2 },
        { guitarId: 102, quantity: 1 },
      ],
      totalAmount: 1500,
    },
    {
      id: 2,
      customerName: "Bob",
      items: [{ guitarId: 103, quantity: 1 }],
      totalAmount: 800,
    },
  ];

  return { content: [{ type: "text", text: JSON.stringify(orders) }] };
});

server.tool("getInventory", "Get product inventory", async () => {
  console.error("Fetching inventory");
  const inventory = [
    { id: 101, name: "Guitar A", stock: 10, price: 500 },
    { id: 102, name: "Guitar B", stock: 5, price: 600 },
    { id: 103, name: "Guitar C", stock: 8, price: 800 },
  ]

  return { content: [{ type: "text", text: JSON.stringify(inventory) }] };
});

server.tool(
  "purchase",
  "Purchase a product",
  {
    items: z
      .array(
        z.object({
          guitarId: z.number().describe("ID of the guitar to purchase"),
          quantity: z.number().describe("Quantity of guitars to purchase"),
        })
      )
      .describe("List of guitars to purchase"),
    customerName: z.string().describe("Name of the customer"),
  },
  async ({ items, customerName }) => {
    console.error("Purchasing", { items, customerName });
    // Simulate order processing
    const order = {
      id: Math.floor(Math.random() * 1000),
      customerName,
      items,
      totalAmount: items.reduce((total, item) => {
        const guitarPrice = 500; // Assume a fixed price for simplicity
        return total + item.quantity * guitarPrice;
      }, 0),
    };

    return { content: [{ type: "text", text: JSON.stringify(order) }] };
  }
);