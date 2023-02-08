import { BdkClient } from '../BdkClient';
/**
 * Descriptor Public key methods
 */
declare class DescriptorPublicKeyInterface extends BdkClient {
  xpub: string | undefined;
  /**
   * Get public key as string
   * @returns {string}
   */
  asString(): string | undefined;
}
export declare const DescriptorPublicKey: DescriptorPublicKeyInterface;
export {};
