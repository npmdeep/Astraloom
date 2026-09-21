import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { createUnprovenCallTx, createUnprovenDeployTx, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { Contract, ledger, pureCircuits, type Witnesses } from '../managed/contract/index.js';
import { getNetwork, setContractAddress, validateContractAddress, type Network } from '../config.js';
import { fromHex, toHex, type ConnectedSession } from './midnight.js';

export const PRIVACY_NOTE = 'The signal is self-attested, not issuer-verified. Witnesses are not written to public ledger state; a wallet or proving service may still process them. Reusing a marker secret and constellation makes the public marker linkable.';
export const randomHex = () => toHex(crypto.getRandomValues(new Uint8Array(32)));
export function secretBytes(secret: string): Uint8Array { const bytes = fromHex(secret.trim()); if (bytes.length !== 32 || !bytes.some(Boolean)) throw new Error('Enter a nonzero 32-byte hexadecimal secret.'); return bytes; }
export function compiledAstraloom(inputs: { signal?: bigint; markerSecret?: Uint8Array; operatorSecret?: Uint8Array } = {}) {
  const witnesses: Witnesses<undefined> = {
    private_signal: () => { if (inputs.signal === undefined) throw new Error('Private signal missing.'); return [undefined, inputs.signal]; },
    private_marker_secret: () => { if (inputs.markerSecret?.length !== 32) throw new Error('Private marker secret missing.'); return [undefined, inputs.markerSecret]; },
    operator_secret: () => { if (inputs.operatorSecret?.length !== 32) throw new Error('Operator secret missing.'); return [undefined, inputs.operatorSecret]; },
  };
  return CompiledContract.make('AstraloomContract', Contract<undefined>).pipe(CompiledContract.withWitnesses(witnesses), CompiledContract.withCompiledFileAssets(new URL('/managed', window.location.origin).toString()));
}
export type LoomParameters = { threshold: string; constellation: string; deadline: string; curator: string; capacity: string };
export function loomArguments(value: LoomParameters): [bigint, Uint8Array, bigint, Uint8Array, bigint] {
  if (!/^\d+$/.test(value.threshold) || !/^\d+$/.test(value.capacity)) throw new Error('Threshold and capacity must be whole numbers.');
  const threshold = BigInt(value.threshold), capacity = BigInt(value.capacity); if (threshold > 100n) throw new Error('Threshold must be from 0 to 100.');
  if (capacity < 1n || capacity > 4_294_967_295n) throw new Error('Capacity must be from 1 to 4,294,967,295.');
  const seconds = Math.floor(new Date(value.deadline).getTime() / 1000); if (!Number.isFinite(seconds) || seconds <= Date.now() / 1000 + 120) throw new Error('Choose a closing time more than two minutes in the future.');
  return [threshold, secretBytes(value.constellation), BigInt(seconds), secretBytes(value.curator), capacity];
}
export type DeploymentRecord = { network: Network; address: string; txId?: string; status: 'submitting' | 'pending' | 'confirmed' | 'unknown'; submittedAt: number };
const recordKey = (network: Network) => `ASTRALOOM_DEPLOYMENT_V1:${network}`;
export function getDeployment(network = getNetwork()): DeploymentRecord | null { try { const value = JSON.parse(localStorage.getItem(recordKey(network)) || 'null'); if (!value || value.network !== network || !['submitting', 'pending', 'confirmed', 'unknown'].includes(value.status)) return null; validateContractAddress(value.address); return value; } catch { return null; } }
export function saveDeployment(record: DeploymentRecord) { localStorage.setItem(recordKey(record.network), JSON.stringify(record)); if (record.status === 'pending' || record.status === 'confirmed') setContractAddress(record.address, record.network); }
export function clearDeployment(network = getNetwork()) { localStorage.removeItem(recordKey(network)); }
export async function readAstraloom(session: ConnectedSession, address: string) { session.assertActive(); const raw = await session.providers.publicDataProvider.queryContractState(validateContractAddress(address)); if (!raw) return null; const state = ledger(raw.data); if (new TextDecoder().decode(state.edition).replace(/\0/g, '') !== 'Astraloom:v1.0') throw new Error('Address is not an Astraloom contract.'); return state; }
export async function deployAstraloom(session: ConnectedSession, parameters: LoomParameters, operatorSecret: string, maintenanceKey: string, onUpdate: (record: DeploymentRecord) => void) {
  session.assertActive(); const network = session.config.networkId as Network; if (getDeployment(network)) throw new Error('A deployment is already recorded on this network. Archive it before deploying another.');
  const [threshold, constellation, deadline, curator, capacity] = loomArguments(parameters); const data = await createUnprovenDeployTx(session.providers, { compiledContract: compiledAstraloom(), args: [threshold, constellation, deadline, curator, pureCircuits.operator_public_key(secretBytes(operatorSecret)), capacity], signingKey: maintenanceKey });
  let record: DeploymentRecord = { address: data.public.contractAddress, network, status: 'submitting', submittedAt: Date.now() }; saveDeployment(record); onUpdate(record);
  try { const txId = await submitTxAsync(session.providers, { unprovenTx: data.private.unprovenTx }); record = { ...record, txId, status: 'pending' }; saveDeployment(record); onUpdate(record); return record; }
  catch (error) { record = { ...record, status: 'unknown' }; saveDeployment(record); onUpdate(record); throw error; }
}
export async function confirmDeployment(session: ConnectedSession, record: DeploymentRecord) { if (record.network !== session.config.networkId) throw new Error('Reconnect on the deployment network.'); const state = await readAstraloom(session, record.address); if (!state) return null; const confirmed = { ...record, status: 'confirmed' as const }; saveDeployment(confirmed); return confirmed; }
export async function operatorAction(session: ConnectedSession, address: string, secret: string, action: 'pause_loom' | 'resume_loom' | 'retune_loom', parameters?: LoomParameters) {
  session.assertActive(); const bytes = secretBytes(secret); const state = await readAstraloom(session, address); if (!state) throw new Error('Contract is not indexed yet.');
  if (toHex(state.operator_commitment) !== toHex(pureCircuits.operator_public_key(bytes))) throw new Error('This recovery secret does not match the on-chain operator commitment.');
  const compiledContract = compiledAstraloom({ operatorSecret: bytes });
  try { const data = action === 'retune_loom' ? await createUnprovenCallTx(session.providers, { compiledContract, contractAddress: address, circuitId: action, args: loomArguments(parameters!) }) : await createUnprovenCallTx(session.providers, { compiledContract, contractAddress: address, circuitId: action }); return await submitTxAsync(session.providers, { unprovenTx: data.private.unprovenTx, circuitId: action }); }
  finally { bytes.fill(0); }
}
