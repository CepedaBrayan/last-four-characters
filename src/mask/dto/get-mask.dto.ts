import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetMaskResponseDto {
  constructor(
    internalId: string,
    ip: string,
    originalChain: string,
    maskedChain: string,
    createdAt: number,
  ) {
    this.internalId = internalId;
    this.ip = ip;
    this.originalChain = originalChain;
    this.maskedChain = maskedChain;
    this.createdAt = createdAt;
  }

  @ApiProperty({
    example: '64b8f0f5e1d2c3a4b5c6d7e8',
    description: 'Internal database ID of the masked chain record',
    name: 'internal_id',
  })
  @Expose({ name: 'internal_id' })
  internalId: string;

  @ApiProperty({
    example: '192.168.1.1',
    description: 'IP address of the user',
    name: 'ip',
  })
  @Expose({ name: 'ip' })
  ip: string;

  @ApiProperty({
    example: 'original-chain-data',
    description: 'Original chain data',
    name: 'original_chain',
  })
  @Expose({ name: 'original_chain' })
  originalChain: string;

  @ApiProperty({
    example: '############data',
    description: 'Masked chain data',
    name: 'masked_chain',
  })
  @Expose({ name: 'masked_chain' })
  maskedChain: string;

  @ApiProperty({
    example: 1633036800000,
    description: 'Timestamp when the record was created',
    name: 'created_at',
  })
  @Expose({ name: 'created_at' })
  createdAt: number;
}
