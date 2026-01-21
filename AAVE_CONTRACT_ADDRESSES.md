# AAVE/Moola Market Contract Addresses

## ⚠️ Important: AAVE V3 is NOT deployed on Celo

**AAVE V3 is currently NOT available on Celo (mainnet or testnet).** 

Instead, use **Moola Market**, which is an AAVE V2 fork that IS deployed on Celo.

---

## 📍 Where to Get Contract Addresses

### Option 1: Use Moola Market (Recommended - Available Now)

Moola Market is an AAVE fork that's actually deployed on Celo. Use these addresses:

#### **Celo Alfajores (Testnet)**

Add these to your `.env` file:

```bash
# Moola Market on Celo Alfajores Testnet
NEXT_PUBLIC_LENDING_POOL_ADDRESS=0x0886f74eEEc443fBb6907fB5528B57C28E813129
NEXT_PUBLIC_AAVE_DATA_PROVIDER_ADDRESS=0x43d067ed784D9DD2ffEda73775e2CC4c560103A1
# OR use this alternative name:
NEXT_PUBLIC_LENDING_POOL_DATA_PROVIDER=0x43d067ed784D9DD2ffEda73775e2CC4c560103A1

CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
```

#### **Celo Mainnet**

```bash
# Moola Market on Celo Mainnet
NEXT_PUBLIC_LENDING_POOL_ADDRESS=0xc1548F5AA1D76CDcAB7385FA6B5cEA70f941e535
NEXT_PUBLIC_AAVE_DATA_PROVIDER_ADDRESS=0x31ccB9dC068058672D96E92BAf96B1607855822E
# OR use this alternative name:
NEXT_PUBLIC_LENDING_POOL_DATA_PROVIDER=0x31ccB9dC068058672D96E92BAf96B1607855822E

CELO_RPC_URL=https://forno.celo.org
```

**Source**: [Moola Market Documentation](https://docs.moola.market) and [SWITCH_TO_MOOLA.md](./SWITCH_TO_MOOLA.md)

---

### Option 2: Official AAVE (When Available)

If AAVE V3 gets deployed on Celo in the future, you can find addresses at:

1. **Aave Address Book by BGD Labs**
   - GitHub: https://github.com/bgd-labs/aave-address-book
   - Contains all AAVE contract addresses across networks

2. **Aave Official Documentation**
   - Smart Contracts: https://aave.com/docs/aave-v3/smart-contracts/pool-addresses-provider
   - Deployed Contracts: https://docs.aave.com/developers/deployed-contracts

3. **Query On-Chain** (If you have PoolAddressesProvider address)
   ```javascript
   const poolAddrProvider = new ethers.Contract(
     "POOL_ADDRESSES_PROVIDER_ADDRESS",
     ["function getAddress(bytes32 id) view returns (address)"],
     provider
   );
   const id = ethers.utils.id("ProtocolDataProvider");
   const dataProviderAddress = await poolAddrProvider.getAddress(id);
   ```

4. **Blockchain Explorers**
   - CeloScan: https://celoscan.io
   - Search for "Aave" or "PoolAddressesProvider" contracts

---

## 🔧 How to Use in Your Project

1. **Create or update `.env` file** in your project root:

```bash
# For Testnet (Alfajores)
NEXT_PUBLIC_LENDING_POOL_ADDRESS=0x0886f74eEEc443fBb6907fB5528B57C28E813129
NEXT_PUBLIC_AAVE_DATA_PROVIDER_ADDRESS=0x43d067ed784D9DD2ffEda73775e2CC4c560103A1
CELO_RPC_URL=https://alfajores-forno.celo-testnet.org

# For Mainnet
# NEXT_PUBLIC_LENDING_POOL_ADDRESS=0xc1548F5AA1D76CDcAB7385FA6B5cEA70f941e535
# NEXT_PUBLIC_AAVE_DATA_PROVIDER_ADDRESS=0x31ccB9dC068058672D96E92BAf96B1607855822E
# CELO_RPC_URL=https://forno.celo.org
```

2. **The code will automatically use these values** from `lib/aave-helper.ts`

3. **Restart your dev server** after updating `.env`

---

## 📚 Additional Resources

- **Moola Market**: https://moola.market
- **Moola Docs**: https://docs.moola.market
- **Moola Discord**: https://discord.gg/moola
- **Celo Faucet** (for testnet tokens): https://faucet.celo.org/alfajores

---

## ✅ Quick Start

1. Copy the Moola Market addresses above
2. Add them to your `.env` file
3. Restart your Next.js dev server
4. The hub assets and position sync will now work with real blockchain data!

