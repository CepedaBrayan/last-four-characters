import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMaskDto {
  @ApiProperty({
    example: '4556364607935616',
    description: 'String to be masked (required, non-null, max 100 chars)',
    maxLength: 100,
    required: true,
    nullable: false,
  })
  @IsDefined({ message: 'chain is required' })
  @IsString({ message: 'chain must be a string' })
  @IsNotEmpty({ message: 'chain cannot be empty' })
  @MaxLength(100, { message: 'chain must not exceed 100 characters' })
  chain: string;
}

export class CreateMaskResponseDto {
  constructor(maskedChain: string) {
    this.maskedChain = maskedChain;
  }

  @ApiProperty({
    example: '############5616',
    description: 'Masked string (all but last four characters replaced by #)',
    name: 'masked_chain',
  })
  @Expose({ name: 'masked_chain' })
  maskedChain: string;
}
