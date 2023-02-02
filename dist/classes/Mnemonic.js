import { EntropyLength, WordCount } from '../utils/types';
import { BdkClient } from '../BdkClient';
import { getWordCountForEntropy } from '../utils/helpers';
import { err, ok } from '@synonymdev/result';
/**
 * Mnemonic phrases are a human-readable version of the private keys.
 * Supported number of words are 12, 15, 18, and 24.
 */
class MnemonicInterface extends BdkClient {
    constructor() {
        super(...arguments);
        this.mnemonic = '';
    }
    handleResult(fn) {
        try {
            const result = fn();
            if (!result)
                throw new Error('Failed to retrieve result');
            return result.then(ok);
        }
        catch (e) {
            return Promise.resolve(err(e));
        }
    }
    /**
     * Generates [Mnemonic] with given [WordCount]
     * @param wordCount
     * @returns {Promise<MnemonicInterface>}
     */
    async create(wordCount = WordCount.WORDS12) {
        if (!Object.values(WordCount).includes(wordCount))
            throw 'Invalid word count passed';
        this.mnemonic = await this._bdk.generateMnemonic(wordCount);
        return this;
    }
    /**
     * Generates [Mnemonic] with given [entropy]
     * @param entropy
     * @returns {Promise<MnemonicInterface>}
     */
    async fromEntropy(entropy = EntropyLength.Length32) {
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
    asString() {
        return this.mnemonic;
    }
}
export const Mnemonic = new MnemonicInterface();
//# sourceMappingURL=Mnemonic.js.map