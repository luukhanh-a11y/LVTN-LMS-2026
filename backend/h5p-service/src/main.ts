import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { h5pAjaxExpressRouter } from '@lumieducation/h5p-express';
import * as path from 'path';
import { H5pService } from './h5p/h5p.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api/v1');

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
