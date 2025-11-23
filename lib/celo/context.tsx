"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { getCurrentNetwork, isValidCeloAddress, CELO_NETWORKS } from './utils'

interface CeloWalletContextType {
  // Wallet state
  address: string | null
  isConnected: boolean
  network: string | null
  balance: {
    celo: string
    cusd: string
    ceur: string
  }
  formattedBalance: {
    celo: string
    cusd: string
    ceur: string
  }
  
  // Wallet methods
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchNetwork: () => Promise<void>
  refreshBalance: () => Promise<void>
  
  // Provider
  provider: ethers.providers.Web3Provider | null
  signer: ethers.Signer | null
  
  // Status
  isLoading: boolean
  error: string | null
}

const CeloWalletContext = createContext<CeloWalletContextType | undefined>(undefined)

export function CeloWalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [network, setNetwork] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [balance, setBalance] = useState({ celo: '0', cusd: '0', ceur: '0' })
  const [formattedBalance, setFormattedBalance] = useState({ celo: '0', cusd: '0', ceur: '0' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if wallet is already connected
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        await connectWallet()
      }
    } catch (err) {
      console.error('Error checking connection:', err)
    }
  }

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('Please install MetaMask or a Celo-compatible wallet')
      setIsLoading(false)
      throw new Error('Wallet not installed')
    }

    setIsLoading(true)
    setError(null)

    try {
      // Request account access
      let accounts
      try {
        accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
      } catch (requestError: any) {
        // Handle MetaMask/user rejection
        console.error('MetaMask request error:', requestError)
        
        if (requestError.code === 4001) {
          throw new Error('Connection rejected. Please approve the connection in your wallet.')
        } else if (requestError.code === -32002) {
          throw new Error('Connection request already pending. Please check your wallet.')
        } else if (requestError.message) {
          throw new Error(`Wallet connection failed: ${requestError.message}`)
        } else {
          throw new Error('Failed to connect wallet. Please check your wallet and try again.')
        }
      }

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet.')
      }

      const account = accounts[0]
      
      if (!isValidCeloAddress(account)) {
        throw new Error('Invalid address')
      }

      // Create provider
      let web3Provider
      let web3Signer
      let network
      let networkName

      try {
        // Check if ethers is available
        if (!ethers || !ethers.providers) {
          throw new Error('Ethers.js library is not loaded. Please refresh the page.')
        }

        web3Provider = new ethers.providers.Web3Provider(window.ethereum)
        web3Signer = web3Provider.getSigner()

        // Get network
        network = await web3Provider.getNetwork()
        networkName = network.chainId === 44787 ? 'alfajores' : 
                       network.chainId === 42220 ? 'mainnet' : 
                       'unknown'

        // Check if correct network - warn but don't block connection
        if (network.chainId !== 44787 && network.chainId !== 42220) {
          console.warn('Wallet is not on Celo network. Current chain ID:', network.chainId)
          // Don't set error here, just log it - user can switch later
        }
      } catch (providerError: any) {
        console.error('Error creating provider:', providerError)
        throw new Error(`Failed to initialize wallet provider: ${providerError.message || 'Unknown error'}`)
      }

      setAddress(account)
      setProvider(web3Provider)
      setSigner(web3Signer)
      setNetwork(networkName)
      setIsConnected(true)

      // Fetch initial balance (non-blocking - don't fail connection if balance fetch fails)
      refreshBalance(web3Provider, account, networkName).catch((balanceErr) => {
        console.warn('Balance fetch failed (non-critical):', balanceErr)
        // Connection still succeeds, balance will be 0 initially
      })

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      // Save to localStorage
      localStorage.setItem('celo_wallet_address', account)
    } catch (err: any) {
      console.error('Error connecting wallet:', err)
      console.error('Error type:', typeof err)
      console.error('Error keys:', err ? Object.keys(err) : 'no keys')
      console.error('Error stringified:', JSON.stringify(err, null, 2))
      
      // Handle specific MetaMask errors
      let errorMessage = 'Failed to connect wallet. Please try again.'
      
      // Check error code first (MetaMask specific codes)
      if (err?.code === 4001) {
        // User rejected the request
        errorMessage = 'Connection rejected. Please approve the connection in your wallet.'
      } else if (err?.code === -32002) {
        // Request already pending
        errorMessage = 'Connection request already pending. Please check your wallet.'
      } else if (err?.code === 'UNSUPPORTED_OPERATION') {
        // Wrong network or provider issue
        errorMessage = 'Please ensure you are connected to Celo network (Alfajores or Mainnet).'
      } 
      // Check for error message
      else if (err?.message) {
        errorMessage = err.message
      } 
      // Check for nested error
      else if (err?.error?.message) {
        errorMessage = err.error.message
      } 
      // Check if error is a string
      else if (typeof err === 'string') {
        errorMessage = err
      }
      // Try to extract meaningful info from error object
      else if (err && typeof err === 'object') {
        const errorStr = JSON.stringify(err)
        if (errorStr !== '{}') {
          errorMessage = `Connection error: ${errorStr}`
        }
      }
      
      setError(errorMessage)
      setIsConnected(false)
      throw new Error(errorMessage) // Re-throw so button component can handle it
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      setAddress(accounts[0])
      refreshBalance()
    }
  }

  const handleChainChanged = () => {
    window.location.reload()
  }

  const disconnectWallet = () => {
    setAddress(null)
    setIsConnected(false)
    setProvider(null)
    setSigner(null)
    setNetwork(null)
    setBalance({ celo: '0', cusd: '0', ceur: '0' })
    setFormattedBalance({ celo: '0', cusd: '0', ceur: '0' })
    localStorage.removeItem('celo_wallet_address')

    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }

  const switchNetwork = async () => {
    if (!window.ethereum) return

    const targetNetwork = getCurrentNetwork()
    const targetChainId = CELO_NETWORKS[targetNetwork].chainId

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })
    } catch (switchError: any) {
      // If chain doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: CELO_NETWORKS[targetNetwork].name,
                nativeCurrency: {
                  name: 'CELO',
                  symbol: 'CELO',
                  decimals: 18,
                },
                rpcUrls: [CELO_NETWORKS[targetNetwork].rpcUrl],
                blockExplorerUrls: [CELO_NETWORKS[targetNetwork].explorer],
              },
            ],
          })
        } catch (addError) {
          console.error('Error adding network:', addError)
        }
      }
    }
  }

  const refreshBalance = useCallback(async (
    customProvider?: ethers.providers.Web3Provider,
    customAddress?: string,
    customNetwork?: string
  ) => {
    if (!provider && !customProvider) {
      console.warn('No provider available for balance refresh')
      return
    }
    if (!address && !customAddress) {
      console.warn('No address available for balance refresh')
      return
    }

    const prov = customProvider || provider!
    const addr = customAddress || address!
    const net = customNetwork || network || getCurrentNetwork()

    // Validate address format
    if (!isValidCeloAddress(addr)) {
      console.error('Invalid Celo address:', addr)
      return
    }

    try {
      // Wait a bit to ensure provider is ready
      await new Promise(resolve => setTimeout(resolve, 200))

      // Verify provider is ready and has required methods
      if (!prov) {
        console.warn('Provider not available for balance fetch')
        return
      }

      if (typeof prov.getBalance !== 'function') {
        console.warn('Provider.getBalance is not a function')
        return
      }

      // Validate address before making the call
      if (!addr || typeof addr !== 'string' || !addr.startsWith('0x') || addr.length !== 42) {
        console.error('Invalid address format:', addr)
        return
      }

      // Get CELO balance with better error handling
      let celoBalance
      let celoFormatted = '0'

      try {
        // Try to get network info first to verify provider is connected
        let isCorrectNetwork = false
        try {
          const currentNetwork = await prov.getNetwork()
          const chainId = currentNetwork.chainId
          
          console.log('Current network:', {
            chainId: chainId.toString(),
            name: currentNetwork.name,
          })
          
          // Check if on Celo network
          isCorrectNetwork = chainId === 44787 || chainId === 42220
          
          if (!isCorrectNetwork) {
            console.warn('Not on Celo network. Chain ID:', chainId)
            console.warn('Please switch to Celo network (Alfajores or Mainnet)')
            // Still try to get balance, but it might fail
          }
        } catch (networkError: any) {
          console.warn('Could not get network info:', networkError)
          // Continue anyway - might still work
        }

        // Fetch balance with timeout
        try {
          // Verify provider has the method
          if (typeof prov.getBalance !== 'function') {
            throw new Error('Provider.getBalance is not a function')
          }

          console.log('Fetching balance for address:', addr)
          console.log('Provider type:', prov.constructor?.name)
          
          // Call getBalance - but first verify network is correct
          // If not on Celo network, the call will likely fail
          if (!isCorrectNetwork) {
            console.warn('Skipping balance fetch - not on Celo network')
            console.warn('Please switch to Celo network (Alfajores or Mainnet) in MetaMask')
            return
          }

          // Call getBalance with better error handling
          try {
            console.log('Calling getBalance for:', addr.substring(0, 10) + '...')
            
            // Use a simpler approach - just call getBalance directly
            const balanceResult = await prov.getBalance(addr)
            
            if (!balanceResult) {
              console.warn('getBalance returned null/undefined')
              return
            }
            
            celoBalance = balanceResult
            console.log('Balance fetched successfully:', celoBalance?.toString())
          } catch (directError: any) {
            // The error object might be empty - that's okay, just handle it gracefully
            const hasMessage = directError?.message
            const hasString = directError?.toString && directError.toString() !== '[object Object]'
            const errorStr = hasMessage || (hasString ? directError.toString() : 'Unknown error')
            
            console.warn('Balance fetch failed:', errorStr)
            
            // Don't throw - just return early. This is non-critical.
            // The wallet connection still works, balance will just show 0.
            return
          }
          
          // Validate balance result
          if (celoBalance === null || celoBalance === undefined) {
            throw new Error('Balance result is null or undefined')
          }
        } catch (rpcError: any) {
          // Handle RPC-specific errors - suppress empty object errors
          // This is non-critical - wallet connection still works
          const hasErrorInfo = rpcError && (
            rpcError.message || 
            rpcError.code !== undefined ||
            (rpcError.toString && rpcError.toString() !== '[object Object]')
          )
          
          if (hasErrorInfo) {
            console.warn('Balance fetch error:', rpcError.message || rpcError.code || rpcError.toString())
          } else {
            // Empty error object - likely a silent failure, just log a warning
            console.warn('Balance fetch failed (empty error - likely network/provider issue)')
          }
          
          // Return silently - don't throw. This is non-critical.
          return
        }

        // Check if ethers.utils is available
        if (ethers && ethers.utils && typeof ethers.utils.formatEther === 'function') {
          celoFormatted = ethers.utils.formatEther(celoBalance)
        } else {
          // Fallback: manually convert from wei to ether
          const weiAmount = celoBalance.toString()
          const weiBigInt = BigInt(weiAmount)
          const etherAmount = Number(weiBigInt) / 1e18
          celoFormatted = etherAmount.toFixed(18).replace(/\.?0+$/, '')
        }
      } catch (balanceError: any) {
        // More detailed error logging
        const errorInfo: any = {
          errorExists: !!balanceError,
          errorType: typeof balanceError,
        }
        
        // Try to extract error information using multiple methods
        if (balanceError) {
          errorInfo.stringified = String(balanceError)
          errorInfo.constructor = balanceError.constructor?.name
          
          // Try to get error properties using different methods
          try {
            if (balanceError.message) errorInfo.message = balanceError.message
            if (balanceError.code !== undefined) errorInfo.code = balanceError.code
            if (balanceError.data) errorInfo.data = balanceError.data
            if (balanceError.stack) errorInfo.stack = balanceError.stack
            if (balanceError.reason) errorInfo.reason = balanceError.reason
            if (balanceError.name) errorInfo.name = balanceError.name
            
            // Try JSON stringify
            try {
              errorInfo.jsonStringified = JSON.stringify(balanceError, Object.getOwnPropertyNames(balanceError))
            } catch (e) {
              errorInfo.jsonStringifyFailed = true
            }
            
            // Get all keys
            try {
              errorInfo.allKeys = Object.keys(balanceError)
              errorInfo.ownPropertyNames = Object.getOwnPropertyNames(balanceError)
            } catch (e) {
              errorInfo.keysExtractionFailed = true
            }
            
            // Check for nested error
            if (balanceError.error) {
              errorInfo.nestedError = balanceError.error
            }
          } catch (extractError) {
            errorInfo.extractionError = String(extractError)
          }
        }

        console.error('Error fetching CELO balance:', balanceError)
        console.error('Balance error details:', errorInfo)
        
        // Return early - don't update balance on error
        // This prevents UI from showing incorrect data
        console.warn('Balance fetch failed, keeping existing balance or using defaults')
        return
      }

      // Only set balance if we successfully fetched it
      if (celoBalance && celoFormatted) {

        // TODO: Get cUSD and cEUR balances via contract calls
        // For now, set to 0
        const cusdBalance = '0'
        const ceurBalance = '0'
        const cusdFormatted = '0'
        const ceurFormatted = '0'

        setBalance({
          celo: celoBalance.toString(),
          cusd: cusdBalance,
          ceur: ceurBalance,
        })
        setFormattedBalance({
          celo: celoFormatted,
          cusd: cusdFormatted,
          ceur: ceurFormatted,
        })
      }
    } catch (err: any) {
      console.error('Error fetching balance:', err)
      console.error('Error details:', {
        message: err?.message,
        code: err?.code,
        stack: err?.stack,
        error: JSON.stringify(err, null, 2)
      })
      
      // Set zero balances on error so UI doesn't break
      setBalance({
        celo: '0',
        cusd: '0',
        ceur: '0',
      })
      setFormattedBalance({
        celo: '0',
        cusd: '0',
        ceur: '0',
      })
    }
  }, [provider, address, network])

  // Periodic balance refresh
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(() => {
      refreshBalance()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [isConnected, refreshBalance])

  const value: CeloWalletContextType = {
    address,
    isConnected,
    network,
    balance,
    formattedBalance,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalance,
    provider,
    signer,
    isLoading,
    error,
  }

  return (
    <CeloWalletContext.Provider value={value}>
      {children}
    </CeloWalletContext.Provider>
  )
}

export function useCeloWallet() {
  const context = useContext(CeloWalletContext)
  if (context === undefined) {
    throw new Error('useCeloWallet must be used within a CeloWalletProvider')
  }
  return context
}

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

