import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

function verifyWebhookSignature(
  payload: string,
  receivedSignature: string,
  secretKey: string
): boolean {
  try {
    const expectedSignature = createHmac('sha256', secretKey)
      .update(payload)
      .digest('hex')

    // Use timing-safe comparison to prevent timing attacks
    return timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(receivedSignature, 'hex')
    )
  } catch (error) {
    console.error('Webhook signature verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('chipi-signature')
    const webhookSecret = process.env.CHIPI_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('CHIPI_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    if (!signature || !verifyWebhookSignature(payload, signature, webhookSecret)) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(payload)
    console.log('Received Chipi webhook:', event)

    // Handle different event types
    switch (event.event) {
      case 'transaction.sent':
        if (event.data.transaction.status === 'SUCCESS') {
          const transaction = event.data.transaction
          console.log(`Payment received: ${transaction.amount} ${transaction.currency} from ${transaction.senderAddress}`)
          
          // TODO: Update database, send confirmation emails, fulfill orders, etc.
          // await updateOrderStatus(transaction.id, 'completed')
          // await sendConfirmationEmail(transaction.recipientEmail)
        }
        break

      case 'transaction.failed':
        console.log('Transaction failed:', event.data.transaction)
        // TODO: Handle failed transactions
        break

      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
