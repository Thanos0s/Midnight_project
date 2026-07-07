
// test.js


console.log("Starting Auction Test...");


const user1 = "0x123";
const user2 = "0x456";


const bid1 = 100;
const bid2 = 200;

let highestBid = 0;
let winner = null;

// simulate bidding
function submitBid(user, bid) {
    console.log(`${user} is bidding ${bid}`);

    if (bid > highestBid) {
        highestBid = bid;
        winner = user;
    }
}

// simulate auction
submitBid(user1, bid1);
submitBid(user2, bid2);

console.log("Auction closed");
console.log("Winner:", winner);
console.log("Highest Bid:", highestBid);
=======
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  createCircuitContext,
  createConstructorContext,
  decodeCoinPublicKey,
  dummyContractAddress,
} from '@midnight-ntwrk/compact-runtime';

import * as contractCode from './managed/contract/index.js';
import { makePrivateState, witnesses } from './witnesses.js';

const coinPublicKey = decodeCoinPublicKey(new Uint8Array(32).fill(7));
const taskId = Uint8Array.from({ length: 32 }, (_, index) => index);
const secretKey = Uint8Array.from({ length: 32 }, (_, index) => index + 1);
const bidAmount = 500n;
const finalPrice = 450n;

function startContract() {
  const contract = new contractCode.Contract(witnesses);
  const startContext = createConstructorContext(
    makePrivateState(secretKey, bidAmount),
    coinPublicKey,
  );
  const state = contract.initialState(startContext, taskId);
  return { contract, state };
}

function callContext(contractState) {
  return createCircuitContext(
    dummyContractAddress(),
    coinPublicKey,
    contractState,
    makePrivateState(secretKey, bidAmount),
  );
}

test('a bid can be submitted while the auction is open', async () => {
  const { contract, state } = startContract();
  const context = callContext(state.currentContractState);

  const result = await contract.circuits.submitBid(context);
  const ledger = contractCode.ledger(result.context.currentQueryContext.state);

  assert.equal(ledger.state, contractCode.AuctionState.OPEN);
  assert.equal(ledger.bidCount, 1n);
});

test('winner and price are public after closing', async () => {
  const { contract, state } = startContract();
  const afterBid = await contract.circuits.submitBid(callContext(state.currentContractState));

  const afterClose = await contract.circuits.closeAuction(
    afterBid.context,
    secretKey,
    finalPrice,
  );
  const ledger = contractCode.ledger(afterClose.context.currentQueryContext.state);

  assert.equal(ledger.state, contractCode.AuctionState.CLOSED);
  assert.equal(ledger.winner.is_some, true);
  assert.deepEqual(ledger.winner.value, contractCode.pureCircuits.agentPublicKey(secretKey));
  assert.equal(ledger.winningPrice.is_some, true);
  assert.equal(ledger.winningPrice.value, finalPrice);
});

test('bid amount is not saved as public data', async () => {
  const { contract, state } = startContract();
  const afterBid = await contract.circuits.submitBid(callContext(state.currentContractState));
  const afterClose = await contract.circuits.closeAuction(
    afterBid.context,
    secretKey,
    finalPrice,
  );
  const ledger = contractCode.ledger(afterClose.context.currentQueryContext.state);

  assert.ok(!Object.values(ledger).includes(bidAmount));
});
>>>>>>> d9d9bcf (updated new changes and fixes)
