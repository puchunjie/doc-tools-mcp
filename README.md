# Word Tools MCP Server

<a href="https://glama.ai/mcp/servers/q9e176vq7l">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/q9e176vq7l/badge" />
</a>

A Model Context Protocol (MCP) server that provides AI-powered Word document manipulation capabilities. This server implements the MCP protocol to enable AI applications to create, edit, and manage Word documents through natural language interactions.

## Features

- Full MCP protocol implementation
- Word document creation and management
- Rich text content manipulation
- Table creation and formatting
- Document layout control
- Document metadata management
- Real-time document state monitoring

## Prerequisites

- Node.js 14 or higher
- Microsoft Word (optional, for advanced features)

## Installation

```bash
npx @puchunjie/doc-tools-mcp
```

Or install globally:

```bash
npm install -g @puchunjie/doc-tools-mcp
```

For use as a dependency in your project:

```bash
npm install @puchunjie/doc-tools-mcp
```

## Usage

1. Start the MCP server:

```bash
npx @puchunjie/doc-tools-mcp
```

2. The server will start on port 8765 by default

3. Configure your AI application (e.g., Cursor, VSCode) to use the MCP server:
   ```
   http://localhost:8765
   ```

## MCP Functions

The server provides the following MCP functions:

- `create_document` - Create a new Word document
  - Parameters: filePath (required), title, author

- `open_document` - Open an existing Word document
  - Parameters: filePath (required)

- `add_paragraph` - Add a paragraph to the document
  - Parameters: filePath (required), text (required), style, alignment

- `add_table` - Add a table to the document
  - Parameters: filePath (required), rows (required), cols (required), headers, data

- `search_and_replace` - Find and replace text in the document
  - Parameters: filePath (required), searchText (required), replaceText (required), matchCase

- `set_page_margins` - Set document page margins
  - Parameters: filePath (required), top, right, bottom, left

- `get_document_info` - Get document metadata
  - Parameters: filePath (required)

## Integration with AI Applications

### Cursor

1. Open the Cursor configuration file `~/.cursor/mcp.json`
2. Add the following configuration:
```json
{
  "WordTools": {
    "command": "npx",
    "args": [
      "@puchunjie/doc-tools-mcp"
    ]
  }
}
```

Or for local development version:
```json
{
  "WordTools": {
    "command": "node",
    "args": [
      "/path/to/your/doc-tools-mcp/dist/mcp-server.js"
    ]
  }
}
```

After configuration, you can use natural language to manipulate Word documents:
```
"Create a new document named report.docx"
"Add a heading 'Monthly Report' to report.docx"
"Insert a 4x3 table with sales data"
```

### VSCode and Other MCP-Compatible Tools

Similar integration steps apply to other tools that support the MCP protocol. Consult your tool's documentation for specific MCP server configuration steps.

## Development

To extend or modify this MCP server:

1. Clone the repository:
```bash
git clone <repository-url>
cd doc-tools-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Start in development mode:
```bash
npm run start
```

4. Build for production:
```bash
npm run build
```

### Adding New MCP Functions

1. Add new methods in `src/services/DocumentService.ts`
2. Register new functions in `src/mcp-server.ts`
3. Update type definitions as needed

## Configuration

- Default port: 8765 (configurable)
- Supported file types: .docx
- All file paths should be absolute or relative to the current working directory

## License

MIT

## Support

If you encounter any issues or have suggestions for improvements, please submit an issue on our GitHub repository. 