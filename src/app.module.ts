import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MaskModule } from './mask/mask.module';

@Module({
  imports: [MaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
