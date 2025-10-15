'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, CreditCard } from 'lucide-react'

interface ChipiPaymentButtonProps {
  amount: number
  currency?: string
  recipientWallet?: string
  onSuccess?: (txHash: string) => void
  onError?: (error: string) => void
  className?: string
}

export function ChipiPaymentButton({
  amount,
  currency = 'USDC',
  recipientWallet,
  onSuccess,
  onError,
  className,
}: ChipiPaymentButtonProps) {
  const [pin, setPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const handlePayment = useCallback(async () => {
    if (!pin) {
      toast.error('Please enter your PIN')
      return
    }

    if (!recipientWallet) {
      toast.error('Recipient wallet not configured')
      return
    }

    try {
      setIsLoading(true)

      // TODO: Use Chipi SDK to initiate payment
      // const chipi = useChipi()
      // const result = await chipi.pay({
      //   amount,
      //   currency,
      //   recipientWallet,
      //   pin,
      // })

      // Mock payment for now
      await new Promise(resolve => setTimeout(resolve, 2000))
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`

      toast.success('Payment completed successfully!', {
        description: `Transaction: ${mockTxHash.slice(0, 8)}...${mockTxHash.slice(-8)}`,
      })

      onSuccess?.(mockTxHash)
      setShowPaymentForm(false)
      setPin('')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed'
      toast.error('Payment failed', {
        description: errorMessage,
      })
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [amount, currency, recipientWallet, pin, onSuccess, onError])

  if (!showPaymentForm) {
    return (
      <Button
        onClick={() => setShowPaymentForm(true)}
        className={className}
        size="lg"
      >
        <CreditCard className="w-4 h-4 mr-2" />
        Pay {amount} {currency}
      </Button>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Confirm Payment</CardTitle>
        <CardDescription>
          Enter your PIN to complete the payment of {amount} {currency}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pin">PIN</Label>
          <Input
            id="pin"
            type="password"
            placeholder="Enter your PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPaymentForm(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isLoading || !pin}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
