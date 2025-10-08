import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private static readonly DEFAULT_DB_NAME = 'atlas-maskify';
  private static readonly POOL_CONFIG = { maxPoolSize: 5, minPoolSize: 1 };

  private client: MongoClient | null = null;
  private db: Db | null = null;
  private readonly dbName: string;
  private readonly log = new Logger(MongoService.name);

  constructor() {
    this.dbName = process.env.MONGODB_NAME || MongoService.DEFAULT_DB_NAME;
  }

  async onModuleInit(): Promise<void> {
    try {
      this.client = await this.createClient();
      this.db = this.client.db(this.dbName);
      this.log.log(`MongoDB connected [db=${this.dbName}]`);
    } catch (error) {
      this.log.error(
        `Failed to initialize MongoDB: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  private async createClient(): Promise<MongoClient> {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        'Missing MONGODB_URI environment variable. ' +
          'Provide it in .env or your deployment environment.',
      );
    }

    if (this.client) return this.client;

    const client = new MongoClient(uri, MongoService.POOL_CONFIG);
    await client.connect();
    return client;
  }

  async getDb(): Promise<Db> {
    if (this.db) return this.db;
    this.client = await this.createClient();
    this.db = this.client.db(this.dbName);
    return this.db;
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.log.log('MongoDB connection closed');
    }
  }
}
