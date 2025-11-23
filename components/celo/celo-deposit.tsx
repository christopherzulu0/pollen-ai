"use client"

import { useState } from 'react'
import { useCeloWallet } from '@/lib/celo/context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Wallet,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  ArrowDownRight,
  Info,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatTxHash, getExplorerUrl } from '@/lib/celo/utils'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

// QR Code component using online API
function QRCodeDisplay({ value, size = 200 }: { value: string; size?: number }) {
  const [qrError, setQrError] = useState(false)
  
  // Generate QR code using QR Server API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=ffffff&color=000000&margin=1`
  
  if (qrError) {
    return (
      <div className="flex items-center justify-center w-full">
        <div 
          className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm flex flex-col items-center justify-center"
          style={{ width: size + 32, height: size + 32 }}
        >
          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
            <QrCode className="h-16 w-16 text-gray-400" />
          </div>
          <p className="text-xs text-center mt-2 text-gray-500">QR Code unavailable</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center w-full">
      <div 
        className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm"
        style={{ width: size + 32, height: size + 32 }}
      >
        <img 
          src={qrCodeUrl}
          alt={`QR code for ${value.substring(0, 10)}...`}
          className="w-full h-full object-contain"
          style={{ width: size, height: size }}
          onError={() => {
            console.error('QR code generation failed')
            setQrError(true)
          }}
          onLoad={() => setQrError(false)}
        />
      </div>
    </div>
  )
}

export function CeloDeposit() {
  const {
    address,
    isConnected,
    network,
    formattedBalance,
    refreshBalance,
    isLoading,
  } = useCeloWallet()

  const [copied, setCopied] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<'CELO' | 'cUSD' | 'cEUR'>('CELO')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleCopyAddress = async () => {
    if (!address) return

    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      toast.success('Wallet address copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy address')
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

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'CELO':
        return '🟡'
      case 'cUSD':
        return '🟢'
      case 'cEUR':
        return '🔵'
      default:
        return '💵'
    }
  }

  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case 'CELO':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
      case 'cUSD':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
      case 'cEUR':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
      default:
        return ''
    }
  }

  const getBalance = (currency: string): string => {
    switch (currency) {
      case 'CELO':
        return formattedBalance.celo || '0'
      case 'cUSD':
        return formattedBalance.cusd || '0'
      case 'cEUR':
        return formattedBalance.ceur || '0'
      default:
        return '0'
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Celo Wallet Deposit
          </CardTitle>
          <CardDescription>Connect your wallet to receive Celo deposits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Wallet Not Connected</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Please connect your Celo wallet using the button in the header to receive deposits.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!address) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Balance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Celo Wallet Deposit
              </CardTitle>
              <CardDescription>
                Your Celo wallet address for receiving deposits
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", (isRefreshing || isLoading) && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Balances */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className={cn("border-2", getCurrencyColor('CELO'))}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium mb-1">CELO</p>
                    {isRefreshing || isLoading ? (
                      <Skeleton className="h-6 w-20" />
                    ) : (
                      <p className="text-2xl font-bold">{parseFloat(getBalance('CELO')).toFixed(4)}</p>
                    )}
                  </div>
                  <div className="text-2xl">🟡</div>
                </div>
              </CardContent>
            </Card>

            <Card className={cn("border-2", getCurrencyColor('cUSD'))}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium mb-1">cUSD</p>
                    {isRefreshing || isLoading ? (
                      <Skeleton className="h-6 w-20" />
                    ) : (
                      <p className="text-2xl font-bold">{parseFloat(getBalance('cUSD')).toFixed(2)}</p>
                    )}
                  </div>
                  <div className="text-2xl">🟢</div>
                </div>
              </CardContent>
            </Card>

            <Card className={cn("border-2", getCurrencyColor('cEUR'))}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium mb-1">cEUR</p>
                    {isRefreshing || isLoading ? (
                      <Skeleton className="h-6 w-20" />
                    ) : (
                      <p className="text-2xl font-bold">{parseFloat(getBalance('cEUR')).toFixed(2)}</p>
                    )}
                  </div>
                  <div className="text-2xl">🔵</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Currency Selection */}
          <Tabs value={selectedCurrency} onValueChange={(v) => setSelectedCurrency(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="CELO">CELO</TabsTrigger>
              <TabsTrigger value="cUSD">cUSD</TabsTrigger>
              <TabsTrigger value="cEUR">cEUR</TabsTrigger>
            </TabsList>

            {(['CELO', 'cUSD', 'cEUR'] as const).map((currency) => (
              <TabsContent key={currency} value={currency} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>{getCurrencyIcon(currency)}</span>
                      Deposit {currency}
                    </CardTitle>
                    <CardDescription>
                      Send {currency} to this address to deposit to your wallet
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* QR Code */}
                    <div className="flex justify-center p-4 bg-muted rounded-lg">
                      <QRCodeDisplay value={address} size={200} />
                    </div>

                    {/* Wallet Address */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Your {currency} Address</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                          {address}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopyAddress}
                          className="flex-shrink-0"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (address && network) {
                              window.open(getExplorerUrl(network as any, 'address', address), '_blank')
                            }
                          }}
                          className="flex-shrink-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-2">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1 text-sm">
                          <p className="font-medium text-blue-900 dark:text-blue-100">How to Deposit:</p>
                          <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200">
                            <li>Copy your wallet address above</li>
                            <li>Open your sending wallet (MetaMask, Valora, etc.)</li>
                            <li>Send {currency} to this address</li>
                            <li>Wait for blockchain confirmation (usually 5-10 seconds)</li>
                            <li>Your balance will update automatically</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    {/* Network Info */}
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {network === 'alfajores' ? 'Alfajores Testnet' : network === 'mainnet' ? 'Celo Mainnet' : network}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Minimum deposit: 0.01 {currency}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-amber-900 dark:text-amber-100">
            <AlertCircle className="h-5 w-5" />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Only send {selectedCurrency} to this address. Sending other currencies may result in loss of funds.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Always double-check the address before sending. Transactions cannot be reversed.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Network fees are paid by the sender, not deducted from your deposit.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Deposits are confirmed when the transaction is included in a block (usually 5-10 seconds).</span>
            </li>
            {network === 'alfajores' && (
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span className="font-medium">You are on testnet. Only use testnet tokens for testing.</span>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default CeloDeposit

