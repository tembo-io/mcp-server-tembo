<h1 align="center">Tembo MCP Server</h1>

<p align="center">A MCP server for the <a href="https://cloud.tembo.io">Tembo Cloud</a> platform API</p>

[![smithery badge](https://smithery.ai/badge/@tembo-io/mcp-server-tembo)](https://smithery.ai/server/@tembo-io/mcp-server-tembo)

## Installation

### Installing via Smithery

To install Tembo Cloud API for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@tembo-io/mcp-server-tembo):

```bash
npx -y @smithery/cli install @tembo-io/mcp-server-tembo --client claude
```

### Locally

1. Clone this repo

```
git clone https://github.com/tembo-io/mcp-server-tembo.git
```

2. Download [Claude Desktop](https://www.anthropic.com/products/claude-3-opus-desktop)

3. Load the below tembo mcp server json config into Claude Desktop (open claude desktop > click settings > developer)

> [!NOTE]
> You will need to [generate a API key for Tembo Cloud](https://tembo.io/docs/development/api)

```json
{
	"mcpServers": {
		"mcp-server-tembo": {
			"command": "node",
			"env": {
				"TEMBO_API_KEY": "your_tembo_api_key"
			},
			"args": ["/absolute/path/to/cloned/repo/mcp-server-tembo/dist/index.js"]
		}
	}
}
```

### Hosted version

Coming soon.

## Development

```
pnpm run build
```

```
node index.js
```
