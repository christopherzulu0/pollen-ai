import { ethers } from 'ethers';

// Aave/Moola Market Lending Pool Address on Celo
// Note: AAVE V3 is not deployed on Celo. Use Moola Market (AAVE V2 fork) instead.
// Moola Market addresses:
// - Alfajores (Testnet): Lending Pool: 0x0886f74eEEc443fBb6907fB5528B57C28E813129
// - Alfajores (Testnet): Data Provider: 0x43d067ed784D9DD2ffEda73775e2CC4c560103A1
// - Mainnet: Lending Pool: 0xc1548F5AA1D76CDcAB7385FA6B5cEA70f941e535
// - Mainnet: Data Provider: 0x31ccB9dC068058672D96E92BAf96B1607855822E
const AAVE_LENDING_POOL_ADDRESS = 
  process.env.NEXT_PUBLIC_AAVE_LENDING_POOL_ADDRESS || 
  process.env.NEXT_PUBLIC_LENDING_POOL_ADDRESS || 
  '0x...';
const AAVE_DATA_PROVIDER_ADDRESS = 
  process.env.NEXT_PUBLIC_AAVE_DATA_PROVIDER_ADDRESS || 
  process.env.NEXT_PUBLIC_LENDING_POOL_DATA_PROVIDER || 
  '0x...';

// Determine network from environment or default to alfajores
const getNetworkConfig = () => {
  const network = process.env.NEXT_PUBLIC_CELO_NETWORK || process.env.CELO_NETWORK || 'alfajores';
  
  if (network === 'mainnet') {
    return {
      name: 'Celo Mainnet',
      chainId: 42220,
      rpcUrl: process.env.CELO_RPC_URL || process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://forno.celo.org',
    };
  }
  
  // Default to alfajores testnet
  return {
    name: 'Alfajores Testnet',
    chainId: 44787,
    rpcUrl: process.env.CELO_RPC_URL || process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://alfajores-forno.celo-testnet.org',
  };
};

// Simplified ABI for Aave Lending Pool
const LENDING_POOL_ABI = [
  'function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)',
  'function withdraw(address asset, uint256 amount, address to) returns (uint256)',
  'function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)',
  'function repay(address asset, uint256 amount, uint256 rateMode, address onBehalfOf) returns (uint256)',
  'function getUserAccountData(address user) view returns (uint256 totalCollateralETH, uint256 totalDebtETH, uint256 availableBorrowsETH, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)',
];

// Simplified ABI for Data Provider
const DATA_PROVIDER_ABI = [
  'function getUserReserveData(address asset, address user) view returns (uint256 currentATokenBalance, uint256 currentStableDebt, uint256 currentVariableDebt, uint256 principalStableDebt, uint256 scaledVariableDebt, uint256 stableBorrowRate, uint256 liquidityRate, uint40 stableRateLastUpdated, bool usageAsCollateralEnabled)',
  'function getReserveData(address asset) view returns (uint256 availableLiquidity, uint256 totalStableDebt, uint256 totalVariableDebt, uint256 liquidityRate, uint256 variableBorrowRate, uint256 stableBorrowRate, uint256 averageStableBorrowRate, uint256 liquidityIndex, uint256 variableBorrowIndex, uint40 lastUpdateTimestamp)',
];

// ERC20 ABI
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

// Token addresses on Celo Alfajores (you'll need to update these)
export const TOKENS = {
  cUSD: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', // Celo Dollar on Alfajores
  CELO: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9', // CELO on Alfajores
  cEUR: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F', // Celo Euro on Alfajores
};

export interface UserAccountData {
  totalCollateralETH: string;
  totalDebtETH: string;
  availableBorrowsETH: string;
  currentLiquidationThreshold: string;
  ltv: string;
  healthFactor: string;
}

export interface ReserveData {
  availableLiquidity: string;
  totalStableDebt: string;
  totalVariableDebt: string;
  liquidityRate: string;
  variableBorrowRate: string;
  stableBorrowRate: string;
}

export interface UserReserveData {
  currentATokenBalance: string;
  currentStableDebt: string;
  currentVariableDebt: string;
  liquidityRate: string;
  stableBorrowRate: string;
  usageAsCollateralEnabled: boolean;
}

/**
 * Get provider for Celo network
 * Uses StaticJsonRpcProvider to avoid network detection issues
 */
export function getProvider(): ethers.providers.StaticJsonRpcProvider {
  const networkConfig = getNetworkConfig();
  
  // Use StaticJsonRpcProvider which doesn't try to auto-detect network
  // This prevents "could not detect network" errors
  // StaticJsonRpcProvider takes (url, network) where network is { name, chainId }
  return new ethers.providers.StaticJsonRpcProvider(
    networkConfig.rpcUrl,
    {
      name: networkConfig.name,
      chainId: networkConfig.chainId,
    }
  );
}

/**
 * Get signer from private key (for server-side operations)
 */
export function getSigner(privateKey: string): ethers.Wallet {
  const provider = getProvider();
  return new ethers.Wallet(privateKey, provider);
}

/**
 * Get Lending Pool contract instance
 */
export function getLendingPoolContract(signerOrProvider: ethers.Signer | ethers.providers.Provider): ethers.Contract {
  return new ethers.Contract(AAVE_LENDING_POOL_ADDRESS, LENDING_POOL_ABI, signerOrProvider);
}

/**
 * Get Data Provider contract instance
 */
export function getDataProviderContract(provider: ethers.providers.Provider | ethers.providers.StaticJsonRpcProvider): ethers.Contract {
  return new ethers.Contract(AAVE_DATA_PROVIDER_ADDRESS, DATA_PROVIDER_ABI, provider);
}

/**
 * Get ERC20 token contract instance
 */
export function getTokenContract(tokenAddress: string, signerOrProvider: ethers.Signer | ethers.providers.Provider | ethers.providers.StaticJsonRpcProvider): ethers.Contract {
  return new ethers.Contract(tokenAddress, ERC20_ABI, signerOrProvider);
}

/**
 * Approve token spending
 */
export async function approveToken(
  tokenAddress: string,
  spenderAddress: string,
  amount: string,
  signer: ethers.Signer
): Promise<ethers.ContractTransactionReceipt | null> {
  const tokenContract = getTokenContract(tokenAddress, signer);
  const tx = await tokenContract.approve(spenderAddress, ethers.parseUnits(amount, 18));
  return await tx.wait();
}

/**
 * Deposit collateral to Aave
 */
export async function depositCollateral(
  assetAddress: string,
  amount: string,
  signer: ethers.Signer
): Promise<ethers.ContractTransactionReceipt | null> {
  const userAddress = await signer.getAddress();
  
  // First approve the lending pool to spend tokens
  await approveToken(assetAddress, AAVE_LENDING_POOL_ADDRESS, amount, signer);
  
  // Then deposit
  const lendingPool = getLendingPoolContract(signer);
  const amountInWei = ethers.parseUnits(amount, 18);
  const tx = await lendingPool.deposit(assetAddress, amountInWei, userAddress, 0);
  return await tx.wait();
}

/**
 * Withdraw collateral from Aave
 */
export async function withdrawCollateral(
  assetAddress: string,
  amount: string,
  signer: ethers.Signer
): Promise<ethers.ContractTransactionReceipt | null> {
  const userAddress = await signer.getAddress();
  const lendingPool = getLendingPoolContract(signer);
  const amountInWei = ethers.parseUnits(amount, 18);
  const tx = await lendingPool.withdraw(assetAddress, amountInWei, userAddress);
  return await tx.wait();
}

/**
 * Borrow from Aave
 * @param interestRateMode - 1 for stable, 2 for variable
 */
export async function borrowFromAave(
  assetAddress: string,
  amount: string,
  interestRateMode: 1 | 2,
  signer: ethers.Signer
): Promise<ethers.ContractTransactionReceipt | null> {
  const userAddress = await signer.getAddress();
  const lendingPool = getLendingPoolContract(signer);
  const amountInWei = ethers.parseUnits(amount, 18);
  const tx = await lendingPool.borrow(assetAddress, amountInWei, interestRateMode, 0, userAddress);
  return await tx.wait();
}

/**
 * Repay loan to Aave
 * @param rateMode - 1 for stable, 2 for variable
 */
export async function repayLoan(
  assetAddress: string,
  amount: string,
  rateMode: 1 | 2,
  signer: ethers.Signer
): Promise<ethers.ContractTransactionReceipt | null> {
  const userAddress = await signer.getAddress();
  
  // First approve the lending pool to spend tokens
  await approveToken(assetAddress, AAVE_LENDING_POOL_ADDRESS, amount, signer);
  
  // Then repay
  const lendingPool = getLendingPoolContract(signer);
  const amountInWei = ethers.parseUnits(amount, 18);
  const tx = await lendingPool.repay(assetAddress, amountInWei, rateMode, userAddress);
  return await tx.wait();
}

/**
 * Get user account data from Aave
 */
export async function getUserAccountData(userAddress: string): Promise<UserAccountData> {
  const provider = getProvider();
  const lendingPool = getLendingPoolContract(provider);
  
  const data = await lendingPool.getUserAccountData(userAddress);
  
  return {
    totalCollateralETH: ethers.formatUnits(data[0], 18),
    totalDebtETH: ethers.formatUnits(data[1], 18),
    availableBorrowsETH: ethers.formatUnits(data[2], 18),
    currentLiquidationThreshold: ethers.formatUnits(data[3], 2),
    ltv: ethers.formatUnits(data[4], 2),
    healthFactor: ethers.formatUnits(data[5], 18),
  };
}

/**
 * Get reserve data for a specific asset
 * Returns null if the reserve doesn't exist or call fails
 */
export async function getReserveData(assetAddress: string): Promise<ReserveData | null> {
  try {
    const provider = getProvider();
    const dataProvider = getDataProviderContract(provider);
    
    // Check if contract addresses are configured
    if (!AAVE_DATA_PROVIDER_ADDRESS || AAVE_DATA_PROVIDER_ADDRESS === '0x...') {
      return null;
    }
    
    const data = await dataProvider.getReserveData(assetAddress);
    
    return {
      availableLiquidity: ethers.formatUnits(data[0], 18),
      totalStableDebt: ethers.formatUnits(data[1], 18),
      totalVariableDebt: ethers.formatUnits(data[2], 18),
      liquidityRate: ethers.formatUnits(data[3], 27), // Ray units
      variableBorrowRate: ethers.formatUnits(data[4], 27),
      stableBorrowRate: ethers.formatUnits(data[5], 27),
    };
  } catch (error: any) {
    // Reserve doesn't exist or contract call failed - return null instead of throwing
    // This allows the caller to handle gracefully without fallback data
    return null;
  }
}

/**
 * Get user reserve data for a specific asset
 * Returns null if the reserve doesn't exist or call fails
 */
export async function getUserReserveData(assetAddress: string, userAddress: string): Promise<UserReserveData | null> {
  try {
    const provider = getProvider();
    const dataProvider = getDataProviderContract(provider);
    
    // Check if contract addresses are configured
    if (!AAVE_DATA_PROVIDER_ADDRESS || AAVE_DATA_PROVIDER_ADDRESS === '0x...') {
      return null;
    }
    
    const data = await dataProvider.getUserReserveData(assetAddress, userAddress);
    
    return {
      currentATokenBalance: ethers.formatUnits(data[0], 18),
      currentStableDebt: ethers.formatUnits(data[1], 18),
      currentVariableDebt: ethers.formatUnits(data[2], 18),
      liquidityRate: ethers.formatUnits(data[6], 27),
      stableBorrowRate: ethers.formatUnits(data[5], 27),
      usageAsCollateralEnabled: data[8],
    };
  } catch (error: any) {
    // Reserve doesn't exist or contract call failed - return null instead of throwing
    return null;
  }
}

/**
 * Calculate health factor color
 */
export function getHealthFactorColor(healthFactor: string): string {
  const hf = parseFloat(healthFactor);
  if (hf >= 2) return 'text-emerald-600 bg-emerald-50';
  if (hf >= 1.5) return 'text-green-600 bg-green-50';
  if (hf >= 1.1) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
}

/**
 * Calculate health factor status
 */
export function getHealthFactorStatus(healthFactor: string): string {
  const hf = parseFloat(healthFactor);
  if (hf >= 2) return 'Excellent';
  if (hf >= 1.5) return 'Good';
  if (hf >= 1.1) return 'Fair';
  return 'At Risk';
}

/**
 * Format APY percentage
 */
export function formatAPY(rate: string): string {
  const rateNumber = parseFloat(rate) * 100;
  return rateNumber.toFixed(2);
}

