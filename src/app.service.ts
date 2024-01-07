import { Inject, Injectable } from '@nestjs/common';
import {
  CategoryMapType,
  IAppService,
  IOptionList,
  IProduct,
  IRedisDLM,
  IRedisService,
  TranslateWordMapType,
} from './types/common';
import { Challenge2ResponseDto } from './dtos/responses/challenge2.response.dto';
import { ProductWithCategory } from './domain/product/productWithCategory';
import { RedisDLMKey, RedisServiceKey } from './const';
import { sleep } from './util/sleep';

@Injectable()
export class AppService implements IAppService {
  constructor(
    @Inject(RedisServiceKey) private readonly redisService: IRedisService,
    @Inject(RedisDLMKey) private readonly redisDLM: IRedisDLM,
  ) {}

  async proxy(userId: string) {
    const lockKey = userId + 'lock';
    const identity = await this.redisDLM.acquireLock(lockKey);

    const isRateLimitExceeded =
      await this.redisService.isRateLimitExceeded(userId);

    if (isRateLimitExceeded) {
      while (await this.redisService.isRateLimitExceeded(userId)) {
        await sleep(500);
      }

      await this.redisService.increment(userId);
      // A 서버 호출 로직
    } else {
      await this.redisService.increment(userId);
      // A 서버 호출 로직
    }

    await this.redisDLM.releaseLock(lockKey, identity);
    return true;
  }

  /**
   * 코딩 테스트 - 1: 상품 카테고리 매칭
   *
   * 목표
   * 상품을 수집할 때 제공된 키워드를 기반으로 카테고리 목록과 매칭하여 상품에 카테고리 정보를 연결하는 프로세스를 구현합니다.
   */
  challenge1(): number {
    const start = Date.now();
    //함수 실행 시간 반환
    const categoryList = [
      { id: 1, name: '가구' },
      { id: 2, name: '공구' },
      { id: 3, name: '의류' },
    ];
    [...new Array(10000)].forEach((_, index) => {
      categoryList.push({ id: index + 4, name: `카테고리${index + 4}` });
    });

    const categoryMap: CategoryMapType = new Map(
      categoryList.map((entry) => [entry.name, entry.id]),
    );

    const product: IProduct = {
      id: 1,
      name: '의자',
      keyword: '가구',
    };
    const newProductWithCategory = new ProductWithCategory(product);
    // result!
    const productWithCategory =
      newProductWithCategory.assignCategoryByKeyword(categoryMap);

    const end = Date.now();
    return end - start;
  }

  /**
   * 코딩 테스트 - 2: 단어 치환
   *
   * 목표
   * 옵션 이름에 나타난 특정 단어들을 주어진 단어 치환 목록을 사용하여 변경합니다.
   */
  challenge2(): number {
    const start = Date.now();

    const translateWordList = [
      { src: '블랙', dest: '검정색' },
      { src: '레드', dest: '빨간색' },
    ];
    [...new Array(10000)].forEach((_, index) => {
      translateWordList.push({ src: index.toString(), dest: `A` });
    });

    const translateWordMap: TranslateWordMapType = new Map(
      translateWordList.map((entry) => [entry.src, entry.dest]),
    );

    const optionList: Array<IOptionList> = [
      { id: 1, name: '블랙 XL' },
      { id: 2, name: '블랙 L' },
      { id: 3, name: '블랙 M' },
      { id: 4, name: '레드 XL' },
      { id: 5, name: '레드 L' },
      { id: 6, name: '레드 M' },
    ];
    [...new Array(50)].forEach((_, index) => {
      optionList.push({ id: index + 7, name: `블랙${index + 7}` });
    });

    const challenge2ResponseDto = new Challenge2ResponseDto(optionList);
    // result!
    const updateOptionList =
      challenge2ResponseDto.generateUpdateOptionList(translateWordMap);

    const end = Date.now();
    return end - start;
  }
}
