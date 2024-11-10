import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const webhookSecret = process.env.RESEND_WEBHOOK_SECRET!;

interface ResendWebhookTag {
  name: string;
  value: string;
}

interface ResendWebhookData {
  to: string[];
  tags?: ResendWebhookTag[];
}

interface ResendWebhookPayload {
  type: 'email.delivered' | 'email.bounced' | 'email.complained';
  data: ResendWebhookData;
}

export async function POST(request: Request) {
  const payload = await request.json() as ResendWebhookPayload;
  const signature = request.headers.get('resend-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 401 });
  }

  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { type, data } = payload;

    switch (type) {
      case 'email.delivered':
        await supabase
          .from('email_logs')
          .insert({
            type: 'delivered',
            email: data.to[0],
            reservation_id: data.tags?.find((t: ResendWebhookTag) => t.name === 'reservation_id')?.value,
            metadata: data
          });
        break;

      case 'email.bounced':
        await supabase
          .from('email_logs')
          .insert({
            type: 'bounced',
            email: data.to[0],
            reservation_id: data.tags?.find((t: ResendWebhookTag) => t.name === 'reservation_id')?.value,
            metadata: data
          });

        const bounceReservationId = data.tags?.find((t: ResendWebhookTag) => t.name === 'reservation_id')?.value;
        if (bounceReservationId) {
          await supabase
            .from('reservations')
            .update({ email_status: 'bounced' })
            .eq('id', bounceReservationId);
        }
        break;

      case 'email.complained':
        await supabase
          .from('email_logs')
          .insert({
            type: 'complained',
            email: data.to[0],
            reservation_id: data.tags?.find((t: ResendWebhookTag) => t.name === 'reservation_id')?.value,
            metadata: data
          });
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 