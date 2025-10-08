import { Injectable, OnModuleInit } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleInit {
  private client!: MongoClient;
  private db!: Db;
  private dbName: string;

  constructor() {
    this.dbName = process.env.MONGODB_NAME || 'atlas-maskify';
  }

  async onModuleInit(): Promise<void> {
    this.client = await this.getMongoClient();
    this.db = this.client.db(this.dbName);
  }

  async getMongoClient(): Promise<MongoClient> {
    if (this.client) return this.client;

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      const env = process.env.ENV || 'unknown';
      throw new Error(
        `❌ Missing MONGODB_URI environment variable.
          Current environment: ${env}.
          Make sure it's set in .env (local) or provided by Vercel integration.`,
      );
    }

    this.client = new MongoClient(mongoUri, {
      maxPoolSize: 5,
      minPoolSize: 1,
    });

    await this.client.connect();
    return this.client;
  }

  async getDb(): Promise<Db> {
    if (this.db) return this.db;
    const c = await this.getMongoClient();
    this.db = c.db(this.dbName);
    return this.db;
  }
}
