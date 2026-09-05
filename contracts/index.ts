import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Contract, type Witnesses } from './managed/astraloom/contract/index.js';
export { Contract, ledger, pureCircuits, type Ledger, type ImpureCircuits, type PureCircuits } from './managed/astraloom/contract/index.js';

export type AstraloomPrivateState = { signal?: bigint; markerSecret?: Uint8Array; operatorSecret?: Uint8Array };
export const witnesses: Witnesses<AstraloomPrivateState> = {
  private_signal: ({ privateState }) => {
    if (privateState.signal === undefined) throw new Error('Missing private signal');
    return [privateState, privateState.signal];
  },
  private_marker_secret: ({ privateState }) => {
    if (privateState.markerSecret?.length !== 32) throw new Error('Missing 32-byte private marker secret');
    return [privateState, privateState.markerSecret];
  },
  operator_secret: ({ privateState }) => {
    if (privateState.operatorSecret?.length !== 32) throw new Error('Missing 32-byte operator secret');
    return [privateState, privateState.operatorSecret];
  },
};
const currentDir = path.dirname(fileURLToPath(import.meta.url));
export const zkConfigPath = path.resolve(currentDir, 'managed', 'astraloom');
export const CompiledAstraloomContract = CompiledContract.make('AstraloomContract', Contract).pipe(
  CompiledContract.withWitnesses(witnesses),
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);
