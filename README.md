# Midnight Private Bid Auction DApp
> A privacy-preserving sealed-bid auction decentralized application on the Midnight Network.

## Live Demo
[PASTE YOUR LIVE DEMO URL HERE AFTER DEPLOYING FRONTEND]

## Contract Address
| Network  | Address                          |
|----------|----------------------------------|
| Preprod  | b20f8f836047ce33353b13e1e85d8dc95a55f306e876cb7b822bbaad4bb1acf6  |

## What This Does
This decentralized application (DApp) implements a sealed-bid auction. Bidders submit their bids secretly. The application leverages zero-knowledge cryptography so that bid values remain completely private during the bidding phase. When the auction host closes the auction, the winner's public key identity and the final winning price are proven and disclosed on-chain, settling the auction securely and fairly.

## Privacy Model
*   **What is PUBLIC:** 
    *   The total number of bids submitted during the auction.
    *   The auction status (`OPEN` or `CLOSED`).
    *   The public key identity of the winner (once closed).
    *   The final winning price (once closed).
*   **What is PRIVATE:**
    *   Individual bid amounts submitted by each bidder.
    *   The secret keys of the bidders.
*   **What the user PROVES without revealing:**
    *   The bidder proves that their bid is valid and successfully registers it in the local state, without revealing the actual numeric value of the bid to the network or other participants.

## Privacy Claim
An on-chain observer watching the ledger during the auction phase can only see that transactions are occurring and the bid count is incrementing. The observer cannot see how much was bid or who bid what amount. Once closed, the observer can see the winning price and the winner's derived public key, but the individual losing bids and the secret keys used to derive the identities remain completely private and unrevealed.

## Tech Stack
*   **Blockchain Network:** Midnight Network (Preprod)
*   **Smart Contract Language:** Compact
*   **SDK:** Midnight.js SDK
*   **Wallet Connector:** Lace Wallet (DApp connector API)
*   **Frontend:** React, Vite, TypeScript

## Prerequisites
*   **Lace Beta Wallet** extension installed in browser
*   Lace wallet connected to **Midnight Preprod** network and funded with test tokens (tNIGHT)
*   **Node.js** v22 and **Yarn** / **npm**

## Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Thanos0s/Midnight_project.git
   cd Midnight_project
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Compile the contract (optional):**
   ```bash
   yarn run compile
   ```

4. **Start the development server:**
   ```bash
   yarn run dev
   ```
   Open `http://localhost:3000` in your web browser.

## Demo Video
[PLACEHOLDER — I will add the link after recording]
