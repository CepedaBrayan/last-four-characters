import { Test, TestingModule } from '@nestjs/testing';
import { MongoService } from '../database/mongo.service';
import { MaskService } from './mask.service';

describe('MaskService', () => {
  let service: MaskService;

  // Minimal mock to satisfy the dependency
  const mockMongoService = {
    getDb: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaskService,
        { provide: MongoService, useValue: mockMongoService },
      ],
    }).compile();

    service = module.get<MaskService>(MaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('maskify', () => {
    const cases: Array<{ name: string; input: string; expected: string }> = [
      {
        name: 'long numeric string',
        input: '4556364607935616',
        expected: '############5616',
      },
      {
        name: 'medium numeric string',
        input: '64607935616',
        expected: '#######5616',
      },
      {
        name: 'one character string',
        input: '1',
        expected: '1',
      },
      {
        name: 'less than 4 characters',
        input: 'ABC',
        expected: 'ABC',
      },
      {
        name: 'exactly 4 characters',
        input: 'ABCD',
        expected: 'ABCD',
      },
      {
        name: 'simple text',
        input: 'Skippy',
        expected: '##ippy',
      },
      {
        name: 'long string with spaces & special chars',
        input: 'Nananananananananananananananana Batman!',
        expected: '####################################man!',
      },
      {
        name: 'string with spaces',
        input: 'Hello World',
        expected: '#######orld',
      },
      {
        name: 'string with special characters',
        input: '@#$%1234',
        expected: '####1234',
      },
      {
        name: '5 characters',
        input: 'ABCDE',
        expected: '#BCDE',
      },
      {
        name: 'numeric string with space',
        input: '1234 5678',
        expected: '#####5678',
      },
    ];

    it.each(cases)(
      'should mask correctly for: $name as table driven test',
      ({ input, expected }) => {
        expect(service.maskify(input)).toBe(expected);
      },
    );

    it('should handle very long strings efficiently', () => {
      const input = 'x'.repeat(10000) + 'ABCD';
      const result = service.maskify(input);
      expect(result.startsWith('#'.repeat(10000))).toBe(true);
      expect(result.endsWith('ABCD')).toBe(true);
    });

    it('should not modify the original input', () => {
      const input = 'Skippy';
      const copy = input;
      service.maskify(input);
      expect(input).toBe(copy);
    });
  });
});
