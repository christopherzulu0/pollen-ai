# Aave Loan System Documentation

## Overview
The Pollen platform now integrates with **Aave V3** on the Celo blockchain, enabling users to access DeFi lending and borrowing directly from the dashboard.

## Features

### 1. **Deposit Collateral** 🏦
- Deposit crypto assets (cUSD, CELO, cEUR) as collateral
- Earn deposit APY while your funds are deposited
- Collateral can be used to borrow other assets

### 2. **Borrow Funds** 💰
- Borrow against your deposited collateral
- Choose between stable or variable interest rates
- Real-time calculation of available borrowing power

### 3. **Repay Loans** 💳
- Repay borrowed funds partially or fully
- Automatic interest calculation
- Health factor improves with each repayment

### 4. **Monitor Health Factor** 📊
- Real-time health factor monitoring
- Color-coded warnings (Excellent, Good, Fair, At Risk)
- Liquidation risk alerts

### 5. **View Positions** 👀
- Track all active positions
- Monitor collateral vs. debt ratios
- LTV (Loan-to-Value) visualization

## Technical Architecture

### Smart Contracts

**Aave V3 on Celo**:
- Lending Pool: Handles deposits, withdrawals, borrows, and repayments
- Data Provider: Provides reserve and user data
- Price Oracle: For asset pricing and collateralization

### Integration Flow

```
User Dashboard → API Routes → Aave Helper → Celo RPC → Aave Smart Contracts
                                              ↓
                                    Blockchain Transaction
                                              ↓
                                    Database Record (Transaction History)
```

## File Structure

```
├── app/
│   ├── dashboard/
│   │   └── loans/
│   │       └── page.tsx                    # Loans dashboard page
│   └── api/
│       └── aave/
│           ├── account/route.ts            # Get account data
│           ├── deposit/route.ts            # Deposit collateral
│           ├── borrow/route.ts             # Borrow funds
│           ├── repay/route.ts              # Repay loans
│           └── positions/route.ts          # Get user positions
├── components/
│   └── dashboard/
│       └── features/
│           └── loans/
│               └── loans-tab.tsx           # Main loans UI component
└── lib/
    └── aave-helper.ts                      # Aave integration helper functions
```

## API Endpoints

### GET `/api/aave/account`
Fetches user's Aave account data.

**Response**:
```json
{
  "totalCollateral": "1000.00",
  "totalDebt": "300.00",
  "availableBorrows": "500.00",
  "healthFactor": "2.67",
  "ltv": "30.00",
  "liquidationThreshold": "80.00"
}
```

### POST `/api/aave/deposit`
Deposits collateral to Aave.

**Request Body**:
```json
{
  "asset": "cUSD",
  "amount": "100.00"
}
```

**Response**:
```json
{
  "success": true,
  "transactionHash": "0x...",
  "message": "Successfully deposited 100.00 cUSD"
}
```

### POST `/api/aave/borrow`
Borrows funds from Aave.

**Request Body**:
```json
{
  "asset": "cUSD",
  "amount": "50.00",
  "interestRateMode": 2
}
```

**Response**:
```json
{
  "success": true,
  "transactionHash": "0x...",
  "message": "Successfully borrowed 50.00 cUSD"
}
```

### POST `/api/aave/repay`
Repays borrowed funds to Aave.

**Request Body**:
```json
{
  "asset": "cUSD",
  "amount": "25.00",
  "rateMode": 2
}
```

**Response**:
```json
{
  "success": true,
  "transactionHash": "0x...",
  "message": "Successfully repaid 25.00 cUSD"
}
```

### GET `/api/aave/positions`
Fetches user's active loan positions.

**Response**:
```json
[
  {
    "id": "cUSD-0x...",
    "asset": "cUSD",
    "collateral": "1000.00",
    "borrowed": "300.00",
    "interestRate": "4.25",
    "healthFactor": "2.67",
    "liquidationThreshold": "80",
    "ltv": "30.00",
    "usageAsCollateralEnabled": true
  }
]
```

## Environment Variables

Add these to your `.env` file:

```bash
# Celo Network
CELO_RPC_URL=https://alfajores-forno.celo-testnet.org

# Aave V3 on Celo Alfajores
NEXT_PUBLIC_AAVE_LENDING_POOL_ADDRESS=0x...
NEXT_PUBLIC_AAVE_DATA_PROVIDER_ADDRESS=0x...

# User's Private Key (stored securely in database per user)
# CELO_PRIVATE_KEY is fetched from user.wallet.privateKey
```

## Database Schema

### Wallet Model
Users need a wallet record to interact with Aave:

```prisma
model Wallet {
  id         String   @id @default(cuid())
  address    String   @unique
  privateKey String   // Encrypted in production!
  balance    Decimal  @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  userId     String   @unique
  user       User     @relation(fields: [userId], references: [id])
}
```

### Transaction Model
All Aave operations are recorded:

```prisma
model Transaction {
  id          String            @id @default(cuid())
  amount      Decimal
  type        TransactionType   // DEPOSIT, LOAN_DISBURSEMENT, LOAN_REPAYMENT
  status      TransactionStatus // COMPLETED, PENDING, FAILED
  description String?
  createdAt   DateTime          @default(now())
  userId      String
  user        User              @relation(fields: [userId], references: [id])
}
```

## Health Factor Explained

**Health Factor** = (Total Collateral × Liquidation Threshold) / Total Debt

### Color Coding:
- **≥ 2.0**: 🟢 Excellent (Green) - Very safe
- **1.5 - 1.99**: 🟡 Good (Light Green) - Safe
- **1.1 - 1.49**: 🟠 Fair (Amber) - Caution advised
- **< 1.1**: 🔴 At Risk (Red) - Risk of liquidation

**Critical**: If health factor drops below 1.0, your position can be liquidated!

## Supported Assets

| Asset | Name | Address (Celo Alfajores) |
|-------|------|--------------------------|
| cUSD | Celo Dollar | `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1` |
| CELO | Celo Native | `0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9` |
| cEUR | Celo Euro | `0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F` |

## User Journey

### Depositing Collateral
1. User clicks "Deposit Collateral"
2. Selects asset (cUSD, CELO, or cEUR)
3. Enters amount
4. Transaction is sent to Aave smart contract
5. Collateral is deposited
6. User can now borrow against it

### Borrowing Funds
1. User clicks "Borrow Funds"
2. System shows available borrowing power
3. User selects asset and amount
4. Chooses interest rate type (stable/variable)
5. Transaction is executed
6. Borrowed funds sent to user's wallet
7. Health factor is updated

### Repaying Loans
1. User clicks "Repay Loan"
2. Selects asset to repay
3. Enters repayment amount
4. System approves token spending
5. Repayment is processed
6. Debt is reduced
7. Health factor improves

## Interest Rate Modes

### 1. **Stable Rate** (interestRateMode: 1)
- Fixed interest rate for predictable payments
- Higher initial rate
- Good for conservative borrowers

### 2. **Variable Rate** (interestRateMode: 2)
- Fluctuates based on market conditions
- Typically lower initial rate
- Good for short-term loans

## Security Considerations

### 1. **Private Key Storage**
⚠️ **CRITICAL**: Never expose private keys!

```typescript
// Production: Encrypt private keys before storing
import { encrypt, decrypt } from '@/lib/encryption'

// Storing
const encryptedKey = encrypt(privateKey)
await prisma.wallet.create({
  data: { privateKey: encryptedKey }
})

// Using
const decryptedKey = decrypt(wallet.privateKey)
const signer = getSigner(decryptedKey)
```

### 2. **Transaction Validation**
- Validate all inputs before blockchain transactions
- Check user has sufficient balance
- Verify health factor won't drop below safe threshold

### 3. **Error Handling**
- All blockchain calls wrapped in try-catch
- User-friendly error messages
- Transaction failures logged for debugging

## Best Practices

### 1. **Maintain Healthy Collateral Ratio**
- Keep health factor above 2.0
- Don't borrow maximum available amount
- Monitor market conditions

### 2. **Diversify Collateral**
- Use multiple asset types
- Reduces risk from single asset volatility

### 3. **Regular Monitoring**
- Check health factor daily
- Set up liquidation alerts
- Repay when rates are favorable

## Testing

### Testnet Setup (Celo Alfajores)

1. **Get Test Tokens**:
   - Faucet: https://faucet.celo.org
   - Request cUSD, CELO, and cEUR

2. **Test Workflow**:
   ```bash
   # 1. Deposit collateral
   curl -X POST /api/aave/deposit \
     -H "Content-Type: application/json" \
     -d '{"asset":"cUSD","amount":"100"}'
   
   # 2. Check account
   curl /api/aave/account
   
   # 3. Borrow funds
   curl -X POST /api/aave/borrow \
     -H "Content-Type: application/json" \
     -d '{"asset":"cUSD","amount":"30","interestRateMode":2}'
   
   # 4. Check positions
   curl /api/aave/positions
   
   # 5. Repay loan
   curl -X POST /api/aave/repay \
     -H "Content-Type: application/json" \
     -d '{"asset":"cUSD","amount":"10","rateMode":2}'
   ```

## Troubleshooting

### Issue: "Wallet not found"
**Solution**: User needs to create a wallet first. Add wallet creation flow.

### Issue: "Insufficient collateral"
**Solution**: User needs to deposit more collateral before borrowing.

### Issue: "Health factor too low"
**Solution**: User should repay debt or add collateral to improve health factor.

### Issue: "Transaction failed"
**Possible Causes**:
- Insufficient gas fees (CELO)
- Token not approved for spending
- Network congestion

**Solution**: 
- Ensure user has CELO for gas
- Check token allowance
- Retry transaction

## Monitoring & Analytics

### Key Metrics to Track:
- Total Value Locked (TVL)
- Active loans count
- Average health factor
- Liquidation events
- Popular asset pairs
- Borrow/Deposit APY trends

### Dashboard Widgets:
- Real-time health factor gauge
- Collateral vs. debt chart
- Interest accrued over time
- Position performance

## Future Enhancements

- [ ] **Multi-collateral positions**: Support multiple assets as collateral
- [ ] **Flash loans**: Implement flash loan functionality
- [ ] **Liquidation protection**: Automatic debt reduction when health factor drops
- [ ] **Rate optimization**: Suggest optimal borrow/repay times
- [ ] **Social features**: Share strategies with group members
- [ ] **Governance**: Participate in Aave governance with borrowed assets
- [ ] **Insurance**: Optional loan insurance against liquidation

## Resources

- [Aave V3 Documentation](https://docs.aave.com/developers/v/2.0/)
- [Celo Developer Docs](https://docs.celo.org/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Prisma ORM Guide](https://www.prisma.io/docs/)

---

**Status**: ✅ Fully Implemented  
**Blockchain**: Celo Alfajores Testnet  
**Protocol**: Aave V3  
**Last Updated**: November 28, 2025

