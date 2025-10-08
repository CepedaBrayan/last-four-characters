import { Injectable } from '@nestjs/common';
import { CreateMaskDto } from './dto/create-mask.dto';
import { UpdateMaskDto } from './dto/update-mask.dto';

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

  update(id: number, updateMaskDto: UpdateMaskDto) {
    return `This action updates a #${id} mask`;
  }

  remove(id: number) {
    return `This action removes a #${id} mask`;
  }
}
