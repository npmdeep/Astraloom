import { describe, expect, it } from 'vitest';
import { pureCircuits } from '../../contracts/managed/astraloom/contract/index.js';
import { CompiledAstraloomContract, witnesses } from '../../contracts/index.js';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
const bytes = (n: number) => new Uint8Array(32).fill(n);
describe('Astraloom domains and witness installation', () => {
  it('derives deterministic marker receipts', () => { const first = pureCircuits.make_signal_marker(bytes(1), bytes(2)); expect(first).toHaveLength(32); expect(first).toEqual(pureCircuits.make_signal_marker(bytes(1), bytes(2))); });
  it('changes when the constellation changes', () => { expect(pureCircuits.make_signal_marker(bytes(1), bytes(2))).not.toEqual(pureCircuits.make_signal_marker(bytes(1), bytes(3))); });
  it('separates operator and marker domains', () => { expect(pureCircuits.operator_public_key(bytes(1))).not.toEqual(pureCircuits.make_signal_marker(bytes(1), bytes(2))); });
  it('configures actual witnesses', () => { expect(CompiledAstraloomContract.tag).toBe('AstraloomContract'); expect(CompiledContract.getCompiledAssetsPath(CompiledAstraloomContract)).toMatch(/managed[\\/]astraloom$/); const privateState = { signal: 85n, markerSecret: bytes(1), operatorSecret: bytes(9) }; const ctx = { privateState, ledger: {} as never, contractAddress: '00'.repeat(32) }; expect(witnesses.private_signal(ctx)).toEqual([privateState, 85n]); expect(witnesses.private_marker_secret(ctx)).toEqual([privateState, bytes(1)]); expect(witnesses.operator_secret(ctx)).toEqual([privateState, bytes(9)]); });
  it('fails closed for missing witness material', () => { const ctx = { privateState: {}, ledger: {} as never, contractAddress: '00'.repeat(32) }; expect(() => witnesses.private_signal(ctx)).toThrow(/Missing/); expect(() => witnesses.private_marker_secret(ctx)).toThrow(/Missing/); expect(() => witnesses.operator_secret(ctx)).toThrow(/Missing/); });
});
