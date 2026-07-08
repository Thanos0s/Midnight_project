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

## Project Structure vs Deployment Folder

- **`project/` (This folder)**: The main smart contract development folder. It is where you write contract code (`auction.compact`), define witnesses (`witnesses.js`), and run unit tests (`test.js`).
- **`auction-deploy/` (Sibling folder)**: The deployment infrastructure. It contains Docker Compose configurations to run a local Midnight network (node, indexer, proof-server) and the TypeScript code to compile, fund, and deploy the contract.

## Deployed contract address

Network: local docker
Address: b20f8f836047ce33353b13e1e85d8dc95a55f306e876cb7b822bbaad4bb1acf6

