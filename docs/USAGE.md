# 📖 Midnight Private Bid Auction — Usage Guide

> **Bid in the shadows. Win in the light.**

This guide walks you through every feature of the Midnight Private Bid Auction DApp as a regular user — no developer knowledge required.

---

## What You Need

| Requirement | Details |
|---|---|
| **Browser** | Chrome or Brave (desktop or mobile) |
| **1AM Wallet** | Free extension — [download at 1am.io](https://1am.space) |
| **tNIGHT tokens** | Free test tokens from the [Preprod Faucet](https://faucet.preview.midnight.network) |
| **Network** | Midnight Preprod Network (selected inside the 1AM Wallet) |

---

## Step-by-Step Guide

### 1. Connecting Your Wallet
1. Open the Live App in your browser.
2. Click the **🔑 Connect Wallet** button in the top-right corner.
3. Your **1AM Wallet** extension will pop up — click **Connect**.
4. Once connected, the UI will display your short wallet address and current tNIGHT & DUST balances.

### 2. Placing a Sealed ZK Bid (Bidder Mode)
1. Select **Bidder Mode** in the interactive panel.
2. Enter your **Bid Amount** (must be greater than or equal to the minimum bid).
3. Click **Submit Bid**.
4. The DApp will:
   - Generate a unique cryptographic secret key for your bid.
   - Write your bid value and secret key to your browser's private state.
   - Generate a local ZK proof (validating your bid satisfies the minimum limit without revealing the amount).
   - Prompt the 1AM wallet to balance and submit the transaction.
5. Review the 1AM wallet popup and click **Approve**.
6. Once the transaction completes, your bid is secured on-chain.

### 3. Closing the Auction (Host Mode)
1. Select **Host Mode** in the interactive panel.
2. If you are the host, enter your private secret key and click **Close Auction**.
3. The DApp will generate a ZK proof to verify the winning bid, close the auction on the ledger, and reveal the winner's public key along with the final winning price.
4. Bidders can now click **Verify Proof** to cryptographically verify the correctness of the auction settlement.

---

## What Gets Proved (and What Stays Private)

### 🔓 What is PUBLIC (verifiable by anyone):
- The total count of bids placed in the auction.
- The active state of the auction (`OPEN` vs `CLOSED`).
- The derived public key of the winning bidder (only after the auction is closed).
- The final winning price (only after the auction is closed).

### 🔒 What remains PRIVATE (never exposed on-chain):
- Individual bid amounts (kept in private browser state).
- The secret keys of all bidders.
- The identities of losing bidders (losing bids stay sealed forever).

---

## Troubleshooting

### ❌ Error: "Insufficient Funds" or "Not enough DUST"
- **Cause:** Your wallet doesn't have enough DUST to pay for the transaction.
- **Solution:** 
  - Ensure you have a non-zero DUST balance.
  - Stake tNIGHT in the 1AM wallet to start generating DUST.
  - Make sure you are on the correct network (Preprod).

### ❌ Error: "Failed to fetch ZKIR / Prover keys"
- **Cause:** The ZK proving keys could not be resolved from `/managed`.
- **Solution:** Refresh the page or ensure the local development server (or Vercel build) has successfully compiled and placed the assets in the `/public/managed/` folder.
