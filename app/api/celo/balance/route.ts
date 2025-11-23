import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ethers } from 'ethers'
import { getCurrentNetwork, getNetworkFromChainId, CELO_NETWORKS, STABLE_TOKEN_ADDRESSES } from '@/lib/celo/utils'

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const address = searchParams.get('address')

    // Get wallet from database
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    })

    const walletAddress = address || wallet?.celoAddress

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address not found. Please connect your wallet first.' },
        { status: 404 }
      )
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      )
    }

    // Determine network - try to get from wallet, query param, or use default
    const { searchParams: params } = new URL(req.url)
    const chainIdParam = params.get('chainId')

    let network: keyof typeof CELO_NETWORKS = getCurrentNetwork()

    // Try to detect network from chainId if provided
    if (chainIdParam) {
      const detectedNetwork = getNetworkFromChainId(chainIdParam)
      if (detectedNetwork) {
        network = detectedNetwork
        console.log(`Network detected from chainId ${chainIdParam}: ${network}`)
      }
    }

    // Try to get network from wallet database
    if (wallet?.network) {
      const walletNetwork = wallet.network.toLowerCase()
      if (walletNetwork === 'alfajores' || walletNetwork === 'mainnet') {
        network = walletNetwork as keyof typeof CELO_NETWORKS
        console.log(`Network from wallet database: ${network}`)
      }
    }

    console.log(`Using network: ${network} for balance fetch`)

    const networkConfig = CELO_NETWORKS[network]

    if (!networkConfig) {
      console.error('Invalid network:', network)
      return NextResponse.json(
        { error: `Invalid network configuration: ${network}` },
        { status: 500 }
      )
    }

    // Get RPC URLs (primary and fallbacks)
    const rpcUrls = [
      networkConfig.rpcUrl,
      ...(networkConfig.fallbackRpcUrls || [])
    ].filter(Boolean)

    if (!rpcUrls || rpcUrls.length === 0) {
      return NextResponse.json(
        { error: 'No RPC URLs configured for this network' },
        { status: 500 }
      )
    }

    // Try each RPC URL until one works
    let provider: ethers.providers.JsonRpcProvider | null = null
    let lastError: Error | null = null
    const errors: string[] = []

    console.log(`Attempting to connect to ${rpcUrls.length} RPC endpoints for ${network}`)

    for (let i = 0; i < rpcUrls.length; i++) {
      const rpcUrl = rpcUrls[i]
      console.log(`Trying RPC endpoint ${i + 1}/${rpcUrls.length}: ${rpcUrl}`)
      
      try {
        provider = new ethers.providers.JsonRpcProvider(rpcUrl, {
          name: networkConfig.name,
          chainId: networkConfig.chainId,
        })

        // Test the connection with a simple call (eth_blockNumber is faster than getNetwork)
        const testPromise = provider.send('eth_blockNumber', [])
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('RPC connection timeout after 3 seconds')), 3000)
        )
        
        const blockNumber = await Promise.race([testPromise, timeoutPromise])
        console.log(`✅ RPC endpoint ${rpcUrl} connected successfully. Latest block:`, blockNumber)
        
        // If we get here, the RPC works
        break
      } catch (err: any) {
        const errorMsg = err?.message || err?.toString() || 'Unknown error'
        console.warn(`❌ RPC ${rpcUrl} failed:`, errorMsg)
        errors.push(`${rpcUrl}: ${errorMsg}`)
        lastError = err instanceof Error ? err : new Error(errorMsg)
        provider = null
        continue
      }
    }

    if (!provider) {
      console.error('❌ All RPC endpoints failed. Errors:', errors)
      console.error('Last error details:', {
        message: lastError?.message,
        stack: lastError?.stack,
        name: lastError?.name
      })
      
      // Fallback: Return cached balance from database if available
      if (wallet && (wallet.celoBalance || wallet.cusdBalance || wallet.ceurBalance)) {
        console.log('⚠️ Returning cached balance from database due to RPC failure')
        return NextResponse.json({
          celo: wallet.celoBalance?.toString() || '0',
          cusd: wallet.cusdBalance?.toString() || '0',
          ceur: wallet.ceurBalance?.toString() || '0',
          celoFormatted: wallet.celoBalance ? ethers.utils.formatEther(wallet.celoBalance.toString()) : '0',
          cusdFormatted: wallet.cusdBalance ? ethers.utils.formatUnits(wallet.cusdBalance.toString(), 18) : '0',
          ceurFormatted: wallet.ceurBalance ? ethers.utils.formatUnits(wallet.ceurBalance.toString(), 18) : '0',
          network: wallet.network || network,
          cached: true,
          warning: 'Using cached balance. RPC endpoints unavailable.'
        })
      }
      
      return NextResponse.json(
        {
          error: 'Unable to connect to Celo network',
          details: lastError?.message || 'All RPC endpoints failed',
          network,
          attemptedEndpoints: rpcUrls.length,
          errors: errors.slice(0, 3) // Return first 3 errors for debugging
        },
        { status: 503 } // Service Unavailable
      )
    }

    try {
      // Get CELO balance with timeout
      console.log(`Fetching balance for ${walletAddress.substring(0, 10)}... on ${network}`)

      const balancePromise = provider.getBalance(walletAddress)
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Balance fetch timeout after 8 seconds')), 8000)
      )

      const celoBalance = await Promise.race([balancePromise, timeoutPromise])
      const celoFormatted = ethers.utils.formatEther(celoBalance)

      console.log(`Balance fetched successfully: ${celoFormatted} CELO`)

      // Get cUSD balance (if stable token address exists)
      let cusdBalance = ethers.BigNumber.from(0)
      let cusdFormatted = '0'

      const cusdAddress = STABLE_TOKEN_ADDRESSES[network]?.cUSD
      if (cusdAddress && provider) {
        try {
          // ERC20 balanceOf ABI
          const erc20Abi = [
            'function balanceOf(address owner) view returns (uint256)',
            'function decimals() view returns (uint8)',
          ]
          const cusdContract = new ethers.Contract(cusdAddress, erc20Abi, provider)

          // Add timeout for contract calls
          const cusdBalancePromise = Promise.all([
            cusdContract.balanceOf(walletAddress),
            cusdContract.decimals()
          ])
          const cusdTimeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('cUSD balance fetch timeout')), 5000)
          )

          const [balance, decimals] = await Promise.race([cusdBalancePromise, cusdTimeoutPromise])
          cusdBalance = balance
          cusdFormatted = ethers.utils.formatUnits(cusdBalance, decimals)
        } catch (err: any) {
          console.warn('Failed to fetch cUSD balance:', err.message || err)
          // Continue with zero balance
        }
      }

      // Get cEUR balance
      let ceurBalance = ethers.BigNumber.from(0)
      let ceurFormatted = '0'

      const ceurAddress = STABLE_TOKEN_ADDRESSES[network]?.cEUR
      if (ceurAddress && provider) {
        try {
          const erc20Abi = [
            'function balanceOf(address owner) view returns (uint256)',
            'function decimals() view returns (uint8)',
          ]
          const ceurContract = new ethers.Contract(ceurAddress, erc20Abi, provider)

          // Add timeout for contract calls
          const ceurBalancePromise = Promise.all([
            ceurContract.balanceOf(walletAddress),
            ceurContract.decimals()
          ])
          const ceurTimeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('cEUR balance fetch timeout')), 5000)
          )

          const [balance, decimals] = await Promise.race([ceurBalancePromise, ceurTimeoutPromise])
          ceurBalance = balance
          ceurFormatted = ethers.utils.formatUnits(ceurBalance, decimals)
        } catch (err: any) {
          console.warn('Failed to fetch cEUR balance:', err.message || err)
          // Continue with zero balance
        }
      }

      // Update wallet in database with latest balances
      if (wallet) {
        await prisma.wallet.update({
          where: { userId },
          data: {
            celoBalance: celoBalance.toString(),
            cusdBalance: cusdBalance.toString(),
            ceurBalance: ceurBalance.toString(),
          },
        })
      }

      return NextResponse.json({
        celo: celoBalance.toString(),
        cusd: cusdBalance.toString(),
        ceur: ceurBalance.toString(),
        celoFormatted,
        cusdFormatted,
        ceurFormatted,
        network,
      })
    } catch (error: any) {
      console.error('Error fetching balance from blockchain:', error)
      return NextResponse.json(
        {
          error: 'Failed to fetch balance from blockchain',
          details: error.message
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error in balance API:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

