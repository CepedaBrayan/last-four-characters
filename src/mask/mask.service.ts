import { Injectable } from '@nestjs/common';
import { CreateMaskDto } from './dto/create-mask.dto';

@Injectable()
export class MaskService {
  maskify(createMaskDto: CreateMaskDto) {
    const input = createMaskDto.chain;
    if (input.length <= 4) return input;
    return '#'.repeat(input.length - 4) + input.slice(-4);
  }
}
