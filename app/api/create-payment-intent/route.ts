import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Debug log pro kontrolu, že klíč je načten
console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY)

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-10-28.acacia'
})

const PRICE_PER_NIGHT = 2000 // 2000 Kč za noc

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received request:', body)
    
    if (!body.from || !body.to) {
      return NextResponse.json(
        { error: 'Missing required fields: from and to dates' },
        { status: 400 }
      )
    }

    const fromDate = new Date(body.from)
    const toDate = new Date(body.to)
    const nights = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))
    const amount = nights * PRICE_PER_NIGHT

    console.log('Creating payment intent:', { nights, amount })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'czk',
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error in create-payment-intent:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    )
  }
} 