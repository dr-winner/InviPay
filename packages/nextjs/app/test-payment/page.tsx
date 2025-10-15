import { ChipiPaymentButton } from '@/components/chipi-payment-button'

export default function TestPaymentPage() {
  const handlePaymentSuccess = (txHash: string) => {
    console.log('Payment successful:', txHash)
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Chipi Pay Integration Test</h1>
          <p className="text-muted-foreground mt-2">
            Test the Chipi Pay SDK integration with mock payments
          </p>
        </div>

        <div className="grid gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Test Payments</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Small Payment</h3>
                <ChipiPaymentButton
                  amount={10}
                  currency="USDC"
                  recipientWallet="0x1234567890abcdef1234567890abcdef12345678"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Medium Payment</h3>
                <ChipiPaymentButton
                  amount={50}
                  currency="USDC"
                  recipientWallet="0x1234567890abcdef1234567890abcdef12345678"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Large Payment</h3>
                <ChipiPaymentButton
                  amount={100}
                  currency="USDC"
                  recipientWallet="0x1234567890abcdef1234567890abcdef12345678"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Custom Amount</h3>
                <ChipiPaymentButton
                  amount={25.50}
                  currency="USDC"
                  recipientWallet="0x1234567890abcdef1234567890abcdef12345678"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Environment Status</h2>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Public Key:</span>
                <span className={process.env.NEXT_PUBLIC_CHIPI_PUBLIC_KEY ? 'text-green-600' : 'text-red-600'}>
                  {process.env.NEXT_PUBLIC_CHIPI_PUBLIC_KEY ? 'Configured' : 'Missing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Merchant Wallet:</span>
                <span className={process.env.NEXT_PUBLIC_CHIPI_MERCHANT_WALLET ? 'text-green-600' : 'text-red-600'}>
                  {process.env.NEXT_PUBLIC_CHIPI_MERCHANT_WALLET ? 'Configured' : 'Missing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Secret Key:</span>
                <span className={process.env.CHIPI_SECRET_KEY ? 'text-green-600' : 'text-red-600'}>
                  {process.env.CHIPI_SECRET_KEY ? 'Configured' : 'Missing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Webhook Secret:</span>
                <span className={process.env.CHIPI_WEBHOOK_SECRET ? 'text-green-600' : 'text-red-600'}>
                  {process.env.CHIPI_WEBHOOK_SECRET ? 'Configured' : 'Missing'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
