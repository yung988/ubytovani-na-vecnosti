import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    const supabase = createRouteHandlerClient({ cookies });

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const reservationId = session.metadata?.reservation_id;

      if (reservationId) {
        // Aktualizujeme stav rezervace
        const { error } = await supabase
          .from('reservations')
          .update({ payment_status: 'confirmed' })
          .eq('id', reservationId);

        if (error) throw error;

        // Odešleme potvrzovací email
        const { data: reservation } = await supabase
          .from('reservations')
          .select('*')
          .eq('id', reservationId)
          .single();

        if (reservation) {
          await fetch(new URL('/api/send-email', request.url).toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reservation }),
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 