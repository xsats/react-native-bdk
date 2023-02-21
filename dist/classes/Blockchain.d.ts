import { BlockchainConfig, ServerType } from '../utils/types';
import { BdkClient } from '../BdkClient';
/**
 * Blockchain methods
 * Blockchain backends module provides the implementation of a few commonly-used backends like Electrum, and Esplora.
 */
declare class Blockchain extends BdkClient {
  private height;
  private hash;
  isInit: boolean;
  /**
   * Init blockchain at native side
   * @param config
   * @param blockchainName
   * @returns {Promise<Blockchain>}
   */
  create(
    config: BlockchainConfig,
    blockchainName?: ServerType
  ): Promise<Blockchain>;
  /**
   * Get current height of the blockchain.
   * @returns {Promise<number>}
   */
  getHeight(): Promise<number>;
  /**
   * Get block hash by block height
   * @returns {Promise<number>}
   */
  getBlockHash(height?: number): Promise<string>;
}
declare const _default: Blockchain;
export default _default;
