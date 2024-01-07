export interface IAppService {
  proxy(userId: string): Promise<boolean>;
  challenge1(): number;
  challenge2(): number;
}

export interface IOptionList {
  id: number;
  name: string;
}

export interface IProduct {
  id: number;
  name: string;
  keyword: string;
}

export interface IRedisService {
  increment(key: string): Promise<void>;
  isRateLimitExceeded(key: string): Promise<boolean>;
}

export interface IRedisDLM {
  acquireLock(key: string): Promise<string>;
  tryToAcquireLock(key: string): Promise<{
    success: boolean;
    identity: string;
  }>;
  releaseLock(
    key: string,
    identity: string,
  ): Promise<{
    success: boolean;
  }>;
}

export type TranslateWordMapType = Map<string, string>;
export type CategoryMapType = Map<string, number>;
