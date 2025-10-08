import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMaskDto } from './dto/create-mask.dto';
import { MaskService } from './mask.service';

@Controller('mask')
export class MaskController {
  constructor(private readonly maskService: MaskService) {}

  @Post()
  create(@Body() createMaskDto: CreateMaskDto) {
    return this.maskService.create(createMaskDto);
  }

  @Get()
  findAll() {
    return this.maskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maskService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.maskService.remove(+id);
  }
}
