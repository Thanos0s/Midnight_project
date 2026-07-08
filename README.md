# Private Bid Contract

This is a small Midnight Compact contract.

The idea is simple:
- people can submit bids
- bid values stay private
- the contract only stores how many bids were made
- when the auction is closed, it shows the winner and the final price

## Files

- `auction.compact` has the contract code
- `witnesses.js` gives the private bid value to the contract
- `test.js` checks that the contract works
- `managed/` is made by the Compact compiler

## Commands

Compile the contract:

```bash
compact compile auction.compact managed
```

Run the tests:

```bash
node --test test.js
```

## Notes

`ledger` is public data.

`witness` is private data.

`disclose()` makes a value public.

Contract Address: 3f7120a63f93a92fe4becf81f72859878d72da76ff1591d541c73bbb0a286dc7
