import { Inject } from '@nestjs/common';
import { C } from 'src/const';
import { IRedisService } from 'src/types/common';
import { MyRedis } from './redis.wrapper';

export class RedisService implements IRedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: MyRedis) {}

  private async setTTL(key: string) {
    return this.redis.expire(key, C.TTL);
  }

  private async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async increment(key: string) {
    const value = await this.redis.incr(key);

    if (value === 1) await this.setTTL(key);
  }

  async isRateLimitExceeded(key: string) {
    const cnt = await this.get(key);

    if (cnt) {
      const parseIntCnt = parseInt(cnt, 10);
      if (parseIntCnt >= C.RATE_LIMIT) return true;
    }

    return false;
  }
}
