# Word 文档处理 MCP 服务器

<a href="https://glama.ai/mcp/servers/q9e176vq7l">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/q9e176vq7l/badge" />
</a>

这是一个基于 Model Context Protocol (MCP) 实现的 Word 文档处理服务器，提供 AI 驱动的文档操作能力。该服务器实现了 MCP 协议，使 AI 应用能够通过自然语言交互来创建、编辑和管理 Word 文档。

## 功能特性

- 完整的 MCP 协议实现
- Word 文档创建和管理
- 富文本内容操作
- 表格创建和格式化
- 文档布局控制
- 文档元数据管理
- 实时文档状态监控

## 环境要求

- Node.js 14 或更高版本
- Microsoft Word（可选，用于高级功能）

## 安装

使用 npx 直接运行：
```bash
npx @puchunjie/doc-tools-mcp
```

全局安装：
```bash
npm install -g @puchunjie/doc-tools-mcp
```

作为项目依赖安装：
```bash
npm install @puchunjie/doc-tools-mcp
```

## 使用方法

1. 启动 MCP 服务器：
```bash
npx @puchunjie/doc-tools-mcp
```

2. 服务器默认将在 8765 端口启动

3. 配置你的 AI 应用（如 Cursor、VSCode）使用 MCP 服务器：
   ```
   http://localhost:8765
   ```

## MCP 功能列表

服务器提供以下 MCP 功能：

- `create_document` - 创建新的 Word 文档
  - 参数：filePath（必需）, title（标题）, author（作者）

- `open_document` - 打开现有的 Word 文档
  - 参数：filePath（必需）

- `add_paragraph` - 向文档添加段落
  - 参数：filePath（必需）, text（必需）, style（样式）, alignment（对齐方式）

- `add_table` - 向文档添加表格
  - 参数：filePath（必需）, rows（必需，行数）, cols（必需，列数）, headers（表头）, data（数据）

- `search_and_replace` - 查找并替换文本
  - 参数：filePath（必需）, searchText（必需，查找文本）, replaceText（必需，替换文本）, matchCase（区分大小写）

- `set_page_margins` - 设置页面边距
  - 参数：filePath（必需）, top（上）, right（右）, bottom（下）, left（左）

- `get_document_info` - 获取文档元数据
  - 参数：filePath（必需）

## AI 应用集成

### Cursor 集成

1. 打开 Cursor 配置文件 `~/.cursor/mcp.json`
2. 添加以下配置：
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

或者使用本地开发版本：
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

配置完成后，你可以使用自然语言来操作 Word 文档：
```
"创建一个名为 report.docx 的新文档"
"在 report.docx 中添加标题 '月度报告'"
"插入一个 4x3 的销售数据表格"
```

### VSCode 和其他 MCP 兼容工具

类似的集成步骤适用于其他支持 MCP 协议的工具。请参考各工具的文档了解具体的 MCP 服务器配置步骤。

## 开发指南

要扩展或修改此 MCP 服务器：

1. 克隆仓库：
```bash
git clone <repository-url>
cd doc-tools-mcp
```

2. 安装依赖：
```bash
npm install
```

3. 以开发模式启动：
```bash
npm run start
```

4. 构建生产版本：
```bash
npm run build
```

### 添加新的 MCP 功能

1. 在 `src/services/DocumentService.ts` 中添加新方法
2. 在 `src/mcp-server.ts` 中注册新功能
3. 根据需要更新类型定义

## 配置说明

- 默认端口：8765（可配置）
- 支持的文件类型：.docx
- 所有文件路径应为绝对路径或相对于当前工作目录的路径

## 许可证

MIT

## 支持

如果你在使用过程中遇到任何问题或有改进建议，欢迎在我们的 GitHub 仓库提交 Issue。 