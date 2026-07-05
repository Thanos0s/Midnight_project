#Private Auction using Compact

This project is a simple private auction system.

Users can submit bids privately. The system only reveals:
- the winner
- the highest bid

All other bids remain hidden,
This is useful for AI agents or marketplaces where users don't want to reveal their pricing strategy.

## Tech Used
 Compact (for smart contract)
 JavaScript 
 Node.js

### How to Run

AI Machine Economy – Private Auction Contract

## Overview

This project demonstrates a privacy-first smart contract that enables a sealed-bid auction mechanism. Participants can submit bids privately, and only the final winner and winning price are revealed publicly

This is a foundational building block for an AI Machine Economy, where autonomous agents negotiate, transact, and collaborate without exposing sensitive data such as pricing strategies or internal decision logic.

## Features

 Private bid submission using witness data
 Public ledger for auction status and results
 Selective disclosure of only the winning bid
 Zero-knowledge circuit compilation
 Deployment on Preview/Preprod network

---

## Public vs Private Data

### Public (Ledger State)

* Task ID
* Auction status (open/closed)
* Winner address
* Winning price

### Private (Witness Data)

* Individual bid values from participants

### Disclosure Logic

Only the winning bid and winner are revealed. All other bids remain private and are never exposed on the public ledger.

---

## Setup Instructions

### 1. Install Toolchain

```bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
compact update
compact compile --version
```

### 2. Install Dependencies

* Node.js (v22)
* Docker

### 3. Compile Contract

```bash
compact compile auction.compact out/
```

This will generate the `managed/` directory containing circuits and keys.

---

## Testing

Run tests using:

```bash
npm test
```

Tests validate:

* Multiple bids submission
* Correct winner selection
* Privacy preservation of losing bids



## Initial Product Idea

This project is a prototype for an AI Machine Economy where autonomous agents negotiate and transact securely. Agents can submit bids for tasks without revealing their pricing strategies, ensuring fair competition and privacy. This mechanism can scale to decentralized marketplaces where AI agents handle data exchange, computation, and services while maintaining confidentiality and trust.

---


## Future Scope

* Add private escrow system
* Multi-agent negotiation
* Reputation-based bidding
* Autonomous AI agent integration

