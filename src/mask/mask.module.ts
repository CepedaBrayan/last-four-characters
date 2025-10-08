import { Module } from '@nestjs/common';
import { MaskController } from './mask.controller';
import { MaskService } from './mask.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MaskController],
  providers: [MaskService],
})
export class MaskModule {}
