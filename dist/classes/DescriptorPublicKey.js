import { BdkClient } from '../BdkClient';
/**
 * Descriptor Public key methods
 */
class DescriptorPublicKey extends BdkClient {
  /**
   * Create xpub
   * @returns {Promise<DescriptorPublicKey>}
   */
  async create() {
    this.xpub = await this._bdk.createDescriptorPublic(this.xpub);
    return this;
  }
  /**
   * Derive xpub from derivation path
   * @param path
   * @returns {Promise<DescriptorPublicKey>}
   */
  async derive(path) {
    this.xpub = await this._bdk.descriptorPublicDerive(path);
    return this;
  }
  /**
   * Extend xpub from derivation path
   * @param path
   * @returns {Promise<DescriptorPublicKey>}
   */
  async extend(path) {
    this.xpub = await this._bdk.descriptorPublicExtend(path);
    return this;
  }
  /**
   * Get public key as string
   * @returns {string}
   */
  asString() {
    return this.xpub;
  }
}
export default new DescriptorPublicKey();
//# sourceMappingURL=DescriptorPublicKey.js.map
