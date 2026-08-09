"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.H5pController = void 0;
const common_1 = require("@nestjs/common");
const h5p_service_1 = require("./h5p.service");
const H5P_SESSION_USER_ID = 'h5p-anonymous';
let H5pController = class H5pController {
    h5pService;
    constructor(h5pService) {
        this.h5pService = h5pService;
    }
    async listContent() {
        const contentIds = await this.h5pService.listContent();
        return { contentIds };
    }
    async getNewEditorModel(req) {
        const user = req.user;
        return this.h5pService.getEditorModel(undefined, H5P_SESSION_USER_ID, user?.sub ?? 'GiaoVien');
    }
    async getEditorModel(contentId, req) {
        const user = req.user;
        return this.h5pService.getEditorModel(contentId, H5P_SESSION_USER_ID, user?.sub ?? 'GiaoVien');
    }
    async saveContent(body, req) {
        const user = req.user;
        return this.h5pService.saveContent(body.params, body.metadata, body.library, H5P_SESSION_USER_ID, user?.sub ?? 'GiaoVien');
    }
    async updateContent(contentId, body, req) {
        const user = req.user;
        return this.h5pService.updateContent(contentId, body.params, body.metadata, body.library, H5P_SESSION_USER_ID, user?.sub ?? 'GiaoVien');
    }
    async deleteContent(contentId) {
        await this.h5pService.deleteContent(contentId);
        return { success: true };
    }
    async getPlayerConfig(contentId, req) {
        const user = req.user;
        return this.h5pService.getPlayerConfig(contentId, String(user?.userId ?? 'anonymous'));
    }
};
exports.H5pController = H5pController;
__decorate([
    (0, common_1.Get)('content'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], H5pController.prototype, "listContent", null);
__decorate([
    (0, common_1.Get)('editor'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], H5pController.prototype, "getNewEditorModel", null);
__decorate([
    (0, common_1.Get)('editor/:contentId'),
    __param(0, (0, common_1.Param)('contentId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], H5pController.prototype, "getEditorModel", null);
__decorate([
    (0, common_1.Post)('content'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], H5pController.prototype, "saveContent", null);
__decorate([
    (0, common_1.Patch)('content/:contentId'),
    __param(0, (0, common_1.Param)('contentId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], H5pController.prototype, "updateContent", null);
__decorate([
    (0, common_1.Delete)('content/:contentId'),
    __param(0, (0, common_1.Param)('contentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], H5pController.prototype, "deleteContent", null);
__decorate([
    (0, common_1.Get)('play/:contentId'),
    __param(0, (0, common_1.Param)('contentId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], H5pController.prototype, "getPlayerConfig", null);
exports.H5pController = H5pController = __decorate([
    (0, common_1.Controller)('h5p/api'),
    __metadata("design:paramtypes", [h5p_service_1.H5pService])
], H5pController);
//# sourceMappingURL=h5p.controller.js.map