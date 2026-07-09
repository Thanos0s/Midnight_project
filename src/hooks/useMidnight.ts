import { useState, useCallback, useEffect } from 'react';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import type { WalletConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import * as HelloWorld from '../../managed/contract/index.js';

// Preprod Network Configurations
const PREPROD_CONFIG = {
  indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
  indexerWS: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
  node: 'https://rpc.preprod.midnight.network',
  proofServer: 'http://localhost:6300', // Falls back to local proof-server running on user machine
  contractAddress: 'b20f8f836047ce33353b13e1e85d8dc95a55f306e876cb7b822bbaad4bb1acf6',
};

// 1. Browser-native ZkConfigProvider that fetches static assets served by Vite/host
class BrowserZkConfigProvider {
  async getZKIR(circuitId: string): Promise<any> {
    const res = await fetch(`/managed/zkir/${circuitId}.zkir`);
    if (!res.ok) throw new Error(`Failed to fetch ZKIR for ${circuitId}`);
    return new Uint8Array(await res.arrayBuffer());
  }

  async getProverKey(circuitId: string): Promise<any> {
    const res = await fetch(`/managed/keys/${circuitId}.prover`);
    if (!res.ok) throw new Error(`Failed to fetch prover key for ${circuitId}`);
    return new Uint8Array(await res.arrayBuffer());
  }

  async getVerifierKey(circuitId: string): Promise<any> {
    const res = await fetch(`/managed/keys/${circuitId}.verifier`);
    if (!res.ok) throw new Error(`Failed to fetch verifier key for ${circuitId}`);
    return new Uint8Array(await res.arrayBuffer());
  }

  async getVerifierKeys(circuitIds: string[]): Promise<any> {
    return Promise.all(
      circuitIds.map(async (id) => [id, await this.getVerifierKey(id)])
    );
  }

  async get(circuitId: string): Promise<any> {
    return {
      circuitId,
      zkir: await this.getZKIR(circuitId),
      proverKey: await this.getProverKey(circuitId),
      verifierKey: await this.getVerifierKey(circuitId),
    };
  }

  asKeyMaterialProvider() {
    return {
      getZKIR: (id: string) => this.getZKIR(id),
      getProverKey: (id: string) => this.getProverKey(id),
      getVerifierKey: (id: string) => this.getVerifierKey(id),
    };
  }
}

// 2. Browser-native PrivateStateProvider backed by LocalStorage to prevent native LevelDB compilation errors
const browserPrivateStateProvider = {
  get: async (key: string): Promise<any> => {
    const val = localStorage.getItem(`midnight_state_${key}`);
    return val ? JSON.parse(val) : null;
  },
  set: async (key: string, val: any): Promise<void> => {
    localStorage.setItem(`midnight_state_${key}`, JSON.stringify(val));
  },
  delete: async (key: string): Promise<void> => {
    localStorage.removeItem(`midnight_state_${key}`);
  },
};

export const useMidnight = () => {
  const [wallet, setWallet] = useState<WalletConnectedAPI | null>(null);
  const [unshieldedAddress, setUnshieldedAddress] = useState<string | null>(null);
  const [shieldedAddress, setShieldedAddress] = useState<string | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet was previously connected
  useEffect(() => {
    const autoConnect = async () => {
      const previouslyConnected = localStorage.getItem('midnight_lace_connected') === 'true';
      const laceWallet = (window as any).midnight?.mnLace;
      if (previouslyConnected && laceWallet) {
        try {
          const api = await laceWallet.enable();
          await setupConnection(api);
        } catch (e) {
          localStorage.removeItem('midnight_lace_connected');
        }
      }
    };
    autoConnect();
  }, []);

  const setupConnection = async (api: WalletConnectedAPI) => {
    try {
      const { unshieldedAddress: uAddr } = await api.getUnshieldedAddress();
      const { shieldedAddress: sAddr } = await api.getShieldedAddresses();
      
      setUnshieldedAddress(uAddr);
      setShieldedAddress(sAddr);
      setWallet(api);
      localStorage.setItem('midnight_lace_connected', 'true');

      // Setup providers
      const zkConfigProvider = new BrowserZkConfigProvider();
      const publicDataProvider = indexerPublicDataProvider(
        PREPROD_CONFIG.indexer,
        PREPROD_CONFIG.indexerWS
      );

      // Try to get proof provider from Lace; fallback to localhost HTTP proof provider
      const proofProvider = api.getProvingProvider 
        ? await api.getProvingProvider(zkConfigProvider.asKeyMaterialProvider()) 
        : httpClientProofProvider(PREPROD_CONFIG.proofServer, zkConfigProvider);

      const providers = {
        privateStateProvider: browserPrivateStateProvider,
        publicDataProvider,
        zkConfigProvider,
        proofProvider,
        walletProvider: api,
        midnightProvider: api,
      };

      // Wrap compiled contract with witness functions
      const compiledContract = CompiledContract.make('hello-world', HelloWorld.Contract).pipe(
        CompiledContract.withWitnesses({
          myBidAmount: (context: any) => {
            return [context.privateState, context.privateState.bidAmount];
          },
        }),
        CompiledContract.withCompiledFileAssets('/managed')
      );

      // Locate on-chain contract
      const instance = await findDeployedContract(providers as any, {
        compiledContract: compiledContract as any,
        contractAddress: PREPROD_CONFIG.contractAddress,
        privateStateId: 'hello-world-state',
      });

      setContract(instance);
      setError(null);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to initialize connection and contract');
    }
  };

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const laceWallet = (window as any).midnight?.mnLace;
      if (!laceWallet) {
        throw new Error('Lace Beta Wallet extension is not installed. Please install it.');
      }
      const api = await laceWallet.enable();
      await setupConnection(api);
    } catch (e: any) {
      setError(e.message || 'Lace wallet connection failed');
      localStorage.removeItem('midnight_lace_connected');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    const laceWallet = (window as any).midnight?.mnLace;
    if (laceWallet && laceWallet.disconnect) {
      try {
        await laceWallet.disconnect();
      } catch (e) {}
    }
    setWallet(null);
    setUnshieldedAddress(null);
    setShieldedAddress(null);
    setContract(null);
    localStorage.removeItem('midnight_lace_connected');
  }, []);

  return {
    wallet,
    unshieldedAddress,
    shieldedAddress,
    contract,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isConnected: !!wallet,
  };
};
