import { Document, Paragraph, Table, TableRow, TableCell, Packer } from 'docx';
import * as mammoth from 'mammoth';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  DocumentCreateOptions,
  ParagraphOptions,
  TableOptions,
  SearchReplaceOptions,
  PageMargins,
  DocumentInfo,
  APIResponse,
} from '../types';

export class DocumentService {
  private static instance: DocumentService;
  private constructor() {}

  public static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  // 创建新文档
  async createDocument(filePath: string, options?: DocumentCreateOptions): Promise<APIResponse> {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [new Paragraph({
            text: '',
            style: 'Normal'
          })]
        }],
        title: options?.title,
        subject: options?.subject,
        creator: options?.author,
        keywords: options?.keywords?.join(','),
      });

      await Packer.toBuffer(doc).then((buffer) => {
        return fs.writeFile(filePath, buffer);
      });

      return { success: true, data: { filePath } };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: `创建文档失败: ${err.message}` };
    }
  }

  // 打开文档
  async openDocument(filePath: string): Promise<APIResponse> {
    try {
      const buffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer });
      return { success: true, data: { content: result.value } };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: `打开文档失败: ${err.message}` };
    }
  }

  // 添加段落
  async addParagraph(filePath: string, options: ParagraphOptions): Promise<APIResponse> {
    try {
      const buffer = await fs.readFile(filePath);
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: options.text,
              style: options.style,
              alignment: options.alignment,
            }),
          ],
        }],
      });

      await Packer.toBuffer(doc).then((buffer) => {
        return fs.writeFile(filePath, buffer);
      });

      return { success: true };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: `添加段落失败: ${err.message}` };
    }
  }

  // 添加表格
  async addTable(filePath: string, options: TableOptions): Promise<APIResponse> {
    try {
      const doc = new Document({
        sections: [{
          children: [
            new Table({
              rows: Array(options.rows).fill(0).map((_, rowIndex) => {
                return new TableRow({
                  children: Array(options.cols).fill(0).map((_, colIndex) => {
                    const text = options.data?.[rowIndex]?.[colIndex] || '';
                    return new TableCell({
                      children: [new Paragraph({ text })],
                    });
                  }),
                });
              }),
            }),
          ],
        }],
      });

      await Packer.toBuffer(doc).then((buffer) => {
        return fs.writeFile(filePath, buffer);
      });

      return { success: true };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: `添加表格失败: ${err.message}` };
    }
  }

  // 获取文档信息
  async getDocumentInfo(filePath: string): Promise<APIResponse<DocumentInfo>> {
    try {
      const stats = await fs.stat(filePath);
      const buffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer });

      const info: DocumentInfo = {
        title: path.basename(filePath),
        author: 'Unknown',
        subject: '',
        keywords: [],
        pageCount: Math.ceil(result.value.length / 3000), // 粗略估计
        wordCount: result.value.split(/\s+/).length,
        created: stats.birthtime,
        modified: stats.mtime,
      };

      return { success: true, data: info };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: `获取文档信息失败: ${err.message}` };
    }
  }

  // 查找和替换文本
  async searchAndReplace(filePath: string, options: SearchReplaceOptions): Promise<APIResponse> {
    try {
      const buffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer });
      let content = result.value;

      const searchRegex = new RegExp(
        options.searchText,
        `g${options.matchCase ? '' : 'i'}`
      );

      const matches = content.match(searchRegex) || [];
      content = content.replace(searchRegex, options.replaceText);

      // 注意：这里需要重新创建文档，因为 mammoth 主要用于读取
      const doc = new Document({
        sections: [{
          children: [new Paragraph({ text: content })],
        }],
      });

      await Packer.toBuffer(doc).then((buffer) => {
        return fs.writeFile(filePath, buffer);
      });

      return {
        success: true,
        data: {
          matchCount: matches.length,
          preview: content.substring(0, 200) + '...',
        },
      };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: `查找替换失败: ${err.message}` };
    }
  }

  // 设置页面边距
  async setPageMargins(filePath: string, margins: PageMargins): Promise<APIResponse> {
    try {
      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: {
                top: margins.top || 1440, // 默认 1 英寸 (1440 twips)
                right: margins.right || 1440,
                bottom: margins.bottom || 1440,
                left: margins.left || 1440,
              },
            },
          },
          children: [],
        }],
      });

      await Packer.toBuffer(doc).then((buffer) => {
        return fs.writeFile(filePath, buffer);
      });

      return { success: true };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: `设置页面边距失败: ${err.message}` };
    }
  }
} 