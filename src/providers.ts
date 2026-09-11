import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import type { AstraloomPrivateState } from '../contracts/index.js';

export type AstraloomCircuit = 'weave_signal' | 'retune_loom' | 'pause_loom' | 'resume_loom';
export type AstraloomProviders = MidnightProviders<AstraloomCircuit, string, AstraloomPrivateState>;

export function createAstraloomProviders(config: { networkId: any; indexerUri: string; indexerWsUri: string; proofServerUrl: string; zkConfigPath: string; walletProvider: any; midnightProvider: any }): AstraloomProviders {
  const zkConfigProvider = new NodeZkConfigProvider<AstraloomCircuit>(config.zkConfigPath);
  return {
    privateStateProvider: levelPrivateStateProvider<string, AstraloomPrivateState>({ midnightDbName: `astraloom-private-state-${config.networkId}`, privateStateStoreName: 'private-states', signingKeyStoreName: 'signing-keys', privateStoragePasswordProvider: async () => 'astraloom-local-development-password-2026', accountId: String(config.walletProvider?.getCoinPublicKey?.() ?? 'local') }),
    publicDataProvider: indexerPublicDataProvider(config.indexerUri, config.indexerWsUri),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(config.proofServerUrl, zkConfigProvider),
    walletProvider: config.walletProvider,
    midnightProvider: config.midnightProvider,
  } as AstraloomProviders;
}
