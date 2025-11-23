/**
 * Celo Smart Contract Utilities
 * Helper functions for interacting with Celo smart contracts
 */

import { ethers } from 'ethers'
import { STABLE_TOKEN_ADDRESSES, CELO_NETWORKS, getCurrentNetwork } from './utils'

// ERC20 Token ABI (minimal for balance/transfer)
export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
] as const

/**
 * Get ERC20 token contract instance
 */
export function getTokenContract(
  tokenAddress: string,
  provider: ethers.providers.Provider | ethers.Signer
): ethers.Contract {
  return new ethers.Contract(tokenAddress, ERC20_ABI, provider)
}

/**
 * Get stable token address for a given network and currency
 */
export function getStableTokenAddress(
  network: string,
  currency: 'cUSD' | 'cEUR'
): string | null {
  const networkAddresses = STABLE_TOKEN_ADDRESSES[network as keyof typeof STABLE_TOKEN_ADDRESSES]
  if (!networkAddresses) return null
  
  return networkAddresses[currency] || null
}

/**
 * Get token balance for an address
 */
export async function getTokenBalance(
  tokenAddress: string,
  walletAddress: string,
  provider: ethers.providers.Provider
): Promise<{ balance: ethers.BigNumber; formatted: string }> {
  try {
    const contract = getTokenContract(tokenAddress, provider)
    const balance = await contract.balanceOf(walletAddress)
    const decimals = await contract.decimals()
    const formatted = ethers.utils.formatUnits(balance, decimals)
    
    return { balance, formatted }
  } catch (error: any) {
    console.error(`Error fetching token balance for ${tokenAddress}:`, error)
    throw new Error(`Failed to fetch token balance: ${error.message}`)
  }
}

/**
 * Create transfer transaction for ERC20 token
 */
export async function createTokenTransfer(
  tokenAddress: string,
  to: string,
  amount: string,
  signer: ethers.Signer,
  decimals: number = 18
): Promise<ethers.providers.TransactionResponse> {
  try {
    const contract = getTokenContract(tokenAddress, signer)
    const amountWei = ethers.utils.parseUnits(amount, decimals)
    
    const tx = await contract.transfer(to, amountWei)
    return tx
  } catch (error: any) {
    console.error('Error creating token transfer:', error)
    throw new Error(`Failed to create transfer: ${error.message}`)
  }
}

/**
 * Create CELO transfer transaction
 */
export async function createCeloTransfer(
  to: string,
  amount: string,
  signer: ethers.Signer
): Promise<ethers.providers.TransactionResponse> {
  try {
    const amountWei = ethers.utils.parseEther(amount)
    
    const tx = await signer.sendTransaction({
      to,
      value: amountWei,
    })
    
    return tx
  } catch (error: any) {
    console.error('Error creating CELO transfer:', error)
    throw new Error(`Failed to create CELO transfer: ${error.message}`)
  }
}

/**
 * Estimate gas for a transaction
 */
export async function estimateGas(
  transaction: ethers.providers.TransactionRequest,
  provider: ethers.providers.Provider
): Promise<ethers.BigNumber> {
  try {
    const gasEstimate = await provider.estimateGas(transaction)
    // Add 20% buffer for safety
    return gasEstimate.mul(120).div(100)
  } catch (error: any) {
    console.error('Error estimating gas:', error)
    throw new Error(`Failed to estimate gas: ${error.message}`)
  }
}

/**
 * Get token info (name, symbol, decimals)
 */
export async function getTokenInfo(
  tokenAddress: string,
  provider: ethers.providers.Provider
): Promise<{ name: string; symbol: string; decimals: number }> {
  try {
    const contract = getTokenContract(tokenAddress, provider)
    
    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
    ])
    
    return {
      name,
      symbol,
      decimals,
    }
  } catch (error: any) {
    console.error('Error fetching token info:', error)
    throw new Error(`Failed to fetch token info: ${error.message}`)
  }
}

/**
 * Check if a transaction is confirmed
 */
export async function isTransactionConfirmed(
  txHash: string,
  provider: ethers.providers.Provider,
  confirmations: number = 1
): Promise<boolean> {
  try {
    const receipt = await provider.getTransactionReceipt(txHash)
    if (!receipt) return false
    
    const currentBlock = await provider.getBlockNumber()
    return currentBlock - receipt.blockNumber >= confirmations
  } catch (error) {
    return false
  }
}

/**
 * Get transaction receipt with retries
 */
export async function getTransactionReceipt(
  txHash: string,
  provider: ethers.providers.Provider,
  maxRetries: number = 10,
  delayMs: number = 2000
): Promise<ethers.providers.TransactionReceipt | null> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const receipt = await provider.getTransactionReceipt(txHash)
      if (receipt) return receipt
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delayMs))
    } catch (error) {
      console.error(`Error fetching receipt (attempt ${i + 1}):`, error)
    }
  }
  
  return null
}

