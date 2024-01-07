import { Inject } from '@nestjs/common';
import { MyRedis } from './redis.wrapper';
import { v4 as uuidV4 } from 'uuid';
import { sleep } from 'src/util/sleep';

export class RedisDLM {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: MyRedis) {
    redis.defineCommand('releaseLock', {
      numberOfKeys: 1,
      lua: `
  if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
  else
  return 0
  end
  `,
    });
  }

  async acquireLock(key: string) {
    while (true) {
      const { identity, success } = await this.tryToAcquireLock(key);

      if (success) {
        return identity;
      }

      await sleep(250); // 실제로는 정해진 수만큼 락 획득을 시도하고 포기해야 합니다
    }
  }

  private async tryToAcquireLock(key: string) {
    const identity = uuidV4();
    const result = await this.redis.set(key, identity, 'PX', 30000, 'NX');

    return {
      success: result === 'OK',
      identity,
    };
  }

  async releaseLock(key: string, identity: string) {
    const numberOfDeletedKey = await this.redis.releaseLock(key, identity);

    return {
      success: numberOfDeletedKey === 1,
    };
  }
}
