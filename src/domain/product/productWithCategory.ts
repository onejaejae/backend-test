import { BadRequestException } from '@nestjs/common';
import { CategoryMapType, IProduct } from 'src/types/common';

export class ProductWithCategory {
  constructor(private product: IProduct) {}

  assignCategoryByKeyword(categoryMap: CategoryMapType) {
    const keyword = this.product.keyword;
    const targetCategoryId = categoryMap.get(keyword);

    if (!targetCategoryId)
      throw new BadRequestException(`keyword: ${keyword} don't match`);

    const productWithCategory = {
      name: this.product.name,
      category: {
        id: targetCategoryId,
        name: keyword,
      },
    };

    return {
      product: productWithCategory,
    };
  }
}
