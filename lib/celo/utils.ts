import { formatUnits, parseUnits } from 'ethers/lib/utils'

/**
 * Celo Network Configuration
 */
export const CELO_NETWORKS = {
  alfajores: {
    name: 'Alfajores Testnet',
    rpcUrl: process.env.CELO_RPC_URL || process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://alfajores.blockpi.network/v1/rpc/public',
    // Fallback RPC URLs - using more reliable public endpoints
    fallbackRpcUrls: [
      'https://alfajores.blockpi.network/v1/rpc/public',
      'https://celo-alfajores-rpc.publicnode.com',
      'https://alfajores-forno.celo-testnet.org',
      'https://1rpc.io/celo/alfajores',
    ],
    chainId: 44787,
    explorer: 'https://alfajores-blockscout.celo-testnet.org',
    faucet: 'https://faucet.celo.org/alfajores',
  },
  mainnet: {
    name: 'Celo Mainnet',
    rpcUrl: process.env.CELO_RPC_URL || process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://forno.celo.org',
    // Fallback RPC URLs - using more reliable public endpoints
    fallbackRpcUrls: [
      'https://forno.celo.org',
      'https://rpc.ankr.com/celo',
      'https://celo.blockpi.network/v1/rpc/public',
      'https://1rpc.io/celo',
      'https://celo-mainnet-rpc.publicnode.com',
    ],
    chainId: 42220,
    explorer: 'https://explorer.celo.org',
  },
} as const

export type CeloNetwork = keyof typeof CELO_NETWORKS

/**
 * StableToken Contract Addresses
 */
export const STABLE_TOKEN_ADDRESSES = {
  alfajores: {
    cUSD: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
    cEUR: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
  },
  mainnet: {
    cUSD: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    cEUR: '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73',
  },
} as const

/**
 * Format Wei to readable amount
 */
export function formatCeloAmount(wei: string, decimals: number = 18): string {
  try {
    return formatUnits(wei, decimals)
  } catch {
    return '0'
  }
}

/**
 * Parse readable amount to Wei
 */
export function parseCeloAmount(amount: string, decimals: number = 18): string {
  try {
    return parseUnits(amount, decimals).toString()
  } catch {
    return '0'
  }
}

/**
 * Validate Celo address
 */
export function isValidCeloAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Get network from chain ID (supports both number and string)
 */
export function getNetworkFromChainId(chainId: number | string): CeloNetwork | null {
  let chainIdNum: number
  
  if (typeof chainId === 'string') {
    // Try parsing as hex first (0x prefix), then decimal
    if (chainId.startsWith('0x')) {
      chainIdNum = parseInt(chainId, 16)
    } else {
      chainIdNum = parseInt(chainId, 10)
    }
  } else {
    chainIdNum = chainId
  }
  
  // Handle NaN
  if (isNaN(chainIdNum)) {
    return null
  }
  
  if (chainIdNum === 44787) return 'alfajores'
  if (chainIdNum === 42220) return 'mainnet'
  return null
}

/**
 * Get current network (from env or default to testnet)
 */
export function getCurrentNetwork(): CeloNetwork {
  const envNetwork = process.env.NEXT_PUBLIC_CELO_NETWORK as CeloNetwork
  return envNetwork && (envNetwork === 'alfajores' || envNetwork === 'mainnet')
    ? envNetwork
    : 'alfajores'
}

/**
 * Convert Wei to CELO/cUSD/cEUR
 */
export function weiToToken(wei: string, decimals: number = 18): number {
  try {
    return parseFloat(formatUnits(wei, decimals))
  } catch {
    return 0
  }
}

/**
 * Convert token amount to Wei
 */
export function tokenToWei(amount: string | number, decimals: number = 18): string {
  try {
    return parseUnits(amount.toString(), decimals).toString()
  } catch {
    return '0'
  }
}

/**
 * Format transaction hash for display
 */
export function formatTxHash(hash: string, length: number = 8): string {
  if (!hash) return ''
  return `${hash.substring(0, length)}...${hash.substring(hash.length - length)}`
}

/**
 * Get explorer URL for transaction
 */
export function getExplorerUrl(network: CeloNetwork, type: 'tx' | 'address', value: string): string {
  const networkConfig = CELO_NETWORKS[network]
  const baseUrl = networkConfig.explorer || `https://explorer.celo.org`

  if (type === 'tx') {
    return `${baseUrl}/tx/${value}`
  }
  return `${baseUrl}/address/${value}`
}

