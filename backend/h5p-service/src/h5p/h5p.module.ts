import { Module } from '@nestjs/common';
import { H5pService } from './h5p.service';
import { H5pController } from './h5p.controller';

@Module({
  providers: [H5pService],
  controllers: [H5pController],
  exports: [H5pService],
})
export class H5pModule {}
