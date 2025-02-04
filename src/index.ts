import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createDefaultApiClient } from "@tembo-io/api-client";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server instance
const server = new McpServer({
	name: "mcp-server-tembo",
	version: "1.0.0",
});
