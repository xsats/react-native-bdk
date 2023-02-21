import {
  BlockchainConfig,
  ElectrumConfig,
  EsploraConfig,
  ServerType,
} from '../utils/types';
import { BdkClient } from '../BdkClient';

/**
 * Blockchain methods
 * Blockchain backends module provides the implementation of a few commonly-used backends like Electrum, and Esplora.
 */
class Blockchain extends BdkClient {
  private height: number = 0;
  private hash: string = '';
  public isInit: boolean = false;

  /**
   * Init blockchain at native side
   * @param config
   * @param blockchainName
   * @returns {Promise<Blockchain>}
   */
  async create(
    config: BlockchainConfig,
    blockchainName: ServerType = ServerType.Electrum
  ): Promise<Blockchain> {
    if (blockchainName === ServerType.Esplora) {
      const { url, proxy, concurrency, timeout, stopGap } =
        config as EsploraConfig;
      this.height = await this._bdk.initEsploraBlockchain(
        url,
        proxy,
        concurrency,
        timeout,
        stopGap
      );
    } else {
      const { url, retry, stopGap, timeout } = config as ElectrumConfig;
      this.height = await this._bdk.initElectrumBlockchain(
        url,
        retry,
        stopGap,
        timeout
      );
    }
    if (this.height > 0) this.isInit = true;
    return this;
  }

  /**
   * Get current height of the blockchain.
   * @returns {Promise<number>}
   */
  async getHeight(): Promise<number> {
    this.height = await this._bdk.getBlockchainHeight();
    return this.height;
  }

  /**
   * Get block hash by block height
   * @returns {Promise<number>}
   */
  async getBlockHash(height: number = this.height): Promise<string> {
    this.hash = await this._bdk.getBlockHash(height);
    return this.hash;
  }
}

export default new Blockchain();
