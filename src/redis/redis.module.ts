import { ClassProvider, FactoryProvider, Module } from '@nestjs/common';
import { RedisDLMKey, RedisServiceKey } from 'src/const';
import { RedisService } from './redis.service';
import { Redis } from 'ioredis';
import { RedisDLM } from './redis.dlm';

const redisConnect: FactoryProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const client = new Redis({
      port: 6379,
      host: '127.0.0.1',
    });
    return client;
  },
};

const redisService: ClassProvider = {
  provide: RedisServiceKey,
  useClass: RedisService,
};

const redisDLM: ClassProvider = {
  provide: RedisDLMKey,
  useClass: RedisDLM,
};

@Module({
  providers: [redisConnect, redisService, redisDLM],
  exports: [redisService, redisDLM],
})
export class RedisModule {}
