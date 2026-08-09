import { H5pService } from './h5p.service';
import type { Request } from 'express';
export declare class H5pController {
    private readonly h5pService;
    constructor(h5pService: H5pService);
    listContent(): Promise<{
        contentIds: string[];
    }>;
    getNewEditorModel(req: Request): Promise<any>;
    getEditorModel(contentId: string, req: Request): Promise<any>;
    saveContent(body: {
        params: any;
        metadata: any;
        library: string;
    }, req: Request): Promise<{
        contentId: string;
        metadata: any;
    }>;
    updateContent(contentId: string, body: {
        params: any;
        metadata: any;
        library: string;
    }, req: Request): Promise<{
        contentId: string;
        metadata: any;
    }>;
    deleteContent(contentId: string): Promise<{
        success: boolean;
    }>;
    getPlayerConfig(contentId: string, req: Request): Promise<any>;
}
