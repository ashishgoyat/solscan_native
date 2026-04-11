# Soltrack

A clean, minimal React Native app to explore any Solana wallet. Enter a wallet address and instantly view the SOL balance, token holdings, and recent transaction history — all powered by the Solana mainnet RPC.

## Features
-  Look up any Solana wallet address
-  View SOL balance in real time
-  See all token holdings
-  Browse last 10 transactions with status and timestamp
-  Tap any transaction to open it in a Solana block explorer

## Tech Stack
- React Native + Expo
- TypeScript
- Solana JSON RPC API (mainnet-beta)
- Axios

## Getting Started

1. Clone the repo
2. Run `npm install`
3. Run `npx expo start`

No API key needed — uses the public Solana RPC endpoint.

## RPC Endpoint
Uses `https://api.mainnet-beta.solana.com` and you can replace it with a private RPC (Helius, QuickNode, etc.) for better rate limits.
