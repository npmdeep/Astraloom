import { pureCircuits } from '../managed/contract/index.js';
import { fromHex, toHex } from './midnight';

const MEMORY_KEY = 'ASTRALOOM_VISITOR_MEMORY';
export function hasUsedMarker(secret: string, state: any): boolean {
  if (!state || !/^[0-9a-f]{64}$/i.test(secret)) return false;
  const marker = toHex(pureCircuits.make_signal_marker(fromHex(secret), state.constellation_id));
  for (const item of state.spent_markers ?? []) if (toHex(item) === marker) return true;
  return false;
}
export function forgetVisitorMemory() { try { sessionStorage.removeItem(MEMORY_KEY); } catch { /* storage can be unavailable */ } }
export const clearIdentity = forgetVisitorMemory;
