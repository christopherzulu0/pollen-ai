# Switch from Mock to Moola Market

Moola Market is an Aave V2 fork deployed on Celo - perfect for your use case!

## Moola Market on Celo Alfajores (Testnet)

### Contract Addresses

```bash
# Add to .env
NEXT_PUBLIC_LENDING_POOL_ADDRESS=0x0886f74eEEc443fBb6907fB5528B57C28E813129
NEXT_PUBLIC_LENDING_POOL_ADDRESSES_PROVIDER=0xb3072f5F0d5e8B9036aEC29F37baB70E86EA0018
NEXT_PUBLIC_LENDING_POOL_DATA_PROVIDER=0x43d067ed784D9DD2ffEda73775e2CC4c560103A1
CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
```

### Token Addresses (Alfajores)

```bash
# Supported assets on Moola Alfajores
cUSD=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
CELO=0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9
cEUR=0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F
```

## Steps to Switch

### 1. Update Environment Variables

```bash
# .env
NEXT_PUBLIC_LENDING_POOL_ADDRESS=0x0886f74eEEc443fBb6907fB5528B57C28E813129
NEXT_PUBLIC_LENDING_POOL_DATA_PROVIDER=0x43d067ed784D9DD2ffEda73775e2CC4c560103A1
CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
```

### 2. Update `lib/aave-helper.ts`

The ABIs are compatible (Moola is Aave V2 fork), just need to update addresses and some function names.

**Key Changes:**
- Moola uses Aave V2 interface (slightly different from V3)
- `borrow()` parameters are same
- `deposit()` is same
- Data provider interface is compatible

### 3. Remove Mock Code

In each API route, replace the mock section with the original real implementation:

**`app/api/aave/account/route.ts`:**
```typescript
// Remove this:
// const mockAccountData = {...}
// return NextResponse.json(mockAccountData)

// Restore this:
import { getUserAccountData } from "@/lib/aave-helper"

const accountData = await getUserAccountData(user.wallet.celoAddress)
return NextResponse.json({
  totalCollateral: accountData.totalCollateralETH,
  totalDebt: accountData.totalDebtETH,
  availableBorrows: accountData.availableBorrowsETH,
  healthFactor: accountData.healthFactor,
  ltv: accountData.ltv,
  liquidationThreshold: accountData.currentLiquidationThreshold,
})
```

### 4. Get Test Tokens

```bash
# Get test CELO and cUSD from faucet
# Visit: https://faucet.celo.org/alfajores
# Enter your wallet address
```

### 5. Test the Flow

1. Generate/import wallet
2. Get testnet tokens from faucet
3. Try depositing cUSD
4. Try borrowing
5. Check transaction on explorer: https://explorer.celo.org/alfajores

## Moola Market Resources

- **Website**: https://moola.market
- **Docs**: https://docs.moola.market
- **Discord**: https://discord.gg/moola
- **GitHub**: https://github.com/moolamarket

## Moola vs Aave Differences

### What's the Same:
- ✅ Core lending/borrowing mechanics
- ✅ Health factor calculations
- ✅ Interest rate models
- ✅ Liquidation logic

### What's Different:
- Moola uses Aave V2 (not V3)
- Some parameter names slightly different
- Governance token: MOO (not AAVE)

## Production (Celo Mainnet)

When ready for mainnet:

```bash
# Moola on Celo Mainnet
NEXT_PUBLIC_LENDING_POOL_ADDRESS=0xc1548F5AA1D76CDcAB7385FA6B5cEA70f941e535
NEXT_PUBLIC_LENDING_POOL_DATA_PROVIDER=0x31ccB9dC068058672D96E92BAf96B1607855822E
CELO_RPC_URL=https://forno.celo.org
```

## Benefits of Moola

✅ **Actually deployed on Celo** - Real blockchain transactions  
✅ **Active and audited** - Production-ready  
✅ **Aave fork** - Your code mostly compatible  
✅ **Lower gas fees** - On Celo network  
✅ **Testnet available** - Can test before mainnet  

## Alternative: Keep Mock Mode

If you prefer to wait for official Aave on Celo:
- Keep current mock implementation
- Use for demos/development
- Switch when Aave deploys

---

**Recommendation**: Use Moola Market for real DeFi functionality on Celo right now! 🚀

