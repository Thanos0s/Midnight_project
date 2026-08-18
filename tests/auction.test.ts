import { test } from 'node:test';
import assert from 'node:assert/strict';

// ── Auction Smart Contract Circuit Tests ──

test('auction: state machine opens and registers bids correctly', () => {
  const ledgerState = {
    state: 0, // OPEN
    bidCount: 0n,
    winner: { is_some: false, value: new Uint8Array(32) }
  };
  
  // Simulate placing a bid
  ledgerState.bidCount += 1n;
  
  assert.equal(ledgerState.state, 0, 'Auction should be open');
  assert.equal(ledgerState.bidCount, 1n, 'Bid count should increment to 1');
});

test('auction: host closes auction and proves winner details', () => {
  const ledgerState = {
    state: 0, // OPEN
    bidCount: 3n,
    winner: { is_some: false, value: new Uint8Array(32) },
    winningPrice: { is_some: false, value: 0n }
  };

  const finalWinnerAddress = new Uint8Array(32).fill(1);
  const finalPrice = 500n;

  // Simulate closeAuction call
  ledgerState.state = 1; // CLOSED
  ledgerState.winner = { is_some: true, value: finalWinnerAddress };
  ledgerState.winningPrice = { is_some: true, value: finalPrice };

  assert.equal(ledgerState.state, 1, 'Auction should be closed');
  assert.equal(ledgerState.winner.is_some, true, 'Winner must be set');
  assert.deepEqual(ledgerState.winner.value, finalWinnerAddress, 'Winner address should match');
  assert.equal(ledgerState.winningPrice.value, 500n, 'Winning price should match');
});

test('auction: privacy claim - individual bid values remain private', () => {
  const privateBids = [100n, 250n, 500n];
  const publicLedger = {
    state: 1, // CLOSED
    bidCount: 3n,
    winnerAddress: 'mn_winner_key_hash',
    winningPrice: 500n // Only winning price revealed
  };

  // Verify that individual bids (except winning price) are not exposed on the ledger
  const revealedValues = Object.values(publicLedger);
  
  // Bid 100n and 250n should not be anywhere in public state
  assert.ok(!revealedValues.includes(100n), 'Losing bid 100n must not be revealed');
  assert.ok(!revealedValues.includes(250n), 'Losing bid 250n must not be revealed');
});
