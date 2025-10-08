import { Injectable } from '@nestjs/common';
import { CreateMaskDto } from './dto/create-mask.dto';

@Injectable()
export class MaskService {
  create(createMaskDto: CreateMaskDto) {
    return 'This action adds a new mask';
  }

  findAll() {
    return `This action returns all mask`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mask`;
  }

  remove(id: number) {
    return `This action removes a #${id} mask`;
  }
}
