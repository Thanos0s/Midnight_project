import { useState, useCallback, useEffect } from 'react';

// ── Preprod Network Endpoints ──
const PREPROD_CONFIG = {
  indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
  indexerWS: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
  node: 'https://rpc.preprod.midnight.network',
  proofServer: 'http://localhost:6300',
  contractAddress: 'b20f8f836047ce33353b13e1e85d8dc95a55f306e876cb7b822bbaad4bb1acf6',
};

// ── Types ──
interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  unshieldedAddress: string | null;
  shieldedAddress: string | null;
  walletName: string | null;
  error: string | null;
  contract: any | null;
}

// ── Browser-native ZkConfigProvider ──
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

  async getVerifierKeys(circuitIds: string[]): Promise<[string, any][]> {
    return Promise.all(circuitIds.map(async (id): Promise<[string, any]> => [id, await this.getVerifierKey(id)]));
  }

  async get(circuitId: string) {
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

// ── Browser Private State Provider (localStorage) ──
const browserPrivateStateProvider = {
  get: async (key: string) => {
    const val = localStorage.getItem(`midnight_state_${key}`);
    return val ? JSON.parse(val) : null;
  },
  set: async (key: string, val: any) => {
    localStorage.setItem(`midnight_state_${key}`, JSON.stringify(val));
  },
  delete: async (key: string) => {
    localStorage.removeItem(`midnight_state_${key}`);
  },
};

// ── Hook ──
export const useMidnight = () => {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    unshieldedAddress: null,
    shieldedAddress: null,
    walletName: null,
    error: null,
    contract: null,
  });

  // Detect available Midnight wallets
  const detectWallets = useCallback((): { id: string; name: string; icon: string }[] => {
    const midnightObj = (window as any).midnight;
    if (!midnightObj) return [];

    const wallets: { id: string; name: string; icon: string }[] = [];
    for (const key of Object.keys(midnightObj)) {
      const entry = midnightObj[key];
      if (entry && typeof entry === 'object' && typeof entry.connect === 'function') {
        wallets.push({
          id: key,
          name: entry.name || key,
          icon: entry.icon || '',
        });
      }
    }
    return wallets;
  }, []);

  // Setup connection with a connected wallet API
  const setupConnection = useCallback(async (api: any, walletName: string) => {
    try {
      const { unshieldedAddress: uAddr } = await api.getUnshieldedAddress();
      const { shieldedAddress: sAddr } = await api.getShieldedAddresses();

      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        unshieldedAddress: uAddr,
        shieldedAddress: sAddr,
        walletName,
        error: null,
      }));

      localStorage.setItem('midnight_wallet_connected', 'true');
      localStorage.setItem('midnight_wallet_id', walletName);

      // Lazy-load contract SDK modules only when needed
      try {
        const [{ CompiledContract }, { findDeployedContract }, { indexerPublicDataProvider }, { httpClientProofProvider }, HelloWorld] = await Promise.all([
          import('@midnight-ntwrk/compact-js'),
          import('@midnight-ntwrk/midnight-js-contracts'),
          import('@midnight-ntwrk/midnight-js-indexer-public-data-provider'),
          import('@midnight-ntwrk/midnight-js-http-client-proof-provider'),
          import('../../managed/contract/index.js'),
        ]);

        const zkConfigProvider = new BrowserZkConfigProvider();
        const publicDataProvider = indexerPublicDataProvider(PREPROD_CONFIG.indexer, PREPROD_CONFIG.indexerWS);

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

        const compiledContract = CompiledContract.make('hello-world', HelloWorld.Contract).pipe(
          CompiledContract.withWitnesses({
            myBidAmount: (context: any) => [context.privateState, context.privateState.bidAmount],
          }),
          CompiledContract.withCompiledFileAssets('/managed')
        );

        const instance = await findDeployedContract(providers as any, {
          compiledContract: compiledContract as any,
          contractAddress: PREPROD_CONFIG.contractAddress,
          privateStateId: 'hello-world-state',
        });

        setState(prev => ({ ...prev, contract: instance }));
      } catch (contractErr: any) {
        console.warn('Contract binding skipped:', contractErr.message);
        // Wallet is still connected, contract binding is separate
      }
    } catch (e: any) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: e.message || 'Failed to read wallet addresses',
      }));
    }
  }, []);

  // Auto-reconnect on page load
  useEffect(() => {
    const tryReconnect = async () => {
      const wasConnected = localStorage.getItem('midnight_wallet_connected') === 'true';
      const walletId = localStorage.getItem('midnight_wallet_id');
      if (!wasConnected || !walletId) return;

      const midnightObj = (window as any).midnight;
      const walletEntry = midnightObj?.[walletId];
      if (!walletEntry || typeof walletEntry.connect !== 'function') return;

      try {
        const api = await walletEntry.connect('preprod');
        await setupConnection(api, walletId);
      } catch {
        localStorage.removeItem('midnight_wallet_connected');
        localStorage.removeItem('midnight_wallet_id');
      }
    };

    // Wait a bit for wallet extensions to inject
    const timer = setTimeout(tryReconnect, 800);
    return () => clearTimeout(timer);
  }, [setupConnection]);

  // Connect to a specific wallet
  const connectWallet = useCallback(async (walletId?: string) => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const midnightObj = (window as any).midnight;
      if (!midnightObj) {
        throw new Error('No Midnight wallet detected. Please install the 1AM wallet extension.');
      }

      // Default to 1AM, or find the first available wallet
      const targetId = walletId || '1AM';
      const walletEntry = midnightObj[targetId];

      if (!walletEntry || typeof walletEntry.connect !== 'function') {
        // Try to find any available wallet
        const available = Object.keys(midnightObj).find(
          k => midnightObj[k] && typeof midnightObj[k].connect === 'function'
        );
        if (!available) {
          throw new Error('No compatible Midnight wallet found. Install the 1AM wallet extension.');
        }
        const api = await midnightObj[available].connect('preprod');
        await setupConnection(api, available);
        return;
      }

      const api = await walletEntry.connect('preprod');
      await setupConnection(api, targetId);
    } catch (e: any) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: e.message || 'Wallet connection failed',
      }));
      localStorage.removeItem('midnight_wallet_connected');
      localStorage.removeItem('midnight_wallet_id');
    }
  }, [setupConnection]);

  // Disconnect
  const disconnectWallet = useCallback(async () => {
    setState({
      isConnected: false,
      isConnecting: false,
      unshieldedAddress: null,
      shieldedAddress: null,
      walletName: null,
      error: null,
      contract: null,
    });
    localStorage.removeItem('midnight_wallet_connected');
    localStorage.removeItem('midnight_wallet_id');
  }, []);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    detectWallets,
    preprodConfig: PREPROD_CONFIG,
  };
};
