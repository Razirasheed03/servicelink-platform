// src/repositories/baseRepository.ts
import { Model, Document } from "mongoose";

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(entity: Partial<T>): Promise<T> {
    return await this.model.create(entity);
  }

  async findByEmail(email: string): Promise<T | null> {
    return await this.model.findOne({ email });
  }
}