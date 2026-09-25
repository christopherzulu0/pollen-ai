"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, Key, AlertTriangle, Copy, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"

interface WalletSetupProps {
  onWalletConfigured: () => void
}

export function WalletSetup({ onWalletConfigured }: WalletSetupProps) {
  const [showSetupDialog, setShowSetupDialog] = useState(false)
  const [privateKey, setPrivateKey] = useState("")
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [generatedWallet, setGeneratedWallet] = useState<any>(null)
  const { toast } = useToast()

  const generateWalletMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/wallet/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: 'generate' }),
      })
      if (!response.ok) throw new Error("Failed to generate wallet")
      return response.json()
    },
    onSuccess: (data) => {
      setGeneratedWallet(data.backup)
      toast({
        title: "Wallet Generated",
        description: `Address: ${data.address}`,
      })
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const importWalletMutation = useMutation({
    mutationFn: async (pk: string) => {
      const response = await fetch("/api/wallet/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: 'import', privateKey: pk }),
      })
      if (!response.ok) throw new Error("Failed to import wallet")
      return response.json()
    },
    onSuccess: (data) => {
      toast({
        title: "Wallet Imported",
        description: `Address: ${data.address}`,
      })
      setShowSetupDialog(false)
      onWalletConfigured()
    },
    onError: (error) => {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    })
  }

  const handleGenerateWallet = () => {
    generateWalletMutation.mutate()
  }

  const handleImportWallet = () => {
    if (!privateKey || !privateKey.startsWith('0x')) {
      toast({
        title: "Invalid Private Key",
        description: "Private key must start with 0x",
        variant: "destructive",
      })
      return
    }
    importWalletMutation.mutate(privateKey)
  }

  const handleConfirmBackup = () => {
    setShowSetupDialog(false)
    setGeneratedWallet(null)
    onWalletConfigured()
  }

  return (
    <>
      <Card className="border-2 border-dashed border-purple-300 bg-purple-50/50">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <Wallet className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Wallet Setup Required</h3>
          <p className="text-muted-foreground mb-6">
            To use DeFi loan features with Aave, you need to configure your wallet first.
          </p>
          <Button
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            onClick={() => setShowSetupDialog(true)}
          >
            <Key className="mr-2 h-4 w-4" />
            Setup Wallet
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Setup Your DeFi Wallet</DialogTitle>
            <DialogDescription>
              Generate a new wallet or import an existing one
            </DialogDescription>
          </DialogHeader>

          {!generatedWallet ? (
            <Tabs defaultValue="generate" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generate">Generate New</TabsTrigger>
                <TabsTrigger value="import">Import Existing</TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    A new wallet will be created. You'll receive a private key that you MUST save securely.
                    Never share it with anyone!
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="font-medium mb-2">What you'll get:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• A new Celo wallet address</li>
                      <li>• Private key for signing transactions</li>
                      <li>• Ability to use Aave DeFi features</li>
                    </ul>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleGenerateWallet}
                    disabled={generateWalletMutation.isPending}
                  >
                    {generateWalletMutation.isPending ? "Generating..." : "Generate Wallet"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="import" className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Only import a private key you trust. Never use your main wallet's private key!
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="privateKey">Private Key</Label>
                    <div className="relative">
                      <Input
                        id="privateKey"
                        type={showPrivateKey ? "text" : "password"}
                        placeholder="0x..."
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                      >
                        {showPrivateKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Must start with 0x
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleImportWallet}
                    disabled={importWalletMutation.isPending || !privateKey}
                  >
                    {importWalletMutation.isPending ? "Importing..." : "Import Wallet"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Wallet generated successfully! Save the information below securely.
                </AlertDescription>
              </Alert>

              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 font-medium">
                  ⚠️ CRITICAL: Save this information now! You won't be able to see it again.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Private Key</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={generatedWallet.privateKey}
                      readOnly
                      className="font-mono text-xs"
                      type={showPrivateKey ? "text" : "password"}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                    >
                      {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedWallet.privateKey, "Private key")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {generatedWallet.mnemonic && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Recovery Phrase (Mnemonic)</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={generatedWallet.mnemonic}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedWallet.mnemonic, "Recovery phrase")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                <h4 className="font-medium">Important:</h4>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>✓ Save your private key in a secure password manager</li>
                  <li>✓ Never share it with anyone</li>
                  <li>✓ If you lose it, you lose access to your funds</li>
                  <li>✓ Keep a backup in a safe location</li>
                </ul>
              </div>

              <DialogFooter>
                <Button
                  className="w-full"
                  onClick={handleConfirmBackup}
                >
                  I've Saved My Keys Securely
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

