import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia'
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { from, to, formData } = body

    // Vytvořte payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: 'czk',
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        from,
        to,
        customerName: formData.name,
        customerEmail: formData.email
      }
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Payment Intent Error:', error)
    return NextResponse.json(
      { error: 'Chyba při vytváření platby' },
      { status: 500 }
    )
  }
} 