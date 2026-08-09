import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { h5pAjaxExpressRouter } from '@lumieducation/h5p-express';
import * as path from 'path';
import * as express from 'express';
import fileUpload from 'express-fileupload';
import { H5pService } from './h5p/h5p.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  // Tắt body-parser tự động của Nest (chỉ được gắn ngầm bên trong app.listen()
  // → init(), tức là SAU khi router '/h5p' raw bên dưới đã mount) — tự gắn
  // express.json()/urlencoded() thủ công ngay từ đầu để req.body có sẵn cho cả
  // route Nest lẫn route raw Express, tránh lỗi "Cannot use 'in' operator to
  // search for 'libraries' in undefined" khi H5P core JS POST tới /h5p/ajax.
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // h5p-express đọc file upload qua req.files.file/.h5p dạng { data, mimetype,
  // name, size, tempFilePath } — đúng format của express-fileupload (không phải
  // multer, dù multer có trong package.json nhưng chưa từng được wiring dùng).
  app.use(fileUpload({ useTempFiles: true, tempFileDir: path.resolve('./h5p/temporary') }));

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    // X-Academic-Year: axios interceptor dùng chung (frontend/src/lib/axios.ts)
    // gắn header này vào MỌI request kể cả sang h5p-service, dù service này
    // không dùng tới — vẫn phải khai báo ở đây, nếu không trình duyệt chặn
    // ngay từ bước preflight OPTIONS.
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Academic-Year'],
  });

  // Khớp với baseURL 'http://localhost:3001/api' phía frontend (h5pApi) — controller
  // đã tự có prefix 'h5p/api' nên global prefix chỉ cần 'api', không phải 'api/v1'.
  app.setGlobalPrefix('api');

  // Không dùng app.init() ở đây — nó khóa route table của Nest (kèm 404 mặc định)
  // trước khi router H5P raw bên dưới được mount, chặn hết request /h5p/*.
  const h5pService = app.get(H5pService);
  await h5pService.ready();
  const h5pEditor = h5pService.getEditor();

  // h5p-express luôn cần req.user, nhưng core H5P JS tự gọi các endpoint này bằng
  // jQuery.ajax/thẻ <script> nội bộ, không qua axios nên không kèm Bearer token.
  // Dùng token thật nếu có, không thì gán user mặc định để asset vẫn tải được —
  // nghiệp vụ nhạy cảm vẫn được bảo vệ JWT thật ở h5p/api/*.
  const jwtService = app.get(JwtService);
  const configService = app.get(ConfigService);
  const defaultH5pUser = {
    id: 'h5p-anonymous',
    name: 'GiaoVien',
    type: 'local',
    email: 'h5p-anonymous@titkul.com',
  };
  const populateH5pUser = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        (req as any).user = jwtService.verify(authHeader.substring(7), {
          secret: configService.get('JWT_SECRET'),
        });
        return next();
      } catch {
        // token hỏng — vẫn cho qua với user mặc định
      }
    }
    (req as any).user = defaultH5pUser;
    next();
  };

  // Router H5P AJAX: core/editor JS, library files, content files, ajax protocol...
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(
    '/h5p',
    populateH5pUser,
    h5pAjaxExpressRouter(
      h5pEditor,
      path.resolve(process.env.H5P_CORE_PATH ?? './h5p-core'),
      path.resolve(process.env.H5P_EDITOR_PATH ?? './h5p-editor'),
    ),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 H5P Service chạy tại http://localhost:${port}/api/v1`);
  console.log(`📚 H5P core files tại: ${path.resolve(process.env.H5P_CORE_PATH ?? './h5p-core')}`);
}

bootstrap();
