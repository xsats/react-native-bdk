// @ts-ignore
import is from 'is_js';
/** Check if value is exists and not empty */
export const _exists = (value) => is.existy(value) && is.not.empty(value);
export const allPropertiesDefined = (obj) => {
  return Object.values(obj).every((value) => value !== undefined);
};
//# sourceMappingURL=helpers.js.map
