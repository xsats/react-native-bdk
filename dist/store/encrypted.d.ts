/**
 * @fileOverview a module to wrap native secure key store apis
 */
/**
 * Store an item in the keychain.
 * @param {string} key   The key by which to do a lookup
 * @param {string} value The value to be stored
 * @return {Promise<undefined>}
 */
export declare function setItem(key: any, value: string): Promise<void>;
/**
 * Read an item stored in the keychain.
 * @param  {string} key      The key by which to do a lookup.
 * @return {Promise<string>} The stored value
 */
export declare function getItem(key: any): Promise<string | null>;
