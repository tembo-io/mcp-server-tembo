import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { TOOLS } from "./tools.js";
import { createDefaultApiClient } from "@tembo-io/api-client";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

export const temboClient = createDefaultApiClient({
	apiKey: process.env.TEMPO_API_KEY!,
});

const server = new Server(
	{
		name: "mcp-server-tembo",
		version: "0.0.",
	},
	{
		capabilities: {
			tools: {},
		},
	},
);

server.setRequestHandler(ListToolsRequestSchema, () => {
	return { tools: TOOLS };
});
