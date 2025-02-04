import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
	CallToolResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { type ToolName, TOOLS, TOOL_HANDLERS } from "./tools.js";
import { createDefaultApiClient } from "@tembo-io/api-client";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

export const isAllowedTool = (name: string): name is ToolName => {
	return name in TOOL_HANDLERS;
};

export const temboClient = createDefaultApiClient({
	apiKey: process.env.TEMPO_API_KEY!,
});

const server = new Server(
	{
		name: "mcp-server-tembo",
		version: "0.0.1",
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

server.setRequestHandler(
	CallToolRequestSchema,
	async (request): Promise<z.infer<typeof CallToolResultSchema>> => {
		const toolName = request.params.name;

		try {
			if (isAllowedTool(toolName)) {
				return await TOOL_HANDLERS[toolName](request);
			}

			throw new Error(`Unknown tool: ${toolName}`);
		} catch (error) {
			return {
				content: [
					{
						type: "text",
						text: `Error: ${error instanceof Error ? error.message : String(error)}`,
					},
				],
				isError: true,
			};
		}
	},
);

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

main().catch((error: unknown) => {
	console.error("Server error:", error);
	process.exit(1);
});
