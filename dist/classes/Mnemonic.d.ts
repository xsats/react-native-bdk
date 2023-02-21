import { EntropyLength, WordCount } from '../utils/types';
import { BdkClient } from '../BdkClient';
import { Result } from '@synonymdev/result';
/**
 * Mnemonic phrases are a human-readable version of the private keys.
 * Supported number of words are 12, 15, 18, and 24.
 */
declare class Mnemonic extends BdkClient {
  private mnemonic;
  protected handleResult<T>(fn: () => Promise<T>): Promise<Result<T>>;
  /**
   * Generates [Mnemonic] with given [WordCount]
   * @param wordCount
   * @returns {Promise<Mnemonic>}
   */
  create(wordCount?: WordCount): Promise<Mnemonic>;
  /**
   * Generates [Mnemonic] with given [entropy]
   * @param entropy
   * @returns {Promise<Mnemonic>}
   */
  fromEntropy(entropy?: EntropyLength): Promise<Mnemonic>;
  /**
   * Get mnemonic as string
   * @returns {string}
   */
  asString(): string;
}
declare const _default: Mnemonic;
export default _default;
