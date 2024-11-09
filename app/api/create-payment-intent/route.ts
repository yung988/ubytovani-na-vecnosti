import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-10-28.acacia'
})

const PRICE_PER_NIGHT = 2000 // 2000 Kč za noc

export async function POST(request: Request) {
  try {
    const { from, to, formData } = await request.json()
    
    if (!from || !to || !formData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const fromDate = new Date(from)
    const toDate = new Date(to)
    const nights = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))
    const amount = nights * PRICE_PER_NIGHT

    // Vytvořit payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'czk',
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Uložit rezervaci do databáze
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          check_in: from,
          check_out: to,
          guest_name: formData.name,
          guest_email: formData.email,
          guest_phone: formData.phone,
          status: 'pending',
          payment_intent_id: paymentIntent.id
        }
      ])

    if (bookingError) {
      throw bookingError
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    )
  }
} 