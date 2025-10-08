import { PartialType } from '@nestjs/mapped-types';
import { CreateMaskDto } from './create-mask.dto';

export class UpdateMaskDto extends PartialType(CreateMaskDto) {}
