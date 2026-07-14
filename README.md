# Midnight Private Bid Auction DApp

> Zero-knowledge sealed-bid auctions on the Midnight Network. Your bid, your secret.

## Live Demo
https://midnight-project-ten.vercel.app/

## Contract Address

| Network  | Address |
|----------|---------|
| Preprod  | [`b20f8f836047ce33353b13e1e85d8dc95a55f306e876cb7b822bbaad4bb1acf6`](https://preprod.midnightexplorer.com/contracts/b20f8f836047ce33353b13e1e85d8dc95a55f306e876cb7b822bbaad4bb1acf6) |

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
