# Midnight Private Bid Auction DApp
![CI](https://github.com/Thanos0s/Midnight_project/actions/workflows/ci.yml/badge.svg)

> Zero-knowledge sealed-bid auctions on the Midnight Network. Your bid, your secret.

## Live Demo
https://midnight-project-ten.vercel.app/


## Vidoe Link
https://drive.google.com/file/d/15I5xga2-4JeQ2upDpuIINJxlM3jP5YFh/view?usp=sharing

## Contract Address
| Network  | Address                          |
|----------|----------------------------------|
| Preprod  | `42bb41cdbf156cccef4b9800c0c7818b1dab80655156564ebc5a18be7495c4d3` |
| Preview  | `2386353dac0e0fcb93203eee32cb1e8f14e04b924d84b41b9e8d3e8c99893a6a` |

- **Preprod Indexer Verified:** Query via `https://indexer.preprod.midnight.network/api/v4/graphql`
- **Preview Explorer Link:** https://preview.midnightexplorer.com/contracts/0x2386353dac0e0fcb93203eee32cb1e8f14e04b924d84b41b9e8d3e8c99893a6a

## What This Does
A sealed-bid auction where bidders submit bids secretly using zero-knowledge proofs. Bid values remain completely private during the bidding phase. When the auction host closes the auction, the winner's public key identity and the final winning price are proven and disclosed on-chain.

## Privacy Model
- **PUBLIC:** Number of bids, active auction status, winning bidder's derived public key, and the final winning price (after close).
- **PRIVATE:** Individual bid amounts and secret keys of bidders.
- **PROVED without revealing:** The validity of bids (that bid value satisfies min-bid and bidder possesses valid secret key) without revealing the numeric value.

### What an Observer Can Learn
*   The total count of bids placed in the auction.
*   The status of the auction (e.g., OPEN or CLOSED).
*   The derived public key of the winning bidder *only after* the auction has been closed by the host.
*   The final winning price *only after* the auction has been closed by the host.

### What an Observer Cannot Learn
*   The numeric bid values of individual bids during or after the auction (losing bid amounts are never revealed).
*   The identity or public/private keys of losing bidders.
*   The secret keys of any bidder (including the winner's secret key).

## Privacy Claim
An on-chain observer during the active auction phase can only see transactions occurring and the bid count incrementing. They cannot see how much was bid or who bid what amount. Once closed, only the winning price and the winner's derived public key are revealed — individual losing bids and secret keys remain completely private.

## Tech Stack
- **Network:** Midnight Preprod
- **Contract:** Compact compiler v0.16.0
- **SDK:** Midnight.js v4.0.4
- **Wallet:** 1AM Wallet / 1am-preview (DApp Connector API v4)
- **Frontend:** React + Vite + TypeScript
- **Animations:** Framer Motion

## Prerequisites
- [1AM Wallet](https://1am.io) browser extension installed and configured for Midnight Preprod or Preview.
- Node.js v22+ and npm.

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
4. Compile the contract:
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
Our CI/CD pipeline runs automatically on GitHub Actions upon pushing to the `main` branch or opening a pull request.
It checks out the codebase, sets up Node.js v22, installs dependencies, compiles the Compact contract, and runs our test suite containing 3 passing test suites verifying circuit logic, state transitions, and privacy.

## Product proposal
Please Visit PROPOSAL.md
https://github.com/Thanos0s/Midnight_project/blob/main/PROPOSAL.md







