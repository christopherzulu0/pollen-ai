# Celo Blockchain Integration - Setup Instructions

## ✅ What's Been Done

1. ✅ Updated Prisma `Wallet` model with Celo fields
2. ✅ Created Celo utility functions (`lib/celo/utils.ts`)
3. ✅ Created Celo wallet provider/context (`lib/celo/context.tsx`)
4. ✅ Created documentation (`docs/CELO_INTEGRATION.md`)

## 📋 Next Steps to Complete Integration

### Step 1: Install Dependencies

```bash
npm install ethers@^5.7.0
npm install --save-dev @types/node
```

**Optional (for advanced features):**
```bash
npm install @celo/contractkit
npm install @celo-tools/use-contractkit
```

### Step 2: Update Environment Variables

Add to `.env.local`:

```env
# Celo Network Configuration
NEXT_PUBLIC_CELO_NETWORK=alfajores  # or "mainnet" for production
CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
```

### Step 3: Run Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Create migration for Wallet model updates
npx prisma migrate dev --name add-celo-wallet-fields

# Or if using db push (for development)
npx prisma db push
```

### Step 4: Add Wallet Provider to Dashboard Layout

Update `app/dashboard/layout.tsx`:

```typescript
import { CeloWalletProvider } from "@/lib/celo/context"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ProtectedDashboard>
        <CeloWalletProvider>
          <Dashboard>
            {children}
          </Dashboard>
        </CeloWalletProvider>
      </ProtectedDashboard>
    </ThemeProvider>
  )
}
```

### Step 5: Create Wallet Connection Component

Create `components/celo/wallet-connect-button.tsx` (see next section for full implementation)

### Step 6: Create API Routes

Create API routes in `app/api/celo/`:
- `connect/route.ts` - Link wallet to user
- `balance/route.ts` - Get balances
- `send/route.ts` - Send transactions
- `transactions/route.ts` - Transaction history

### Step 7: Integrate with Dashboard Pages

Add Celo wallet features to:
- `app/dashboard/view-balances/page.tsx` - Show Celo balances
- `app/dashboard/payments/page.tsx` - Enable Celo payments
- `app/dashboard/deposit-withdraw/page.tsx` - Celo deposit/withdraw

## 🔧 Remaining Implementation Files Needed

### 1. Wallet Connect Button Component

**File**: `components/celo/wallet-connect-button.tsx`
- Connect/disconnect wallet UI
- Show wallet address
- Display connection status

### 2. Balance Display Component

**File**: `components/celo/balance-display.tsx`
- Show CELO, cUSD, cEUR balances
- Format amounts properly
- Refresh functionality

### 3. Send Transaction Component

**File**: `components/celo/send-transaction.tsx`
- Form to send CELO/cUSD/cEUR
- Amount input
- Recipient address
- Transaction preview
- Gas estimation

### 4. API Routes

**Files in `app/api/celo/`:**

- `connect/route.ts` - Save wallet address to database
- `balance/route.ts` - Fetch balances from blockchain
- `send/route.ts` - Execute transactions (server-side signing)
- `transactions/route.ts` - Get transaction history

### 5. Transaction History Component

**File**: `components/celo/transaction-history.tsx`
- List past transactions
- Show transaction status
- Links to explorer

## 🎯 Integration Points

### Dashboard Overview
Add wallet connection status and Celo balance card

### View Balances Page
Show CELO, cUSD, cEUR alongside traditional balances

### Payments Page
Enable sending CELO/cUSD/cEUR to other users

### Deposit/Withdraw Page
Enable depositing/withdrawing via Celo blockchain

## 🔒 Security Considerations

1. **Never store private keys** - Always use wallet connections
2. **Server-side signing** - For automated transactions, use server-side wallets with proper key management
3. **Network validation** - Always verify transactions are on the correct network
4. **Amount validation** - Validate amounts before sending
5. **Gas limits** - Set appropriate gas limits

## 📚 Resources

- [Celo Documentation](https://docs.celo.org/)
- [Ethers.js Documentation](https://docs.ethers.io/v5/)
- [Celo Testnet Faucet](https://faucet.celo.org/alfajores)
- [Alfajores Explorer](https://alfajores-blockscout.celo-testnet.org/)

## 🧪 Testing

1. **Testnet Setup**:
   - Get testnet tokens from faucet
   - Connect MetaMask to Alfajores network
   - Test all functionality with testnet tokens

2. **Test Checklist**:
   - [ ] Wallet connection
   - [ ] Balance display
   - [ ] Send transaction
   - [ ] Receive transaction
   - [ ] Transaction history
   - [ ] Network switching
   - [ ] Error handling

## 💡 Quick Start Guide

1. **Install packages**: `npm install ethers@^5.7.0`
2. **Run migration**: `npx prisma db push`
3. **Add provider** to dashboard layout
4. **Add wallet button** to dashboard UI
5. **Test connection** on Alfajores testnet

## 🆘 Troubleshooting

### "Please install MetaMask or Celo wallet"
- Install MetaMask browser extension
- Or use Celo Wallet mobile app

### "Please switch to Celo network"
- Click the switch network button
- Or manually add Celo network in MetaMask

### Balance not updating
- Check network connection
- Verify RPC URL is correct
- Check console for errors

---

**Status**: Foundation complete, ready for component implementation
**Last Updated**: 2025-01-21

