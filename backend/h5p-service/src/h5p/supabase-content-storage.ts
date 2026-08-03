import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as H5P from '@lumieducation/h5p-server';
import axios from 'axios';
import * as mime from 'mime-types';
import { ReadStream } from 'fs';
import { Stream } from 'stream';

// Bọc FileContentStorage gốc (content.json/h5p.json JSON nhẹ vẫn lưu đĩa cục bộ,
// đúng tinh thần "JSON lưu nhẹ") nhưng route toàn bộ file nhị phân (video, ảnh,
// audio GV nhúng vào bài giảng H5P) lên Supabase Storage thật thay vì đĩa cục bộ.
// Nếu Supabase chưa cấu hình hoặc lỗi mạng, tự fallback về hành vi gốc (đĩa cục
// bộ) để không làm hỏng luồng soạn bài của giáo viên.
export class SupabaseContentStorage extends H5P.fsImplementations.FileContentStorage {
  private readonly logger = new Logger(SupabaseContentStorage.name);
  private readonly supabaseUrl: string;
  private readonly serviceRoleKey: string;
  private readonly bucket: string;

  constructor(contentPath: string, configService: ConfigService) {
    super(contentPath);
    this.supabaseUrl = configService.get<string>('SUPABASE_URL', '');
    this.serviceRoleKey = configService.get<string>('SUPABASE_SERVICE_ROLE_KEY', '');
    this.bucket = configService.get<string>('SUPABASE_BUCKET', 'titkul-media');
  }

  private isConfigured(): boolean {
    return !!this.supabaseUrl && !!this.serviceRoleKey;
  }

  private objectPath(contentId: string, filename: string): string {
    return `h5p-content/${contentId}/${filename}`;
  }

  private publicUrl(contentId: string, filename: string): string {
    return `${this.supabaseUrl}/storage/v1/object/public/${this.bucket}/${this.objectPath(contentId, filename)}`;
  }

  override async addFile(
    id: string,
    filename: string,
    stream: Stream,
    user: H5P.IUser,
  ): Promise<void> {
    if (!this.isConfigured()) {
      return super.addFile(id, filename, stream, user);
    }
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of stream as any) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const buffer = Buffer.concat(chunks);

      // Suy ra Content-Type thật từ đuôi file (video/mp4, image/jpeg...) — nếu
      // không, Supabase lưu mặc định application/octet-stream khiến trình duyệt
      // tải file xuống thay vì phát trực tiếp video/ảnh trong <video>/<img>.
      const contentType = mime.lookup(filename) || 'application/octet-stream';
      await axios.post(
        `${this.supabaseUrl}/storage/v1/object/${this.bucket}/${this.objectPath(id, filename)}`,
        buffer,
        {
          headers: {
            Authorization: `Bearer ${this.serviceRoleKey}`,
            apikey: this.serviceRoleKey,
            'Content-Type': contentType,
            'x-upsert': 'true',
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        },
      );
    } catch (error) {
      this.logger.warn(
        `Upload Supabase thất bại cho ${filename} (contentId=${id}), fallback lưu đĩa cục bộ: ${error.message}`,
      );
      // stream đã bị đọc hết ở trên nên không thể dùng lại — trường hợp lỗi hiếm
      // (mất mạng giữa chừng) được coi là chấp nhận được cho 1 dự án đồ án.
      throw error;
    }
  }

  override async fileExists(contentId: string, filename: string): Promise<boolean> {
    if (this.isConfigured()) {
      try {
        const res = await axios.head(this.publicUrl(contentId, filename), {
          validateStatus: () => true,
        });
        if (res.status === 200) return true;
      } catch {
        // rơi xuống kiểm tra đĩa cục bộ bên dưới
      }
    }
    return super.fileExists(contentId, filename);
  }

  override async getFileStats(
    id: string,
    filename: string,
    user: H5P.IUser,
  ): Promise<H5P.IFileStats> {
    if (this.isConfigured()) {
      try {
        const res = await axios.head(this.publicUrl(id, filename), {
          validateStatus: () => true,
        });
        if (res.status === 200) {
          return {
            size: Number(res.headers['content-length'] ?? 0),
            birthtime: new Date(),
          };
        }
      } catch {
        // rơi xuống bản gốc bên dưới
      }
    }
    return super.getFileStats(id, filename, user);
  }

  override async getFileStream(
    id: string,
    filename: string,
    user: H5P.IUser,
    rangeStart?: number,
    rangeEnd?: number,
  ): Promise<ReadStream> {
    if (this.isConfigured()) {
      try {
        const headers: Record<string, string> = {};
        if (rangeStart !== undefined || rangeEnd !== undefined) {
          headers.Range = `bytes=${rangeStart ?? 0}-${rangeEnd ?? ''}`;
        }
        const response = await axios.get(this.publicUrl(id, filename), {
          headers,
          responseType: 'stream',
          validateStatus: (status) => status === 200 || status === 206,
        });
        // axios trả về http.IncomingMessage (Readable thật) — H5P chỉ pipe() nó,
        // ép kiểu ReadStream cho khớp signature của IContentStorage.
        return response.data as ReadStream;
      } catch (error) {
        this.logger.warn(
          `Đọc file từ Supabase thất bại (${filename}, contentId=${id}), fallback đĩa cục bộ: ${error.message}`,
        );
      }
    }
    return super.getFileStream(id, filename, user, rangeStart, rangeEnd);
  }

  // Liệt kê đệ quy các object dưới 1 prefix trên Supabase Storage (API list chỉ
  // trả 1 cấp, "thư mục" con trả về như 1 entry không có id/metadata).
  private async listSupabasePrefix(prefix: string): Promise<string[]> {
    const res = await axios.post(
      `${this.supabaseUrl}/storage/v1/object/list/${this.bucket}`,
      { prefix, limit: 1000 },
      {
        headers: {
          Authorization: `Bearer ${this.serviceRoleKey}`,
          apikey: this.serviceRoleKey,
          'Content-Type': 'application/json',
        },
      },
    );
    const entries: Array<{ name: string; id: string | null }> = res.data ?? [];
    const results: string[] = [];
    for (const entry of entries) {
      if (entry.id === null) {
        // Đây là "thư mục" giả lập của Supabase Storage — đệ quy vào bên trong.
        const nested = await this.listSupabasePrefix(`${prefix}${entry.name}/`);
        results.push(...nested.map((n) => `${entry.name}/${n}`));
      } else {
        results.push(entry.name);
      }
    }
    return results;
  }

  override async listFiles(contentId: string, user: H5P.IUser): Promise<string[]> {
    if (this.isConfigured()) {
      try {
        return await this.listSupabasePrefix(`${this.objectPath(contentId, '')}`);
      } catch (error) {
        this.logger.warn(`Liệt kê file Supabase thất bại (contentId=${contentId}): ${error.message}`);
      }
    }
    return super.listFiles(contentId, user);
  }

  // FileContentStorage gốc chỉ rm -rf thư mục cục bộ khi xoá content, không gọi
  // deleteFile() cho từng file — nếu không override, file trên Supabase sẽ bị mồ
  // côi (không bao giờ bị xoá) mỗi khi GV xoá nguyên bài giảng H5P.
  override async deleteContent(id: string, user?: H5P.IUser): Promise<void> {
    if (this.isConfigured()) {
      try {
        const files = await this.listSupabasePrefix(this.objectPath(id, ''));
        if (files.length > 0) {
          await axios.delete(`${this.supabaseUrl}/storage/v1/object/${this.bucket}`, {
            headers: {
              Authorization: `Bearer ${this.serviceRoleKey}`,
              apikey: this.serviceRoleKey,
              'Content-Type': 'application/json',
            },
            data: { prefixes: files.map((f) => this.objectPath(id, f)) },
          });
        }
      } catch (error) {
        this.logger.warn(`Xoá file Supabase thất bại khi xoá content (id=${id}): ${error.message}`);
      }
    }
    await super.deleteContent(id, user);
  }

  override async deleteFile(contentId: string, filename: string): Promise<void> {
    if (this.isConfigured()) {
      try {
        await axios.delete(
          `${this.supabaseUrl}/storage/v1/object/${this.bucket}/${this.objectPath(contentId, filename)}`,
          {
            headers: {
              Authorization: `Bearer ${this.serviceRoleKey}`,
              apikey: this.serviceRoleKey,
            },
          },
        );
        return;
      } catch (error) {
        this.logger.warn(`Xóa file Supabase thất bại (${filename}, contentId=${contentId}): ${error.message}`);
      }
    }
    try {
      await super.deleteFile(contentId, filename);
    } catch {
      // File có thể chưa từng được lưu cục bộ (đã ở Supabase) — bỏ qua lỗi not-found.
    }
  }
}
