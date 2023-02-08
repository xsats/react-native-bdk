import { BdkClient } from '../BdkClient';

/**
 * Descriptor Public key methods
 */
class DescriptorPublicKeyInterface extends BdkClient {
  public xpub: string | undefined;

  /**
   * Get public key as string
   * @returns {string}
   */
  asString(): string | undefined {
    return this.xpub;
  }
}

export const DescriptorPublicKey = new DescriptorPublicKeyInterface();
