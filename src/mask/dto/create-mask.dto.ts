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
  constructor(originalChain: string, maskedChain: string, insertedId: string) {
    this.originalChain = originalChain;
    this.maskedChain = maskedChain;
    this.insertedId = insertedId;
  }

  @ApiProperty({
    example: '4556364607935616',
    description: 'Original unmasked string',
    name: 'original_chain',
  })
  @Expose({ name: 'original_chain' })
  originalChain: string;

  @ApiProperty({
    example: '############5616',
    description: 'Masked string (all but last four characters replaced by #)',
    name: 'masked_chain',
  })
  @Expose({ name: 'masked_chain' })
  maskedChain: string;

  @ApiProperty({
    example: '64b8f0f5e1d2c3a4b5c6d7e8',
    description: 'Database ID of the saved masked chain record',
    name: 'inserted_id',
  })
  @Expose({ name: 'inserted_id' })
  insertedId: string;
}
