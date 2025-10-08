import { Module } from '@nestjs/common';
import { MaskController } from './mask.controller';
import { MaskService } from './mask.service';

@Module({
  controllers: [MaskController],
  providers: [MaskService],
})
export class MaskModule {}
