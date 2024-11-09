import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia'
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { from, to, formData } = body

    // Zde byste měli implementovat vlastní logiku pro výpočet ceny
    const amount = 1000 // Příklad: 1000 = 10.00 CZK

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'czk',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        from,
        to,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('Payment intent error:', err)
    return NextResponse.json(
      { error: 'Chyba při vytváření platby' },
      { status: 500 }
    )
  }
} 