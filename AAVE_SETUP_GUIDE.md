# Aave Loan System - Quick Setup Guide

## 🚀 Get Started in 5 Steps

### Step 1: Install Dependencies

```bash
npm install ethers@^6.9.0
# or
yarn add ethers@^6.9.0
# or
pnpm add ethers@^6.9.0
```

**Note**: The integration uses ethers v6 for Ethereum/Celo interactions.

---

### Step 2: Environment Variables

Add these to your `.env` file:

```bash
# Celo Network (Alfajores Testnet)
CELO_RPC_URL=https://alfajores-forno.celo-testnet.org

# Aave V3 on Celo Alfajores (Update with actual addresses)
NEXT_PUBLIC_AAVE_LENDING_POOL_ADDRESS=0x...
NEXT_PUBLIC_AAVE_DATA_PROVIDER_ADDRESS=0x...
```

**Get Actual Addresses**:
- Visit [Aave Docs](https://docs.aave.com/developers/deployed-contracts/v3-testnet-addresses)
- Look for Celo Alfajores deployments
- Copy Lending Pool and Data Provider addresses

---

### Step 3: Database Setup

The Wallet model should already exist in your schema. If not, add:

```prisma
model Wallet {
  id         String   @id @default(cuid())
  address    String   @unique
  privateKey String   // Encrypt in production!
  balance    Decimal  @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  userId     String   @unique
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

Then run:

```bash
npx prisma migrate dev --name add-aave-wallet
npx prisma generate
```

---

### Step 4: Get Test Funds

1. **Visit Celo Faucet**: https://faucet.celo.org
2. **Connect Wallet** or enter address
3. **Request Tokens**:
   - ✅ cUSD (Celo Dollar)
   - ✅ CELO (for gas fees)
   - ✅ cEUR (Celo Euro) - Optional

You need these tokens to test deposits and borrows!

---

### Step 5: Test the Feature

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Navigate to Loans Page**:
   ```
   http://localhost:3000/dashboard/loans
   ```

3. **Test Workflow**:
   - Click "Deposit Collateral"
   - Select cUSD, enter amount (e.g., 100)
   - Submit transaction
   - Wait for confirmation
   - Check your collateral balance
   - Try borrowing against it!

---

## 🎯 Quick Test Checklist

- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Test tokens acquired
- [ ] Server running
- [ ] Loans page accessible
- [ ] Deposit transaction successful
- [ ] Account data displayed
- [ ] Borrow functionality tested
- [ ] Repayment tested

---

## ⚠️ Important Notes

### 1. **Private Key Security**

**NEVER commit real private keys!**

For development:
```typescript
// Store encrypted in production
const encryptedKey = encrypt(privateKey)
await prisma.wallet.create({
  data: { privateKey: encryptedKey }
})
```

### 2. **Gas Fees**

All transactions require CELO for gas:
- Deposit: ~0.001 CELO
- Borrow: ~0.002 CELO
- Repay: ~0.002 CELO

**Ensure users have CELO balance!**

### 3. **Health Factor**

⚠️ **Critical**: Monitor health factor!
- Below 1.0 = Liquidation risk
- Below 1.5 = Warning state
- Above 2.0 = Safe

---

## 🔧 Troubleshooting

### Error: "Cannot find module 'ethers'"
```bash
npm install ethers@^6.9.0
```

### Error: "CELO_RPC_URL is not defined"
- Check `.env` file exists
- Verify variable name is correct
- Restart dev server

### Error: "Wallet not found"
- User needs to create wallet first
- Add wallet creation flow
- Or seed test wallet in database

### Error: "Insufficient funds"
- Get test tokens from faucet
- Verify token balance
- Check gas fees (CELO)

### Transaction Pending Forever
- Check network status
- Verify RPC URL is correct
- Try different RPC endpoint:
  - `https://alfajores-forno.celo-testnet.org`
  - `https://celo-alfajores.infura.io/v3/YOUR_KEY`

---

## 📚 Next Steps

After basic setup:

1. **Add Wallet Creation Flow**:
   - Let users create/import wallets
   - Store securely with encryption

2. **Implement Health Factor Alerts**:
   - Email notifications
   - Push notifications
   - SMS alerts

3. **Add Transaction History**:
   - Show all past transactions
   - Export to CSV
   - Filter by type/date

4. **Enable Multiple Positions**:
   - Support different assets
   - Track multiple loans
   - Portfolio view

5. **Integrate with Group Loans**:
   - Use Aave for group lending
   - Collective collateral
   - Shared borrowing power

---

## 🎨 UI Customization

### Colors

Health Factor colors in `loans-tab.tsx`:

```typescript
const getHealthFactorColor = (hf: string) => {
  const value = parseFloat(hf)
  if (value >= 2) return "text-emerald-600 bg-emerald-50"   // Excellent
  if (value >= 1.5) return "text-green-600 bg-green-50"     // Good
  if (value >= 1.1) return "text-amber-600 bg-amber-50"     // Fair
  return "text-red-600 bg-red-50"                           // At Risk
}
```

### Branding

Update the badge in `loans-tab.tsx`:

```tsx
<Badge className="bg-purple-100 text-purple-700 border-purple-200">
  Powered by Aave
</Badge>
```

---

## 📊 Monitoring

### What to Monitor:

1. **Transaction Success Rate**:
   ```sql
   SELECT 
     COUNT(*) as total,
     SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as successful
   FROM Transaction
   WHERE type IN ('LOAN_DISBURSEMENT', 'LOAN_REPAYMENT')
   ```

2. **Average Health Factor**:
   ```typescript
   const avgHealthFactor = positions.reduce((sum, p) => 
     sum + parseFloat(p.healthFactor), 0
   ) / positions.length
   ```

3. **Total Value Locked**:
   ```typescript
   const tvl = accountData.totalCollateral
   ```

---

## 🚨 Production Checklist

Before deploying to production:

- [ ] Switch to Celo Mainnet
- [ ] Update Aave contract addresses
- [ ] Implement private key encryption
- [ ] Add transaction confirmations
- [ ] Set up error logging (Sentry)
- [ ] Enable rate limiting
- [ ] Add transaction retry logic
- [ ] Implement health factor monitoring
- [ ] Set up automated tests
- [ ] Create backup recovery system

---

## 🎓 Learning Resources

- **Aave**: [docs.aave.com](https://docs.aave.com)
- **Celo**: [docs.celo.org](https://docs.celo.org)
- **Ethers.js**: [docs.ethers.org](https://docs.ethers.org)
- **DeFi Basics**: [ethereum.org/en/defi](https://ethereum.org/en/defi/)

---

## 💬 Support

If you encounter issues:

1. Check `AAVE_LOAN_SYSTEM.md` for detailed docs
2. Review console logs for errors
3. Test on Alfajores testnet first
4. Verify contract addresses are correct

---

**Ready to go!** 🎉 Your DeFi loan system is now set up!

