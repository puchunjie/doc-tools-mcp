import { DocumentCreateOptions, ParagraphOptions, TableOptions, SearchReplaceOptions, PageMargins, DocumentInfo, APIResponse } from '../types';
export declare class DocumentService {
    private static instance;
    private constructor();
    static getInstance(): DocumentService;
    createDocument(filePath: string, options?: DocumentCreateOptions): Promise<APIResponse>;
    openDocument(filePath: string): Promise<APIResponse>;
    addParagraph(filePath: string, options: ParagraphOptions): Promise<APIResponse>;
    addTable(filePath: string, options: TableOptions): Promise<APIResponse>;
    getDocumentInfo(filePath: string): Promise<APIResponse<DocumentInfo>>;
    searchAndReplace(filePath: string, options: SearchReplaceOptions): Promise<APIResponse>;
    setPageMargins(filePath: string, margins: PageMargins): Promise<APIResponse>;
}
