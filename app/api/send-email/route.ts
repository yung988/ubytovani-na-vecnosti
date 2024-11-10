import { Resend } from 'resend';
import { ReservationConfirmationEmail } from '@/components/emails/reservation-confirmation';
import { NextResponse } from 'next/server';
import type { Reservation } from '@/types/reservation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { reservation } = await request.json() as { reservation: Reservation };

    if (!process.env.RESEND_API_KEY) {
      throw new Error('Chybí RESEND_API_KEY v prostředí');
    }

    const data = await resend.emails.send({
      from: 'Na Věčnosti <rezervace@navecnosti.cz>',
      to: [reservation.guest_email],
      subject: 'Potvrzení rezervace - Na Věčnosti',
      react: ReservationConfirmationEmail({
        guestName: reservation.guest_name,
        startDate: reservation.start_date,
        endDate: reservation.end_date,
        guestCount: reservation.guest_count,
        paymentMethod: reservation.payment_method,
        reservationId: reservation.id,
      }),
      tags: [
        {
          name: 'reservation_id',
          value: reservation.id
        }
      ]
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        error: 'Chyba při odesílání emailu',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 