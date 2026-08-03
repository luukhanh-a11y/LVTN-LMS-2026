import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { H5pService } from './h5p.service';
import type { Request } from 'express';

@Controller('h5p/api')
export class H5pController {
  constructor(private readonly h5pService: H5pService) {}

  @Get('content')
  async listContent() {
    const contentIds = await this.h5pService.listContent();
    return { contentIds };
  }

  // Model khởi tạo cho H5P Editor (web component) khi soạn bài mới
  @Get('editor')
  async getNewEditorModel(@Req() req: Request) {
    const user = (req as any).user;
    return this.h5pService.getEditorModel(
      undefined,
      String(user?.userId ?? '0'),
      user?.sub ?? 'GiaoVien',
    );
  }

  // Model khởi tạo cho H5P Editor (web component) khi sửa bài có sẵn
  @Get('editor/:contentId')
  async getEditorModel(@Param('contentId') contentId: string, @Req() req: Request) {
    const user = (req as any).user;
    return this.h5pService.getEditorModel(
      contentId,
      String(user?.userId ?? '0'),
      user?.sub ?? 'GiaoVien',
    );
  }

  // Giáo viên lưu H5P content mới
  @Post('content')
  async saveContent(
    @Body() body: { params: any; metadata: any; library: string; grade?: number; subjectId?: number },
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.h5pService.saveContent(
      body.params,
      body.metadata,
      body.library,
      String(user?.userId ?? '0'),
      user?.sub ?? 'GiaoVien',
      body.grade,
      body.subjectId,
    );
  }

  // Giáo viên cập nhật H5P content đã tồn tại
  @Patch('content/:contentId')
  async updateContent(
    @Param('contentId') contentId: string,
    @Body() body: { params: any; metadata: any; library: string },
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.h5pService.updateContent(
      contentId,
      body.params,
      body.metadata,
      body.library,
      String(user?.userId ?? '0'),
      user?.sub ?? 'GiaoVien',
    );
  }

  @Delete('content/:contentId')
  async deleteContent(@Param('contentId') contentId: string) {
    await this.h5pService.deleteContent(contentId);
    return { success: true };
  }

  // React FE gọi để lấy config khởi tạo H5P Player
  @Get('play/:contentId')
  async getPlayerConfig(@Param('contentId') contentId: string, @Req() req: Request) {
    const user = (req as any).user;
    return this.h5pService.getPlayerConfig(contentId, String(user?.userId ?? 'anonymous'));
  }
}
