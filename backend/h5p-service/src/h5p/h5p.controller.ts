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

// H5P core JS gọi AJAX nội bộ (upload file tạm qua /h5p/ajax) không kèm Bearer
// token, nên luôn được gán user mặc định 'h5p-anonymous' (xem populateH5pUser
// trong main.ts). Editor/Save PHẢI dùng cùng 1 id này khi thao tác trên cùng 1
// phiên soạn bài, nếu không H5P server sẽ tra cứu nhầm thư mục file tạm của
// user khác — 404 "not found" và tự xoá tham chiếu file khỏi content đã lưu.
const H5P_SESSION_USER_ID = 'h5p-anonymous';

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
      H5P_SESSION_USER_ID,
      user?.sub ?? 'GiaoVien',
    );
  }

  // Model khởi tạo cho H5P Editor (web component) khi sửa bài có sẵn
  @Get('editor/:contentId')
  async getEditorModel(@Param('contentId') contentId: string, @Req() req: Request) {
    const user = (req as any).user;
    return this.h5pService.getEditorModel(
      contentId,
      H5P_SESSION_USER_ID,
      user?.sub ?? 'GiaoVien',
    );
  }

  // Giáo viên lưu H5P content mới
  @Post('content')
  async saveContent(
    @Body() body: { params: any; metadata: any; library: string },
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.h5pService.saveContent(
      body.params,
      body.metadata,
      body.library,
      H5P_SESSION_USER_ID,
      user?.sub ?? 'GiaoVien',
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
      H5P_SESSION_USER_ID,
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
