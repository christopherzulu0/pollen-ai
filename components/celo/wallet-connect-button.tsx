"use client"

import { useState, useEffect } from 'react'
import { useCeloWallet } from '@/lib/celo/context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Wallet,
  Loader2,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  LogOut,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatTxHash, getExplorerUrl } from '@/lib/celo/utils'
import { cn } from '@/lib/utils'

export function WalletConnectButton() {
  const {
    address,
    isConnected,
    network,
    formattedBalance,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalance,
  } = useCeloWallet()

  const [isConnecting, setIsConnecting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const isWalletInstalled = typeof window !== 'undefined' && window.ethereum

  const handleConnect = async () => {
    // Check if wallet is installed first
    if (!isWalletInstalled) {
      // Open dialog to show installation instructions
      return
    }

    setIsConnecting(true)
    
    try {
      await connectWallet()
      toast.success('Wallet connected successfully!')
    } catch (err: any) {
      console.error('Wallet connection error:', err)
      
      // Extract error message
      let errorMsg = 'Failed to connect wallet. Please try again.'
      
      if (err?.message) {
        errorMsg = err.message
      } else if (err?.error?.message) {
        errorMsg = err.error.message
      } else if (typeof err === 'string') {
        errorMsg = err
      } else if (err?.code === 4001) {
        errorMsg = 'Connection rejected. Please approve the connection in your wallet.'
      } else if (err?.code === -32002) {
        errorMsg = 'Connection request already pending. Please check your wallet.'
      }
      
      toast.error(errorMsg)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
    toast.info('Wallet disconnected')
  }

  const handleCopyAddress = async () => {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      toast.success('Address copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy address')
    }
  }

  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork()
      toast.success('Network switched successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to switch network')
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshBalance()
      toast.success('Balance refreshed!')
    } catch (err) {
      toast.error('Failed to refresh balance')
    } finally {
      setIsRefreshing(false)
    }
  }

  const truncateAddress = (addr: string | null) => {
    if (!addr) return ''
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  // Show error dialog if there's an error
  const showError = error && !isConnected

  if (isLoading && !isConnected) {
    return (
      <Button disabled variant="outline" className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="hidden md:inline">Connecting...</span>
      </Button>
    )
  }

  // Not connected state
  if (!isConnected) {
    // If wallet is installed, just show connect button
    if (isWalletInstalled) {
      return (
        <Button
          onClick={handleConnect}
          disabled={isConnecting || isLoading}
          variant="outline"
          className="gap-2 bg-gradient-to-r from-[#4C4EFB] to-[#6366F1] text-white border-none hover:opacity-90"
        >
          {isConnecting || isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden md:inline">Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4" />
              <span className="hidden md:inline">Connect Wallet</span>
              <span className="md:hidden">Connect</span>
            </>
          )}
        </Button>
      )
    }

    // If wallet is NOT installed, show dialog with instructions
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 bg-gradient-to-r from-[#4C4EFB] to-[#6366F1] text-white border-none hover:opacity-90"
          >
            <Wallet className="h-4 w-4" />
            <span className="hidden md:inline">Connect Wallet</span>
            <span className="md:hidden">Connect</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Your Wallet</DialogTitle>
            <DialogDescription>
              To use Celo blockchain features, you need to install a wallet extension.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Please install MetaMask or a Celo-compatible wallet to continue.
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-medium">Install a Wallet:</p>
              
              {/* MetaMask Option */}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">MetaMask</p>
                    <p className="text-xs text-muted-foreground">Browser Extension</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>

              {/* Celo Wallet Option */}
              <a
                href="https://valoraapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Valora (Celo Wallet)</p>
                    <p className="text-xs text-muted-foreground">Mobile App</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>

              {/* Other Wallets */}
              <div className="p-3 border rounded-lg bg-muted/50">
                <p className="text-xs font-medium mb-1">Other Compatible Wallets:</p>
                <p className="text-xs text-muted-foreground">
                  Any WalletConnect compatible wallet will work with Celo.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t space-y-2">
              <p className="text-xs text-muted-foreground">
                After installing a wallet, refresh this page and click "Connect Wallet" again.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Connected state - show dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "gap-2 border-green-500/50 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30",
            "transition-all duration-200"
          )}
        >
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <Wallet className="h-4 w-4" />
          <span className="hidden md:inline font-mono text-xs">{truncateAddress(address)}</span>
          <span className="md:hidden font-mono text-xs">{truncateAddress(address)}</span>
          <Badge
            variant="secondary"
            className="ml-1 hidden md:inline-flex bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30"
          >
            {network === 'alfajores' ? 'Testnet' : network === 'mainnet' ? 'Mainnet' : network}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Wallet</span>
          {isRefreshing && <Loader2 className="h-3 w-3 animate-spin" />}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        {/* Wallet Address */}
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground mb-1">Address</p>
          <div className="flex items-center gap-2">
            <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 truncate">
              {address}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={handleCopyAddress}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Network */}
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground mb-1">Network</p>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="capitalize">
              {network === 'alfajores' ? 'Alfajores Testnet' : network === 'mainnet' ? 'Celo Mainnet' : network}
            </Badge>
            {network !== 'alfajores' && network !== 'mainnet' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={handleSwitchNetwork}
              >
                Switch
              </Button>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Balances */}
        <div className="px-2 py-2 space-y-2">
          <p className="text-xs text-muted-foreground mb-1">Balances</p>
          
          {/* CELO Balance */}
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-yellow-400 flex items-center justify-center">
                <span className="text-[10px] font-bold text-yellow-900">C</span>
              </div>
              <span className="text-xs font-medium">CELO</span>
            </div>
            {isRefreshing ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <span className="text-xs font-mono">{parseFloat(formattedBalance.celo).toFixed(4)}</span>
            )}
          </div>

          {/* cUSD Balance */}
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">$</span>
              </div>
              <span className="text-xs font-medium">cUSD</span>
            </div>
            {isRefreshing ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <span className="text-xs font-mono">{parseFloat(formattedBalance.cusd || '0').toFixed(2)}</span>
            )}
          </div>

          {/* cEUR Balance */}
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">€</span>
              </div>
              <span className="text-xs font-medium">cEUR</span>
            </div>
            {isRefreshing ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <span className="text-xs font-mono">{parseFloat(formattedBalance.ceur || '0').toFixed(2)}</span>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Actions */}
        <div className="px-2 py-1.5 space-y-1">
          <DropdownMenuItem
            onClick={() => {
              if (address && network) {
                window.open(getExplorerUrl(network as any, 'address', address), '_blank')
              }
            }}
            className="cursor-pointer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Explorer
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="cursor-pointer"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh Balance
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleSwitchNetwork}
            className="cursor-pointer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Switch Network
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDisconnect}
          className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect Wallet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default WalletConnectButton

