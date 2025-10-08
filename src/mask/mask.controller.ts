import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMaskDto, CreateMaskResponseDto } from './dto/create-mask.dto';
import { GetMaskResponseDto } from './dto/get-mask.dto';
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
  async create(
    @Body() createMaskDto: CreateMaskDto,
    @Req() req: Request,
  ): Promise<CreateMaskResponseDto> {
    const originalChain = createMaskDto.chain;
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      'unknown-ip-address';

    const cached = await this.maskService.findInCache(originalChain);
    let insertedId: string;
    let maskedChain: string;

    if (cached) {
      insertedId = cached.insertedId;
      maskedChain = cached.maskedChain;
    } else {
      maskedChain = this.maskService.maskify(originalChain);
      insertedId = await this.maskService.saveMaskedChain(
        ip,
        originalChain,
        maskedChain,
      );
    }
    return new CreateMaskResponseDto(originalChain, maskedChain, insertedId);
  }

  @Get(':insertedId')
  @ApiOperation({
    summary: 'Retrieve a masked record by its MongoDB insertedId',
  })
  @ApiResponse({
    status: 200,
    description: 'The full record from MongoDB',
    type: GetMaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findById(
    @Param('insertedId') insertedId: string,
  ): Promise<GetMaskResponseDto> {
    const record = await this.maskService.findByInsertedId(insertedId);
    if (!record)
      throw new NotFoundException(`No record found with id: ${insertedId}`);
    return record;
  }
}
