import { EntropyLength, WordCount } from '../utils/types';
import { BdkClient } from '../BdkClient';
import { getWordCountForEntropy } from '../utils/helpers';
import { err, ok, Result } from '@synonymdev/result';

/**
 * Mnemonic phrases are a human-readable version of the private keys.
 * Supported number of words are 12, 15, 18, and 24.
 */
class Mnemonic extends BdkClient {
  private mnemonic: string = '';

  protected handleResult<T>(fn: () => Promise<T>): Promise<Result<T>> {
    try {
      const result = fn();
      if (!result) throw new Error('Failed to retrieve result');
      return result.then(ok);
    } catch (e: any) {
      return Promise.resolve(err(e));
    }
  }

  /**
   * Generates [Mnemonic] with given [WordCount]
   * @param wordCount
   * @returns {Promise<Mnemonic>}
   */
  async create(wordCount: WordCount = WordCount.WORDS12): Promise<Mnemonic> {
    if (!Object.values(WordCount).includes(wordCount))
      throw 'Invalid word count passed';
    this.mnemonic = await this._bdk.generateMnemonic(wordCount);
    return this;
  }

  /**
   * Generates [Mnemonic] with given [entropy]
   * @param entropy
   * @returns {Promise<Mnemonic>}
   */
  async fromEntropy(
    entropy: EntropyLength = EntropyLength.Length32
  ): Promise<Mnemonic> {
    if (!Object.values(EntropyLength).includes(entropy))
      throw 'Invalid entropy length passed';

    const wordCount = getWordCountForEntropy(entropy);
    this.mnemonic = await this._bdk.generateMnemonic(wordCount);
    return this;
  }

  /**
   * Get mnemonic as string
   * @returns {string}
   */
  asString(): string {
    return this.mnemonic;
  }
}

export default new Mnemonic();
