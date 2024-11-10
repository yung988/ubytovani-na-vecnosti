import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { startDate, endDate } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('payment_status', 'confirmed')
      .or(`end_date.gte.${startDate},start_date.lte.${endDate}`);

    if (error) throw error;

    // Předpokládáme, že máte 2 pokoje
    const isAvailable = !data || data.length < 2;

    return NextResponse.json({ available: isAvailable });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({ error: 'Chyba při kontrole dostupnosti' }, { status: 500 });
  }
} 