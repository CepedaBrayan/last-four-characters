import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ObjectId } from 'mongodb';
import { MongoService } from 'src/database/mongo.service';
import { GetMaskResponseDto } from './dto/get-mask.dto';

@Injectable()
export class MaskService {
  private readonly log = new Logger(MaskService.name);
  private readonly collectionName: string;
  constructor(private readonly mongoService: MongoService) {
    this.collectionName =
      process.env.MONGODB_MASK_COLLECTION || 'masked_chains';
  }

  maskify(input: string): string {
    if (input.length <= 4) return input;
    return '#'.repeat(input.length - 4) + input.slice(-4);
  }

  async saveMaskedChain(
    ip: string,
    originalChain: string,
    maskedChain: string,
  ): Promise<string> {
    try {
      const internalId = `${Date.now()}-${randomUUID()}`;
      const createdAt = Date.now();
      const db = await this.mongoService.getDb();
      const result = await db.collection(this.collectionName).insertOne({
        internal_id: internalId,
        ip,
        original_chain: originalChain,
        masked_chain: maskedChain,
        created_at: createdAt,
      });
      const insertedId = result.insertedId.toString();
      this.log.debug(`Saved masked chain with id ${insertedId}`);
      return insertedId;
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      this.log.error(`Failed to save masked chain: ${msg}`);
      throw error;
    }
  }

  async findInCache(
    originalChain: string,
  ): Promise<{ insertedId: string; maskedChain: string } | null> {
    try {
      const db = await this.mongoService.getDb();

      const record = await db
        .collection(this.collectionName)
        .findOne(
          { original_chain: originalChain },
          { projection: { _id: 1, masked_chain: 1 } },
        );

      if (!record) {
        this.log.debug(`No cache entry found for chain ${originalChain}`);
        return null;
      }

      const foundId = String(record._id);
      const maskedChain = String(record.masked_chain ?? '');

      this.log.debug(
        `✅ Cache hit for chain ${originalChain}, found id ${foundId}`,
      );
      return { insertedId: foundId, maskedChain };
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      this.log.error(`💥 Failed to check cache: ${msg}`);
      throw error;
    }
  }

  async findByInsertedId(
    insertedId: string,
  ): Promise<GetMaskResponseDto | null> {
    try {
      const db = await this.mongoService.getDb();
      if (!ObjectId.isValid(insertedId)) {
        this.log.warn(`⚠️ Invalid ObjectId format: ${insertedId}`);
        return null;
      }

      const record = await db
        .collection(this.collectionName)
        .findOne({ _id: new ObjectId(insertedId) }, { projection: { _id: 0 } });

      if (!record) {
        this.log.warn(`⚠️ No record found for id: ${insertedId}`);
        return null;
      }

      this.log.debug(`✅ Found record for id: ${insertedId}`);
      return new GetMaskResponseDto(
        String(record.internal_id ?? 'unknown-internal-id'),
        String(record.ip ?? 'unknown-ip'),
        String(record.original_chain ?? 'unknown-original-chain'),
        String(record.masked_chain ?? 'unknown-masked-chain'),
        Number(record.created_at ?? Date.now()),
      );
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      this.log.error(`💥 Failed to find record by id ${insertedId}: ${msg}`);
      throw error;
    }
  }
}
