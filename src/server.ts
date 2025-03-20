import express, { Request, Response, Router } from 'express';
import { DocumentService } from './services/DocumentService';
import { MCPTool } from './types';

const app = express();
const router = Router();
const port = 8765; // 使用不常用端口避免冲突
const docService = DocumentService.getInstance();

app.use(express.json());

// 定义所有支持的工具
const tools: MCPTool[] = [
  {
    name: 'create_document',
    description: '创建新的 Word 文档',
    parameters: {
      properties: {
        filePath: { type: 'string', description: '文档保存路径' },
        title: { type: 'string', description: '文档标题' },
        author: { type: 'string', description: '文档作者' },
      },
      required: ['filePath'],
      type: 'object',
    },
  },
  {
    name: 'open_document',
    description: '打开 Word 文档',
    parameters: {
      properties: {
        filePath: { type: 'string', description: '文档路径' },
      },
      required: ['filePath'],
      type: 'object',
    },
  },
  {
    name: 'add_paragraph',
    description: '向文档添加段落',
    parameters: {
      properties: {
        filePath: { type: 'string', description: '文档路径' },
        text: { type: 'string', description: '段落文本' },
        style: { type: 'string', description: '段落样式' },
        alignment: { type: 'string', description: '对齐方式' },
      },
      required: ['filePath', 'text'],
      type: 'object',
    },
  },
  {
    name: 'add_table',
    description: '向文档添加表格',
    parameters: {
      properties: {
        filePath: { type: 'string', description: '文档路径' },
        rows: { type: 'number', description: '行数' },
        cols: { type: 'number', description: '列数' },
        headers: { type: 'array', description: '表头' },
        data: { type: 'array', description: '表格数据' },
      },
      required: ['filePath', 'rows', 'cols'],
      type: 'object',
    },
  },
  {
    name: 'search_and_replace',
    description: '查找并替换文本',
    parameters: {
      properties: {
        filePath: { type: 'string', description: '文档路径' },
        searchText: { type: 'string', description: '要查找的文本' },
        replaceText: { type: 'string', description: '替换为的文本' },
        matchCase: { type: 'boolean', description: '是否区分大小写' },
      },
      required: ['filePath', 'searchText', 'replaceText'],
      type: 'object',
    },
  },
  {
    name: 'set_page_margins',
    description: '设置页面边距',
    parameters: {
      properties: {
        filePath: { type: 'string', description: '文档路径' },
        top: { type: 'number', description: '上边距' },
        right: { type: 'number', description: '右边距' },
        bottom: { type: 'number', description: '下边距' },
        left: { type: 'number', description: '左边距' },
      },
      required: ['filePath'],
      type: 'object',
    },
  },
  {
    name: 'get_document_info',
    description: '获取文档信息',
    parameters: {
      properties: {
        filePath: { type: 'string', description: '文档路径' },
      },
      required: ['filePath'],
      type: 'object',
    },
  },
];

// MCP 工具列表端点
router.get('/tools/list', (req: Request, res: Response) => {
  res.json(tools);
});

// MCP 工具调用端点
router.post('/tools/call', async (req: Request, res: Response) => {
  const { name, parameters } = req.body;

  try {
    let result;

    switch (name) {
      case 'create_document':
        result = await docService.createDocument(parameters.filePath, {
          title: parameters.title,
          author: parameters.author,
        });
        break;

      case 'open_document':
        result = await docService.openDocument(parameters.filePath);
        break;

      case 'add_paragraph':
        result = await docService.addParagraph(parameters.filePath, {
          text: parameters.text,
          style: parameters.style,
          alignment: parameters.alignment,
        });
        break;

      case 'add_table':
        result = await docService.addTable(parameters.filePath, {
          rows: parameters.rows,
          cols: parameters.cols,
          headers: parameters.headers,
          data: parameters.data,
        });
        break;

      case 'search_and_replace':
        result = await docService.searchAndReplace(parameters.filePath, {
          searchText: parameters.searchText,
          replaceText: parameters.replaceText,
          matchCase: parameters.matchCase,
        });
        break;

      case 'set_page_margins':
        result = await docService.setPageMargins(parameters.filePath, {
          top: parameters.top,
          right: parameters.right,
          bottom: parameters.bottom,
          left: parameters.left,
        });
        break;

      case 'get_document_info':
        result = await docService.getDocumentInfo(parameters.filePath);
        break;

      default:
        return res.status(400).json({
          success: false,
          error: `不支持的工具: ${name}`,
        });
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: `工具执行失败: ${error.message}`,
    });
  }
});

// 使用路由
app.use('/', router);

// 启动服务器
app.listen(port, () => {
  console.log(`Word MCP 服务器运行在端口 ${port}`);
}); 