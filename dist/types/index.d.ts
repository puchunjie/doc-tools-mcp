export interface MCPTool {
    name: string;
    description: string;
    parameters: {
        properties: Record<string, unknown>;
        required: string[];
        type: string;
    };
}
export interface DocumentCreateOptions {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
}
export interface ParagraphOptions {
    text: string;
    style?: string;
    alignment?: 'left' | 'center' | 'right' | 'start' | 'end' | 'both' | 'mediumKashida' | 'distribute' | 'numTab' | 'highKashida' | 'lowKashida' | 'thaiDistribute';
    fontSize?: number;
    bold?: boolean;
    italic?: boolean;
}
export interface TableOptions {
    rows: number;
    cols: number;
    headers?: string[];
    data?: string[][];
    style?: string;
}
export interface TableCellOptions {
    tableIndex: number;
    rowIndex: number;
    colIndex: number;
    text: string;
    style?: string;
}
export interface SearchReplaceOptions {
    searchText: string;
    replaceText: string;
    matchCase?: boolean;
}
export interface PageMargins {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}
export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}
export interface DocumentInfo {
    title: string;
    author: string;
    subject: string;
    keywords: string[];
    pageCount: number;
    wordCount: number;
    created: Date;
    modified: Date;
}
