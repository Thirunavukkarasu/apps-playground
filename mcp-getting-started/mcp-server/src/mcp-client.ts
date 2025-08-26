import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const transport = new SSEClientTransport(new URL("http://localhost:4000/sse"));

const client = new Client({
    name: "Kalvi Web Client",
    version: "1.0.0",
});

await client.connect(transport);

// Now use the exact tools you defined in server
const inventory = await client.callTool({ name: "getInventory", arguments: {} });
console.log("Inventory:", inventory.content);
