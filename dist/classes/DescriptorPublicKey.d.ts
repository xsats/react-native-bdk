import { BdkClient } from '../BdkClient';
/**
 * Descriptor Public key methods
 */
declare class DescriptorPublicKey extends BdkClient {
  xpub: string | undefined;
  /**
   * Create xpub
   * @returns {Promise<DescriptorPublicKey>}
   */
  create(): Promise<DescriptorPublicKey>;
  /**
   * Derive xpub from derivation path
   * @param path
   * @returns {Promise<DescriptorPublicKey>}
   */
  derive(path: string): Promise<DescriptorPublicKey>;
  /**
   * Extend xpub from derivation path
   * @param path
   * @returns {Promise<DescriptorPublicKey>}
   */
  extend(path: string): Promise<DescriptorPublicKey>;
  /**
   * Get public key as string
   * @returns {string}
   */
  asString(): string | undefined;
}
declare const _default: DescriptorPublicKey;
export default _default;
