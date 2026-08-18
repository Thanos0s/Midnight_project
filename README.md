# Midnight Private Bid Auction DApp
![CI](https://github.com/Thanos0s/Midnight_project/actions/workflows/ci.yml/badge.svg)

> Zero-knowledge sealed-bid auctions on the Midnight Network. Your bid, your secret.

## Live Demo
https://midnight-project-ten.vercel.app/

## Contract Address
| Network  | Address                              |
|----------|--------------------------------------|
| Preprod  | `42bb41cdbf156cccef4b9800c0c7818b1dab80655156564ebc5a18be7495c4d3` |

## What This Product Does
Midnight Private Bid Auction DApp is a privacy-first sealed-bid auction platform. Bidders submit their bids secretly on-chain, with the bid amount secured locally using zero-knowledge proofs. Individual bid amounts and participant identities remain completely hidden during the bidding phase.

When the host closes the auction, the DApp automatically resolves the winning bidder and the winning price on-chain without ever exposing losing bids, preserving complete participant privacy.

## Privacy Model
- **PUBLIC (on-chain, anyone can see):**
  - Number of bids placed.
  - Current auction state (OPEN vs CLOSED).
  - Derived public key of the winning bidder (only after closing).
  - Final winning price (only after closing).
- **PRIVATE (private witness, never on-chain):**
  - Individual losing bid amounts.
  - Secret keys of bidders.
  - Participant identities.
- **PROVED without revealing:**
  - The validity of bids (that bid value satisfies min-bid and bidder possesses valid keys) without revealing the numeric value.

## Tech Stack
- **Network:** Midnight Preprod
- **Contract Language:** Compact compiler v0.16.0
- **SDK:** Midnight.js v4.0.4
- **Wallet:** 1AM Wallet / DApp Connector API v4
- **Frontend:** React + Vite + TypeScript

## Prerequisites
- [1AM Wallet](https://1am.io) browser extension installed and configured for Midnight Preprod.
- Node.js v22+ and npm.
- Docker (for local proof server).

## Setup & Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/Thanos0s/Midnight_project.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Midnight_project
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Compile the contracts:
   ```bash
   npm run compile
   ```
5. Run the local development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000/](http://localhost:3000/) in your browser.

## Run Tests
```bash
npm test
```

## CI/CD
Our CI/CD pipeline runs automatically on GitHub Actions upon pushing to the `main` branch or opening a pull request. It checks out the codebase, sets up Node.js v22, installs dependencies, compiles the Compact contract, and runs our test suite containing 9 passing tests verifying circuit logic, state transitions, and privacy.

## Usage Guide
See [docs/USAGE.md](docs/USAGE.md)

## Product X Profile
[PLACEHOLDER — I will add after creating the account]
