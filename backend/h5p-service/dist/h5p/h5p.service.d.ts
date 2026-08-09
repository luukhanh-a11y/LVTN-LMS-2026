import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as H5P from '@lumieducation/h5p-server';
export declare class H5pService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    private h5pEditor;
    private h5pPlayer;
    private readonly initPromise;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    ready(): Promise<void>;
    private initialize;
    getEditor(): H5P.H5PEditor;
    getPlayer(): H5P.H5PPlayer;
    saveContent(params: any, metadata: any, library: string, teacherId: string, teacherName: string): Promise<{
        contentId: string;
        metadata: any;
    }>;
    updateContent(contentId: string, params: any, metadata: any, library: string, teacherId: string, teacherName: string): Promise<{
        contentId: string;
        metadata: any;
    }>;
    getEditorModel(contentId: string | undefined, teacherId: string, teacherName: string): Promise<any>;
    deleteContent(contentId: string): Promise<void>;
    getPlayerConfig(contentId: string, userId: string): Promise<any>;
    listContent(): Promise<string[]>;
}
