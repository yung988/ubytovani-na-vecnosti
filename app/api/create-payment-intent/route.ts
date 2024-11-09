import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia'
})

const PRICE_PER_NIGHT = 2000 // 2000 Kč za noc

export async function POST(request: Request) {
  try {
    const { from, to } = await request.json()

    const fromDate = new Date(from)
    const toDate = new Date(to)
    const nights = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))
    const amount = nights * PRICE_PER_NIGHT

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'czk',
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error creating payment intent' }, { status: 500 })
  }
} 