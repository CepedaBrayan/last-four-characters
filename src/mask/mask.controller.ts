import { Body, Controller, Post } from '@nestjs/common';
import { CreateMaskDto } from './dto/create-mask.dto';
import { MaskService } from './mask.service';

@Controller('mask')
export class MaskController {
  constructor(private readonly maskService: MaskService) {}

  @Post('/mask')
  create(@Body() createMaskDto: CreateMaskDto) {
    return this.maskService.maskify(createMaskDto);
  }
}
