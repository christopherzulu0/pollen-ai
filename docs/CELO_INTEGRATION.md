# Celo Blockchain Integration Guide

## Overview

This document outlines the implementation of Celo blockchain functionality in the Pollen dashboard. Celo is a mobile-first blockchain platform that enables fast, low-cost payments using phone numbers and stablecoins.

## Table of Contents

1. [Architecture](#architecture)
2. [Setup](#setup)
3. [Features](#features)
4. [Implementation Details](#implementation-details)
5. [API Reference](#api-reference)
6. [Smart Contracts](#smart-contracts)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│              Dashboard UI Components                 │
│  (Wallet Connect, Balance Display, Transactions)    │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│           Celo Wallet Provider (Context)            │
│     (Wallet Connection, Account Management)         │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              Celo SDK Utilities                     │
│   (ContractKit, Transaction Helpers, Utils)         │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              Celo API Routes                        │
│   (/api/celo/* - Transaction endpoints)             │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              Celo Network                           │
│   (Mainnet, Alfajores Testnet)                      │
└─────────────────────────────────────────────────────┘
```

---

## Setup

### 1. Install Dependencies

```bash
npm install @celo/contractkit ethers@^5.7.0 @celo-tools/use-contractkit
npm install --save-dev @types/node
```

### 2. Environment Variables

Add to `.env.local`:

```env
# Celo Network Configuration
NEXT_PUBLIC_CELO_NETWORK=alfajores  # or "mainnet"
CELO_RPC_URL=https://alfajores-forno.celo-testnet.org  # Testnet
# CELO_RPC_URL=https://forno.celo.org  # Mainnet

# Optional: For contract interactions
CELO_CONTRACT_ADDRESS=  # Your deployed contract address
```

### 3. Celo Networks

- **Alfajores Testnet**: Development and testing
- **Mainnet**: Production (real assets)

---

## Features

### 1. Wallet Connection
- Connect using MetaMask, WalletConnect, or Celo Wallet
- Support for Ledger hardware wallets
- Mobile wallet support (Valora)

### 2. Balance Management
- Display CELO, cUSD, cEUR balances
- Real-time balance updates
- Multi-currency support

### 3. Transactions
- Send CELO/cUSD/cEUR
- Receive payments
- Transaction history
- Gas fee estimation

### 4. Smart Contract Integration
- Interact with deployed contracts
- Execute contract functions
- Read contract state

---

## Implementation Details

### Wallet Model Updates

The Prisma `Wallet` model is extended to include:

```prisma
model Wallet {
  id              String        @id @default(cuid())
  userId          String        @unique
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  balance         Decimal       @default(0)  # Off-chain balance
  celoAddress     String?       @unique      # Celo blockchain address
  celoBalance     String?       @default("0") # CELO balance (wei)
  cusdBalance     String?       @default("0") # cUSD balance
  ceurBalance     String?       @default("0") # cEUR balance
  network         String?       @default("alfajores") # Network name
  isConnected     Boolean       @default(false)
  connectedAt     DateTime?
  transactions    Transaction[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

### Component Structure

```
components/
  celo/
    celo-wallet-provider.tsx    # Wallet connection context
    wallet-connect-button.tsx    # Connect wallet UI
    balance-display.tsx          # Show balances
    send-transaction.tsx         # Send funds UI
    transaction-history.tsx      # Transaction list
    utils/
      celo-helpers.ts           # Utility functions
      contracts.ts              # Contract ABIs/interfaces
```

### API Routes

```
app/api/celo/
  connect/route.ts              # Link wallet address
  balance/route.ts              # Get account balances
  send/route.ts                 # Send transaction
  transactions/route.ts         # Transaction history
  gas/route.ts                  # Gas estimation
```

---

## API Reference

### POST /api/celo/connect

Link a Celo wallet address to a user account.

**Request:**
```json
{
  "address": "0x...",
  "network": "alfajores"
}
```

**Response:**
```json
{
  "success": true,
  "wallet": {
    "celoAddress": "0x...",
    "network": "alfajores"
  }
}
```

### GET /api/celo/balance?address=0x...

Get account balances (CELO, cUSD, cEUR).

**Response:**
```json
{
  "celo": "1000000000000000000",  // Wei
  "cusd": "5000000000000000000",  // Wei
  "ceur": "2000000000000000000",
  "celoFormatted": "1.0",
  "cusdFormatted": "5.0",
  "ceurFormatted": "2.0"
}
```

### POST /api/celo/send

Send a transaction (CELO or stablecoin).

**Request:**
```json
{
  "to": "0x...",
  "amount": "1.5",
  "currency": "CELO",  // or "cUSD", "cEUR"
  "fromPrivateKey": "0x..."  // Server-side only, never expose
}
```

**Response:**
```json
{
  "success": true,
  "transactionHash": "0x...",
  "receipt": {...}
}
```

⚠️ **Security Note**: Private keys should NEVER be sent from client. Use signed transactions or server-side wallet.

---

## Smart Contracts

### Common Celo Contracts

1. **StableToken (cUSD)**
   - Address (Alfajores): `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1`
   - Address (Mainnet): `0x765DE816845861e75A25fCA122bb6898B8B1282a`

2. **StableTokenEUR (cEUR)**
   - Address (Alfajores): `0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F`
   - Address (Mainnet): `0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73`

### Example Contract Interaction

```typescript
import { newKitFromWeb3 } from '@celo/contractkit'
import Web3 from 'web3'

const kit = newKitFromWeb3(new Web3(rpcUrl))
const stableToken = await kit.contracts.getStableToken()

// Transfer cUSD
const tx = await stableToken.transfer(toAddress, amount)
const receipt = await tx.sendAndWaitForReceipt()
```

---

## Security Considerations

1. **Never Expose Private Keys**: Always use wallet connections or server-side signing
2. **Network Validation**: Always verify transactions are on the intended network
3. **Amount Validation**: Validate amounts before sending transactions
4. **Gas Limits**: Set appropriate gas limits to prevent failed transactions
5. **Error Handling**: Handle network errors and transaction failures gracefully

---

## Testing

### Testnet Setup

1. Get testnet tokens from [Celo Faucet](https://faucet.celo.org/alfajores)
2. Use MetaMask or Celo Wallet with Alfajores network
3. Test transactions with testnet tokens

### Mainnet Deployment

1. Verify all functionality on testnet first
2. Use mainnet RPC endpoint
3. Start with small amounts for testing
4. Monitor gas prices and network conditions

---

## Resources

- [Celo Docs](https://docs.celo.org/)
- [ContractKit Documentation](https://docs.celo.org/developer-resources/contractkit)
- [Celo Forum](https://forum.celo.org/)
- [Alfajores Testnet Explorer](https://alfajores-blockscout.celo-testnet.org/)

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Update Prisma schema
3. ✅ Create wallet provider
4. ✅ Build UI components
5. ✅ Implement API routes
6. ✅ Integrate with dashboard
7. ⏳ Deploy smart contracts (if needed)
8. ⏳ Testing and optimization

