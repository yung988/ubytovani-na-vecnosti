import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { startDate, endDate, guestCount, guestName, guestEmail, paymentMethod } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Kontrola dostupnosti
    const { data: existingReservations } = await supabase
      .from('reservations')
      .select('*')
      .eq('payment_status', 'confirmed')
      .or(`end_date.gte.${startDate},start_date.lte.${endDate}`);

    if (existingReservations && existingReservations.length >= 2) {
      return NextResponse.json(
        { error: 'Termín je již obsazen' },
        { status: 400 }
      );
    }

    // Výpočet ceny
    const nights = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * 2000; // 2000 Kč za noc

    // Vytvoříme rezervaci
    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert([
        {
          start_date: startDate,
          end_date: endDate,
          guest_count: guestCount,
          guest_name: guestName,
          guest_email: guestEmail,
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'card' ? 'pending' : 'confirmed',
          total_price: totalPrice
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Pro platbu kartou vytvoříme Stripe session
    if (paymentMethod === 'card') {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'czk',
              product_data: {
                name: 'Ubytování Na Věčnosti',
                description: `${nights} nocí (${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()})`,
              },
              unit_amount: totalPrice * 100, // Stripe používá nejmenší jednotku měny (haléře)
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${request.headers.get('origin')}/rezervace/potvrzeni?id=${reservation.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.headers.get('origin')}/rezervace?error=payment_cancelled`,
        customer_email: guestEmail,
        metadata: {
          reservation_id: reservation.id,
        },
      });

      return NextResponse.json({ 
        success: true, 
        reservation,
        payment_url: session.url 
      });
    }

    // Pro bankovní převod odešleme email
    const emailResponse = await fetch(new URL('/api/send-email', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservation }),
    });

    if (!emailResponse.ok) {
      console.error('Failed to send email:', await emailResponse.json());
    }

    return NextResponse.json({ success: true, reservation });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření rezervace' },
      { status: 500 }
    );
  }
} 