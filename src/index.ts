import { ApiPromise, WsProvider } from '@polkadot/api';
import { Text } from '@polkadot/types';

/**
 * The Mangata class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export class Mangata {
  private static instance: Mangata;
  private apiPromise: Promise<ApiPromise> | null;
  private uri: string;

  /**
   * The Mangata's constructor is private to prevent direct
   * construction calls with the `new` operator.
   * Initialised via isReady & new with specific provider
   */
  private constructor(uri: string) {
    this.apiPromise = null;
    this.uri = uri;
  }

  private async connect() {
    if (!this.apiPromise) {
      const provider = new WsProvider(this.uri);
      this.apiPromise = new ApiPromise({ provider }).isReady;
    }

    return this.apiPromise;
  }

  /**
   * The static method that controls the access to the Mangata instance.
   */
  public static getInstance(uri: string): Mangata {
    if (!Mangata.instance) {
      Mangata.instance = new Mangata(uri);
    }

    return Mangata.instance;
  }

  /**
   * Retrieve the chain name
   */

  public async getChain(): Promise<Text> {
    const api = await this.connect();
    const chain = await api.rpc.system.chain();
    return chain;
  }

  /**
   * Retrieve the node name
   */

  public async getNodeName(): Promise<Text> {
    const api = await this.connect();
    const name = await api.rpc.system.name();
    return name;
  }

  /**
   * Retrieve the node version
   */

  public async getNodeVersion(): Promise<Text> {
    const api = await this.connect();
    const version = await api.rpc.system.version();
    return version;
  }
}
