import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMaskDto, CreateMaskResponseDto } from './dto/create-mask.dto';
import { MaskService } from './mask.service';

@Controller('mask')
export class MaskController {
  constructor(private readonly maskService: MaskService) {}

  @Post()
  @ApiOperation({
    summary: 'Mask the input string, showing only the last four characters',
  })
  @ApiResponse({
    status: 201,
    description: 'The masked string',
    type: CreateMaskResponseDto,
  })
  create(@Body() createMaskDto: CreateMaskDto): CreateMaskResponseDto {
    return new CreateMaskResponseDto(
      this.maskService.maskify(createMaskDto.chain),
    );
  }
}
