#!/bin/bash

# Quick Script to Enable Real Moola Market Integration
# Run this to switch from mock to real DeFi on Celo

echo "🔄 Switching from Mock to Real Moola Market..."

# 1. Update environment variables
cat >> .env << 'EOF'

# Moola Market on Celo Alfajores (Testnet)
NEXT_PUBLIC_LENDING_POOL_ADDRESS=0x0886f74eEEc443fBb6907fB5528B57C28E813129
NEXT_PUBLIC_LENDING_POOL_DATA_PROVIDER=0x43d067ed784D9DD2ffEda73775e2CC4c560103A1
CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
EOF

echo "✅ Environment variables added"

echo ""
echo "⚠️  NEXT STEPS:"
echo ""
echo "1. Uncomment real implementation in API routes:"
echo "   - app/api/aave/account/route.ts"
echo "   - app/api/aave/positions/route.ts"
echo "   - app/api/aave/deposit/route.ts"
echo "   - app/api/aave/borrow/route.ts"
echo "   - app/api/aave/repay/route.ts"
echo ""
echo "2. Add back the import: import { getUserAccountData } from '@/lib/aave-helper'"
echo ""
echo "3. Get test tokens from: https://faucet.celo.org/alfajores"
echo ""
echo "4. Restart dev server: npm run dev"
echo ""
echo "📚 See SWITCH_TO_MOOLA.md for detailed instructions"

