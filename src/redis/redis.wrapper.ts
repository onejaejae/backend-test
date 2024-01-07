import { Redis as RedisInterface } from 'ioredis';

export interface MyRedis extends RedisInterface {
  releaseLock(key: string, value: string): Promise<number>;
}
