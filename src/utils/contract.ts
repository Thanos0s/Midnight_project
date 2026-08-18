// Contract helper utilities for Midnight Private Bid Auction DApp
import { toHex, fromHex } from '@midnight-ntwrk/midnight-js-utils';

/**
 * Format address helper (adds ellipsis for UI rendering)
 */
export function formatAddress(address: string | null): string {
  if (!address) return '';
  if (address.length <= 16) return address;
  return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
}

/**
 * Convert string payload to 32-byte Uint8Array for contract parameters
 */
export function stringToBytes32(text: string): Uint8Array {
  const bytes = new Uint8Array(32);
  const encoded = new TextEncoder().encode(text.substring(0, 32));
  bytes.set(encoded);
  return bytes;
}

/**
 * Convert bytes to hex string utility
 */
export function bytesToHex(bytes: Uint8Array): string {
  return toHex(bytes);
}

/**
 * Convert hex string back to bytes utility
 */
export function hexToBytes(hex: string): Uint8Array {
  return fromHex(hex);
}
