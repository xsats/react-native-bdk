/**
 * @fileOverview a module to wrap native secure key store apis
 */

import EncryptedStorage from 'react-native-encrypted-storage';
import { isString } from '../utils/validate';

const VERSION = '1';

/**
 * Store an item in the keychain.
 * @param {string} key   The key by which to do a lookup
 * @param {string} value The value to be stored
 * @return {Promise<undefined>}
 */
export async function setItem(key: any, value: string) {
  if (!isString(key) || !key || !isString(value)) {
    throw new Error('Invalid args');
  }
  const vKey = `${VERSION}_${key}`;
  await EncryptedStorage.setItem(vKey, value);
}

/**
 * Read an item stored in the keychain.
 * @param  {string} key      The key by which to do a lookup.
 * @return {Promise<string>} The stored value
 */
export async function getItem(key: any) {
  if (!isString(key) || !key) {
    throw new Error('Invalid args');
  }
  const vKey = `${VERSION}_${key}`;
  return await EncryptedStorage.getItem(vKey);
}
