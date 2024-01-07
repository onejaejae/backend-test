import { IAppService, IRedisDLM, IRedisService } from './types/common';
import { AppService } from './app.service';
import { type MockProxy, mock } from 'jest-mock-extended';

describe('app service proxy test', () => {
  let redisService: MockProxy<IRedisService>;
  let redisDLM: MockProxy<IRedisDLM>;
  let service: IAppService;

  beforeAll(async () => {
    redisService = mock<IRedisService>();
    redisDLM = mock<IRedisDLM>();
    service = new AppService(redisService, redisDLM);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should increment and call A 서버 호출 로직 when lock 획득 + rate limit is not exceeded', async () => {
    // given
    redisDLM.acquireLock.mockResolvedValue('randomIdentity');
    redisService.isRateLimitExceeded.mockResolvedValue(false);

    // when
    await service.proxy('testUserId');

    // then
    expect(redisService.increment).toHaveBeenCalledWith('testUserId');
    expect(redisDLM.releaseLock).toHaveBeenCalledWith(
      'testUserIdlock',
      'randomIdentity',
    );
  });

  it('should wait and then increment when rate limit is exceeded', async () => {
    // given
    redisDLM.acquireLock.mockResolvedValue('randomIdentity');
    redisService.isRateLimitExceeded
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValue(false);

    // when
    await service.proxy('testUserId');

    // then
    expect(redisService.increment).toHaveBeenCalledWith('testUserId');
    expect(redisDLM.releaseLock).toHaveBeenCalledWith(
      'testUserIdlock',
      'randomIdentity',
    );
  });
});
