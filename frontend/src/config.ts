export type Network = 'preview' | 'preprod';
export const CONFIG_EVENT = 'astraloom:config';
const NETWORK_KEY = 'ASTRALOOM_NETWORK_V1';
const addressKey = (network: Network) => `ASTRALOOM_CONTRACT_V1:${network}`;
export const isNetwork = (value: unknown): value is Network => value === 'preview' || value === 'preprod';
export function getNetwork(): Network {
  const saved = typeof localStorage === 'undefined' ? null : localStorage.getItem(NETWORK_KEY);
  const configured = import.meta.env.VITE_NETWORK;
  return isNetwork(saved) ? saved : isNetwork(configured) ? configured : 'preview';
}
export function setNetwork(network: Network) {
  if (!isNetwork(network)) throw new Error('Select Preview or Preprod.');
  localStorage.setItem(NETWORK_KEY, network);
  window.dispatchEvent(new Event(CONFIG_EVENT));
}
export function getNetworkConfig(network = getNetwork()) {
  return { networkId: network, indexerUri: `https://indexer.${network}.midnight.network/api/v4/graphql`, indexerWsUri: `wss://indexer.${network}.midnight.network/api/v4/graphql/ws` };
}
export function validateContractAddress(address: string): string {
  const normalized = address.trim().replace(/^0x/, '').toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(normalized) || /^0+$/.test(normalized)) throw new Error('A contract address must be 64 hexadecimal characters.');
  return normalized;
}
export function getContractAddress(network = getNetwork()): string {
  const saved = typeof localStorage === 'undefined' ? '' : localStorage.getItem(addressKey(network)) || '';
  const buildNetwork = isNetwork(import.meta.env.VITE_NETWORK) ? import.meta.env.VITE_NETWORK : 'preview';
  const specific = network === 'preview' ? import.meta.env.VITE_PREVIEW_CONTRACT_ADDRESS : import.meta.env.VITE_PREPROD_CONTRACT_ADDRESS;
  const value = saved || specific || (network === buildNetwork ? import.meta.env.VITE_CONTRACT_ADDRESS : '') || '';
  if (!value) return '';
  try { return validateContractAddress(value); } catch { return ''; }
}
export function setContractAddress(address: string, network = getNetwork()) {
  if (address.trim()) localStorage.setItem(addressKey(network), validateContractAddress(address));
  else localStorage.removeItem(addressKey(network));
  window.dispatchEvent(new Event(CONFIG_EVENT));
}
export const getExplorerContractUrl = (address = getContractAddress(), network = getNetwork()) => address ? `https://${network}.midnightexplorer.com/contracts/${encodeURIComponent(address)}` : `https://${network}.midnightexplorer.com`;
export const getExplorerTxUrl = (txId: string, network = getNetwork()) => `https://explorer.1am.xyz/tx/${encodeURIComponent(txId)}?network=${network}`;
