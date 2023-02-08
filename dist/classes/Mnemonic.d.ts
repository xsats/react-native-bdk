import { EntropyLength, WordCount } from '../utils/types';
import { BdkClient } from '../BdkClient';
import { Result } from '@synonymdev/result';
/**
 * Mnemonic phrases are a human-readable version of the private keys.
 * Supported number of words are 12, 15, 18, and 24.
 */
declare class MnemonicInterface extends BdkClient {
  private mnemonic;
  protected handleResult<T>(fn: () => Promise<T>): Promise<Result<T>>;
  /**
   * Generates [Mnemonic] with given [WordCount]
   * @param wordCount
   * @returns {Promise<MnemonicInterface>}
   */
  create(wordCount?: WordCount): Promise<MnemonicInterface>;
  /**
   * Generates [Mnemonic] with given [entropy]
   * @param entropy
   * @returns {Promise<MnemonicInterface>}
   */
  fromEntropy(entropy?: EntropyLength): Promise<MnemonicInterface>;
  /**
   * Get mnemonic as string
   * @returns {string}
   */
  asString(): string;
}
export declare const Mnemonic: MnemonicInterface;
export {};
