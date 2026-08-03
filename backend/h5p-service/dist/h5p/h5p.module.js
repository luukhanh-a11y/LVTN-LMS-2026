"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.H5pModule = void 0;
const common_1 = require("@nestjs/common");
const h5p_service_1 = require("./h5p.service");
const h5p_controller_1 = require("./h5p.controller");
let H5pModule = class H5pModule {
};
exports.H5pModule = H5pModule;
exports.H5pModule = H5pModule = __decorate([
    (0, common_1.Module)({
        providers: [h5p_service_1.H5pService],
        controllers: [h5p_controller_1.H5pController],
        exports: [h5p_service_1.H5pService],
    })
], H5pModule);
//# sourceMappingURL=h5p.module.js.map