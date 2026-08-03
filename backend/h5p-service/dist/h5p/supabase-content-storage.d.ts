import { ConfigService } from '@nestjs/config';
import * as H5P from '@lumieducation/h5p-server';
import { ReadStream } from 'fs';
import { Stream } from 'stream';
export declare class SupabaseContentStorage extends H5P.fsImplementations.FileContentStorage {
    private readonly logger;
    private readonly supabaseUrl;
    private readonly serviceRoleKey;
    private readonly bucket;
    constructor(contentPath: string, configService: ConfigService);
    private isConfigured;
    private objectPath;
    private publicUrl;
    addFile(id: string, filename: string, stream: Stream, user: H5P.IUser): Promise<void>;
    fileExists(contentId: string, filename: string): Promise<boolean>;
    getFileStats(id: string, filename: string, user: H5P.IUser): Promise<H5P.IFileStats>;
    getFileStream(id: string, filename: string, user: H5P.IUser, rangeStart?: number, rangeEnd?: number): Promise<ReadStream>;
    private listSupabasePrefix;
    listFiles(contentId: string, user: H5P.IUser): Promise<string[]>;
    deleteContent(id: string, user?: H5P.IUser): Promise<void>;
    deleteFile(contentId: string, filename: string): Promise<void>;
}
