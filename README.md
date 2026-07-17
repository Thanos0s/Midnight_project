# Midnight Private Bid Auction DApp

> Zero-knowledge sealed-bid auctions on the Midnight Network. Your bid, your secret.

## Live Demo
https://midnight-project-ten.vercel.app/

## Contract Address

| Network  | Address |
|----------|---------|
| Preview  | [`2386353dac0e0fcb93203eee32cb1e8f14e04b924d84b41b9e8d3e8c99893a6a`](https://preview.midnightexplorer.com/contracts/2386353dac0e0fcb93203eee32cb1e8f14e04b924d84b41b9e8d3e8c99893a6a) |

##Used the preview network because the prepod network is having issue

## What This Does

A sealed-bid auction where bidders submit bids secretly using zero-knowledge proofs. Bid values remain completely private during the bidding phase. When the auction host closes the auction, the winner's public key identity and the final winning price are proven and disclosed on-chain.

## Privacy Model

| Category | What's Visible |
|----------|---------------|
| **PUBLIC** | Number of bids, auction status, winner identity (after close), winning price (after close) |
| **PRIVATE** | Individual bid amounts, bidder secret keys |
| **PROVEN** | Bid validity — without revealing the numeric value |

## Privacy Claim

An on-chain observer during the auction phase can only see transactions occurring and the bid count incrementing. They cannot see how much was bid or who bid what amount. Once closed, only the winning price and winner's derived public key are revealed — individual losing bids and secret keys remain completely private.

## Tech Stack

- **Network:** Midnight Preprod
- **Contract:** Compact
- **SDK:** Midnight.js
- **Wallet:** 1AM Wallet (DApp Connector API v4)
- **Frontend:** React + Vite + TypeScript
- **Animations:** Framer Motion

## Prerequisites

- [1AM Wallet](https://1am.io) browser extension on Midnight Preprod
- Node.js v22+ and Yarn

## Run Locally

```bash
git clone https://github.com/Thanos0s/Midnight_project.git
cd Midnight_project
yarn install
yarn dev
```

Open `http://localhost:3000` in your browser.

## Demo Video

https://drive.google.com/file/d/13XFDuUnzI2TqIMR1Ju4jUzR-w4nIjG3_/view?usp=sharing

## Project Requirements & Submission Checklist

This project was built to meet the following criteria:

### Core Requirements
- **1AM Wallet Connect / Disconnect:** Successfully implemented.
- **Circuit Integration:** Circuit called successfully from the frontend with result handling.
- **Observable Privacy Behavior:** Privacy claim proven without revealing private data.
- **Preprod Deployment:** Contract deployed to Preprod with a verifiable address.
- **Commits:** Minimum of 8 meaningful commits.

### 1. UX and Error Handling
- **Loading States:** UI displays loading indicators while waiting for 1AM wallet connection, generating the ZK proof, and waiting for the transaction to confirm on-chain.
- **Error Handling:** Graceful error handling when a user rejects the 1AM wallet connection, has insufficient funds, or a circuit call fails.

### 2. Code Quality and Structure
- **Separation of Concerns:** UI components are separated from the Midnight.js SDK interaction logic.
- **Clean Code:** Code is clean and free of excessive `console.log` statements or dead code.

### 3. README and Documentation
- **Local Setup & .env Configuration:** Proper configuration steps are provided to run the UI locally.
- **Smart Contract Source:** `.compact` source code and compiled artifacts are included in the repository.
- **Testing Instructions:** Instructions on how to test locally.

### 4. Open Source
- **License File:** An open-source license (MIT) has been added to clarify terms of use.
