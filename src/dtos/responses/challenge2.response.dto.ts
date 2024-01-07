import { TranslateWordMapType, IOptionList } from 'src/types/common';

export class Challenge2ResponseDto {
  constructor(private readonly optionList: Array<IOptionList>) {}

  generateUpdateOptionList(translateWordMap: TranslateWordMapType) {
    return this.optionList.map((option) => {
      const updatedName = option.name
        .split(' ')
        .map((word) => {
          for (const [src, dest] of translateWordMap.entries()) {
            if (word.includes(src)) {
              word = word.replace(src, dest);
              break;
            }
          }
          return word;
        })
        .join(' ');

      return { id: option.id, name: updatedName };
    });
  }
}
