import { BdkClient } from '../BdkClient';

/**
 * Descriptor Public key methods
 */
class DescriptorPublicKey extends BdkClient {
  public xpub: string | undefined;

  /**
   * Create xpub
   * @returns {Promise<DescriptorPublicKey>}
   */
  async create(): Promise<DescriptorPublicKey> {
    this.xpub = await this._bdk.createDescriptorPublic(this.xpub as string);
    return this;
  }

  /**
   * Derive xpub from derivation path
   * @param path
   * @returns {Promise<DescriptorPublicKey>}
   */
  async derive(path: string): Promise<DescriptorPublicKey> {
    this.xpub = await this._bdk.descriptorPublicDerive(path);
    return this;
  }

  /**
   * Extend xpub from derivation path
   * @param path
   * @returns {Promise<DescriptorPublicKey>}
   */
  async extend(path: string): Promise<DescriptorPublicKey> {
    this.xpub = await this._bdk.descriptorPublicExtend(path);
    return this;
  }

  /**
   * Get public key as string
   * @returns {string}
   */
  asString(): string | undefined {
    return this.xpub;
  }
}

export default new DescriptorPublicKey();
