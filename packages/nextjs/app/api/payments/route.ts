import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = 'USDC', recipientWallet } = body

    if (!amount || !recipientWallet) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, recipientWallet' },
        { status: 400 }
      )
    }

    // TODO: Initialize Chipi SDK server instance
    // const chipi = new ChipiSDK({
    //   secretKey: process.env.CHIPI_SECRET_KEY,
    // })

    // TODO: Create payment intent
    // const paymentIntent = await chipi.payments.create({
    //   amount,
    //   currency,
    //   recipientWallet,
    // })

    // For now, return mock response
    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: 'mock-payment-id',
        amount,
        currency,
        status: 'pending',
        recipientWallet,
      },
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
