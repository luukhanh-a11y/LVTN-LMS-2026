"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseContentStorage = void 0;
const common_1 = require("@nestjs/common");
const H5P = __importStar(require("@lumieducation/h5p-server"));
const axios_1 = __importDefault(require("axios"));
const mime = __importStar(require("mime-types"));
const stream_1 = require("stream");
class SupabaseContentStorage extends H5P.fsImplementations.FileContentStorage {
    logger = new common_1.Logger(SupabaseContentStorage.name);
    supabaseUrl;
    serviceRoleKey;
    bucket;
    constructor(contentPath, configService) {
        super(contentPath);
        this.supabaseUrl = configService.get('SUPABASE_URL', '');
        this.serviceRoleKey = configService.get('SUPABASE_SERVICE_ROLE_KEY', '');
        this.bucket = configService.get('SUPABASE_BUCKET', 'titkul-media');
    }
    isConfigured() {
        return !!this.supabaseUrl && !!this.serviceRoleKey;
    }
    objectPath(contentId, filename) {
        return `h5p-content/${contentId}/${filename}`;
    }
    publicUrl(contentId, filename) {
        return `${this.supabaseUrl}/storage/v1/object/public/${this.bucket}/${this.objectPath(contentId, filename)}`;
    }
    async addFile(id, filename, stream, user) {
        if (!this.isConfigured()) {
            return super.addFile(id, filename, stream, user);
        }
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        const buffer = Buffer.concat(chunks);
        try {
            const contentType = mime.lookup(filename) || 'application/octet-stream';
            await axios_1.default.post(`${this.supabaseUrl}/storage/v1/object/${this.bucket}/${this.objectPath(id, filename)}`, buffer, {
                headers: {
                    Authorization: `Bearer ${this.serviceRoleKey}`,
                    apikey: this.serviceRoleKey,
                    'Content-Type': contentType,
                    'x-upsert': 'true',
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            });
            return;
        }
        catch (error) {
            this.logger.warn(`Upload Supabase thất bại cho ${filename} (contentId=${id}), fallback lưu đĩa cục bộ: ${error.message}`);
            return super.addFile(id, filename, stream_1.Readable.from(buffer), user);
        }
    }
    async fileExists(contentId, filename) {
        if (this.isConfigured()) {
            try {
                const res = await axios_1.default.head(this.publicUrl(contentId, filename), {
                    validateStatus: () => true,
                });
                if (res.status === 200)
                    return true;
            }
            catch {
            }
        }
        return super.fileExists(contentId, filename);
    }
    async getFileStats(id, filename, user) {
        if (this.isConfigured()) {
            try {
                const res = await axios_1.default.head(this.publicUrl(id, filename), {
                    validateStatus: () => true,
                });
                if (res.status === 200) {
                    return {
                        size: Number(res.headers['content-length'] ?? 0),
                        birthtime: new Date(),
                    };
                }
            }
            catch {
            }
        }
        return super.getFileStats(id, filename, user);
    }
    async getFileStream(id, filename, user, rangeStart, rangeEnd) {
        if (this.isConfigured()) {
            try {
                const headers = {};
                if (rangeStart !== undefined || rangeEnd !== undefined) {
                    headers.Range = `bytes=${rangeStart ?? 0}-${rangeEnd ?? ''}`;
                }
                const response = await axios_1.default.get(this.publicUrl(id, filename), {
                    headers,
                    responseType: 'stream',
                    validateStatus: (status) => status === 200 || status === 206,
                });
                return response.data;
            }
            catch (error) {
                this.logger.warn(`Đọc file từ Supabase thất bại (${filename}, contentId=${id}), fallback đĩa cục bộ: ${error.message}`);
            }
        }
        return super.getFileStream(id, filename, user, rangeStart, rangeEnd);
    }
    async listSupabasePrefix(prefix) {
        const pageSize = 1000;
        const allEntries = [];
        let offset = 0;
        for (;;) {
            const res = await axios_1.default.post(`${this.supabaseUrl}/storage/v1/object/list/${this.bucket}`, { prefix, limit: pageSize, offset }, {
                headers: {
                    Authorization: `Bearer ${this.serviceRoleKey}`,
                    apikey: this.serviceRoleKey,
                    'Content-Type': 'application/json',
                },
            });
            const page = res.data ?? [];
            allEntries.push(...page);
            if (page.length < pageSize)
                break;
            offset += pageSize;
        }
        const results = [];
        for (const entry of allEntries) {
            if (entry.id === null) {
                const nested = await this.listSupabasePrefix(`${prefix}${entry.name}/`);
                results.push(...nested.map((n) => `${entry.name}/${n}`));
            }
            else {
                results.push(entry.name);
            }
        }
        return results;
    }
    async listFiles(contentId, user) {
        if (this.isConfigured()) {
            try {
                return await this.listSupabasePrefix(`${this.objectPath(contentId, '')}`);
            }
            catch (error) {
                this.logger.warn(`Liệt kê file Supabase thất bại (contentId=${contentId}): ${error.message}`);
            }
        }
        return super.listFiles(contentId, user);
    }
    async deleteContent(id, user) {
        if (this.isConfigured()) {
            try {
                const files = await this.listSupabasePrefix(this.objectPath(id, ''));
                if (files.length > 0) {
                    await axios_1.default.delete(`${this.supabaseUrl}/storage/v1/object/${this.bucket}`, {
                        headers: {
                            Authorization: `Bearer ${this.serviceRoleKey}`,
                            apikey: this.serviceRoleKey,
                            'Content-Type': 'application/json',
                        },
                        data: { prefixes: files.map((f) => this.objectPath(id, f)) },
                    });
                }
            }
            catch (error) {
                this.logger.warn(`Xoá file Supabase thất bại khi xoá content (id=${id}): ${error.message}`);
            }
        }
        await super.deleteContent(id, user);
    }
    async deleteFile(contentId, filename) {
        if (this.isConfigured()) {
            try {
                await axios_1.default.delete(`${this.supabaseUrl}/storage/v1/object/${this.bucket}/${this.objectPath(contentId, filename)}`, {
                    headers: {
                        Authorization: `Bearer ${this.serviceRoleKey}`,
                        apikey: this.serviceRoleKey,
                    },
                });
                return;
            }
            catch (error) {
                this.logger.warn(`Xóa file Supabase thất bại (${filename}, contentId=${contentId}): ${error.message}`);
            }
        }
        try {
            await super.deleteFile(contentId, filename);
        }
        catch {
        }
    }
}
exports.SupabaseContentStorage = SupabaseContentStorage;
//# sourceMappingURL=supabase-content-storage.js.map