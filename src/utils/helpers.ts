// @ts-ignore
import is from 'is_js';
import { EntropyLength, WordCount } from './types';

/** Check if value is exists and not empty */
export const _exists = (value: any) => is.existy(value) && is.not.empty(value);

export const allPropertiesDefined = (obj: {}) => {
  return Object.values(obj).every((value) => value !== undefined);
};

export const getWordCountForEntropy = (entropy: EntropyLength) => {
  let wordCount: WordCount;
  switch (entropy) {
    case 16:
      wordCount = 12;
      break;
    case 24:
      wordCount = 18;
      break;
    case 32:
      wordCount = 24;
      break;
    default:
      wordCount = 24;
  }
  return wordCount;
};
