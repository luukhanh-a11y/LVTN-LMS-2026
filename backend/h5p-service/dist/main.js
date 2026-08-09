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
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const h5p_express_1 = require("@lumieducation/h5p-express");
const path = __importStar(require("path"));
const express = __importStar(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const h5p_service_1 = require("./h5p/h5p.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bodyParser: false });
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use((0, express_fileupload_1.default)({ useTempFiles: true, tempFileDir: path.resolve('./h5p/temporary') }));
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Academic-Year'],
    });
    app.setGlobalPrefix('api');
    const h5pService = app.get(h5p_service_1.H5pService);
    await h5pService.ready();
    const h5pEditor = h5pService.getEditor();
    const jwtService = app.get(jwt_1.JwtService);
    const configService = app.get(config_1.ConfigService);
    const defaultH5pUser = {
        id: 'h5p-anonymous',
        name: 'GiaoVien',
        type: 'local',
        email: 'h5p-anonymous@titkul.com',
    };
    const populateH5pUser = (req, _res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            try {
                req.user = jwtService.verify(authHeader.substring(7), {
                    secret: configService.get('JWT_SECRET'),
                });
                return next();
            }
            catch {
            }
        }
        req.user = defaultH5pUser;
        next();
    };
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use('/h5p', populateH5pUser, (0, h5p_express_1.h5pAjaxExpressRouter)(h5pEditor, path.resolve(process.env.H5P_CORE_PATH ?? './h5p-core'), path.resolve(process.env.H5P_EDITOR_PATH ?? './h5p-editor')));
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`🚀 H5P Service chạy tại http://localhost:${port}/api/v1`);
    console.log(`📚 H5P core files tại: ${path.resolve(process.env.H5P_CORE_PATH ?? './h5p-core')}`);
}
bootstrap();
//# sourceMappingURL=main.js.map