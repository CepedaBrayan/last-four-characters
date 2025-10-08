import { Injectable } from '@nestjs/common';

@Injectable()
export class MaskService {
  maskify(input: string): string {
    if (input.length <= 4) return input;
    return '#'.repeat(input.length - 4) + input.slice(-4);
  }
}
