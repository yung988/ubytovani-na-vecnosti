import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia'
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret!)
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const { id } = event.data.object as Stripe.PaymentIntent
        await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('payment_intent_id', id)
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
} 