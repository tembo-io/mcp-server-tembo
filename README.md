<h1 align="center">Mcp Server Tembo</h1>

<p align="center">A MCP server for the Tembo Cloud platform API</p>

## Development

```
pnpm run build
```

```
node index.js
```

## Installation

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
