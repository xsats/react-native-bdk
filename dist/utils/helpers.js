// @ts-ignore
import is from 'is_js';
/** Check if value is exists and not empty */
export const _exists = (value) => is.existy(value) && is.not.empty(value);
export const allPropertiesDefined = (obj) => {
  return Object.values(obj).every((value) => value !== undefined);
};
export const getWordCountForEntropy = (entropy) => {
  let wordCount;
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
//# sourceMappingURL=helpers.js.map
