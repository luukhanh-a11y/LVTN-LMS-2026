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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var H5pService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.H5pService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const H5P = __importStar(require("@lumieducation/h5p-server"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const axios_1 = __importDefault(require("axios"));
const supabase_content_storage_1 = require("./supabase-content-storage");
const makeTeacherUser = (id, name) => ({
    id,
    name,
    type: 'local',
    email: `${id}@titkul.com`,
});
const makeStudentUser = (id) => ({
    id,
    name: 'Học sinh',
    type: 'local',
    email: `student-${id}@titkul.com`,
});
let H5pService = H5pService_1 = class H5pService {
    configService;
    logger = new common_1.Logger(H5pService_1.name);
    h5pEditor;
    h5pPlayer;
    initPromise;
    constructor(configService) {
        this.configService = configService;
        this.initPromise = this.initialize();
    }
    async onModuleInit() {
        await this.initPromise;
    }
    async ready() {
        await this.initPromise;
    }
    async initialize() {
        const contentPath = path.resolve(this.configService.get('H5P_CONTENT_PATH', './h5p/content'));
        const libraryPath = path.resolve(this.configService.get('H5P_LIBRARY_PATH', './h5p/libraries'));
        const tempPath = path.resolve(this.configService.get('H5P_TEMP_PATH', './h5p/temporary'));
        [contentPath, libraryPath, tempPath].forEach(p => {
            if (!fs.existsSync(p))
                fs.mkdirSync(p, { recursive: true });
        });
        const h5pConfig = new H5P.H5PConfig(new H5P.fsImplementations.InMemoryStorage());
        h5pConfig.baseUrl = this.configService.get('H5P_BASE_URL', 'http://localhost:3001/h5p');
        h5pConfig.maxFileSize = Number(this.configService.get('H5P_MAX_FILE_SIZE', 500 * 1024 * 1024));
        h5pConfig.maxTotalSize = Number(this.configService.get('H5P_MAX_TOTAL_SIZE', 600 * 1024 * 1024));
        const libraryStorage = new H5P.fsImplementations.FileLibraryStorage(libraryPath);
        const contentStorage = new supabase_content_storage_1.SupabaseContentStorage(contentPath, this.configService);
        const tempStorage = new H5P.fsImplementations.DirectoryTemporaryFileStorage(tempPath);
        this.h5pEditor = new H5P.H5PEditor(new H5P.fsImplementations.InMemoryStorage(), h5pConfig, libraryStorage, contentStorage, tempStorage);
        this.h5pEditor.setRenderer((model) => model);
        this.h5pPlayer = new H5P.H5PPlayer(libraryStorage, contentStorage, h5pConfig);
        this.h5pPlayer.setRenderer((model) => model);
        this.logger.log('H5P Editor và Player đã khởi tạo thành công');
    }
    getEditor() {
        return this.h5pEditor;
    }
    getPlayer() {
        return this.h5pPlayer;
    }
    async saveContent(params, metadata, library, teacherId, teacherName, grade, subjectId) {
        const user = makeTeacherUser(teacherId, teacherName);
        const { id, metadata: savedMetadata } = await this.h5pEditor.saveOrUpdateContentReturnMetaData(undefined, params, metadata, library, user);
        await this.notifySpringBoot(id, savedMetadata, library, teacherId, grade, subjectId);
        return { contentId: id, metadata: savedMetadata };
    }
    async updateContent(contentId, params, metadata, library, teacherId, teacherName) {
        const user = makeTeacherUser(teacherId, teacherName);
        const { id, metadata: savedMetadata } = await this.h5pEditor.saveOrUpdateContentReturnMetaData(contentId, params, metadata, library, user);
        await this.notifySpringBoot(id, savedMetadata, library, teacherId);
        return { contentId: id, metadata: savedMetadata };
    }
    async getEditorModel(contentId, teacherId, teacherName) {
        const user = makeTeacherUser(teacherId, teacherName);
        const model = await this.h5pEditor.render(contentId, 'en', user);
        if (contentId) {
            const existing = await this.h5pEditor.getContent(contentId, user);
            model.library = existing.library;
            model.params = existing.params;
        }
        return model;
    }
    async deleteContent(contentId) {
        await this.h5pEditor.deleteContent(contentId, makeTeacherUser('admin', 'Admin'));
    }
    async getPlayerConfig(contentId, userId) {
        return this.h5pPlayer.render(contentId, makeStudentUser(userId), 'en');
    }
    async listContent() {
        return this.h5pEditor.contentManager.listContent(makeTeacherUser('admin', 'Admin'));
    }
    async notifySpringBoot(contentId, metadata, library, teacherId, grade, subjectId) {
        const springBootUrl = this.configService.get('SPRING_BOOT_URL', 'http://localhost:8080');
        const loaiHocLieu = library.includes('QuestionSet') || library.includes('DragQuestion')
            ? 'BAI_TAP_H5P'
            : 'BAI_GIANG_H5P';
        try {
            await axios_1.default.post(`${springBootUrl}/api/v1/internal/hoc-lieu`, {
                h5pContentId: contentId,
                tieuDe: metadata?.title ?? 'Học liệu H5P không tên',
                loaiHocLieu,
                nguonGoc: 'GIAO_VIEN_TAO',
                giaoVienId: Number(teacherId) || null,
                khoiLop: grade ?? null,
                monHocId: subjectId ?? null,
            }, {
                headers: { 'X-Internal-Secret': this.configService.get('JWT_SECRET') },
            });
            this.logger.log(`Đã thông báo Spring Boot: contentId=${contentId}`);
        }
        catch (error) {
            this.logger.warn(`Không thể thông báo Spring Boot (sẽ retry sau): ${error.message}`);
        }
    }
};
exports.H5pService = H5pService;
exports.H5pService = H5pService = H5pService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], H5pService);
//# sourceMappingURL=h5p.service.js.map