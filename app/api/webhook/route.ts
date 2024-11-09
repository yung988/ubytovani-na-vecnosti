import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        // Zde zpracujte úspěšnou platbu
        // Například aktualizace databáze, odeslání potvrzovacího emailu atd.
        break
        
      case 'payment_intent.payment_failed':
        // Zde zpracujte neúspěšnou platbu
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
} 