#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { DocumentService } from './services/DocumentService.js';
import path from "path";
import { z } from "zod";

// 创建 MCP 服务器
const server = new McpServer({
  name: "Word Document Tools MCP",
  version: "1.0.0",
});

const docService = DocumentService.getInstance();

// 注册工具
server.tool(
  "create_document",
  {
    filePath: z.string(),
    title: z.string().optional(),
    author: z.string().optional(),
  },
  async (params) => {
    const result = await docService.createDocument(params.filePath, {
      title: params.title,
      author: params.author,
    });
    return {
      content: [
        {
          type: "text",
          text: result.success ? `文档已创建: ${params.filePath}` : result.error!,
        },
      ],
      isError: !result.success,
    };
  }
);

server.tool(
  "open_document",
  {
    filePath: z.string(),
  },
  async (params) => {
    const result = await docService.openDocument(params.filePath);
    return {
      content: [
        {
          type: "text",
          text: result.success ? result.data!.content : result.error!,
        },
      ],
      isError: !result.success,
    };
  }
);

server.tool(
  "add_paragraph",
  {
    filePath: z.string(),
    text: z.string(),
    style: z.string().optional(),
    alignment: z.enum(['left', 'center', 'right', 'start', 'end', 'both', 'mediumKashida', 'distribute', 'numTab', 'highKashida', 'lowKashida', 'thaiDistribute']).optional(),
  },
  async (params) => {
    const result = await docService.addParagraph(params.filePath, {
      text: params.text,
      style: params.style,
      alignment: params.alignment,
    });
    return {
      content: [
        {
          type: "text",
          text: result.success ? "段落已添加" : result.error!,
        },
      ],
      isError: !result.success,
    };
  }
);

server.tool(
  "add_table",
  {
    filePath: z.string(),
    rows: z.number(),
    cols: z.number(),
    headers: z.array(z.string()).optional(),
    data: z.array(z.array(z.string())).optional(),
  },
  async (params) => {
    const result = await docService.addTable(params.filePath, {
      rows: params.rows,
      cols: params.cols,
      headers: params.headers,
      data: params.data,
    });
    return {
      content: [
        {
          type: "text",
          text: result.success ? "表格已添加" : result.error!,
        },
      ],
      isError: !result.success,
    };
  }
);

server.tool(
  "search_and_replace",
  {
    filePath: z.string(),
    searchText: z.string(),
    replaceText: z.string(),
    matchCase: z.boolean().optional(),
  },
  async (params) => {
    const result = await docService.searchAndReplace(params.filePath, {
      searchText: params.searchText,
      replaceText: params.replaceText,
      matchCase: params.matchCase,
    });
    return {
      content: [
        {
          type: "text",
          text: result.success 
            ? `替换完成: ${result.data.matchCount} 处匹配\n预览: ${result.data.preview}` 
            : result.error!,
        },
      ],
      isError: !result.success,
    };
  }
);

server.tool(
  "set_page_margins",
  {
    filePath: z.string(),
    top: z.number().optional(),
    right: z.number().optional(),
    bottom: z.number().optional(),
    left: z.number().optional(),
  },
  async (params) => {
    const result = await docService.setPageMargins(params.filePath, {
      top: params.top,
      right: params.right,
      bottom: params.bottom,
      left: params.left,
    });
    return {
      content: [
        {
          type: "text",
          text: result.success ? "页面边距已设置" : result.error!,
        },
      ],
      isError: !result.success,
    };
  }
);

server.tool(
  "get_document_info",
  {
    filePath: z.string(),
  },
  async (params) => {
    const result = await docService.getDocumentInfo(params.filePath);
    if (result.success) {
      const info = result.data!;
      return {
        content: [
          {
            type: "text",
            text: `文档信息:
标题: ${info.title}
作者: ${info.author}
主题: ${info.subject}
关键词: ${info.keywords.join(", ")}
页数: ${info.pageCount}
字数: ${info.wordCount}
创建时间: ${info.created.toLocaleString()}
修改时间: ${info.modified.toLocaleString()}`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: result.error!,
          },
        ],
        isError: true,
      };
    }
  }
);

// 使用标准输入输出作为传输层
const transport = new StdioServerTransport();
await server.connect(transport);

console.log("Word Document Tools MCP 服务器已启动"); 