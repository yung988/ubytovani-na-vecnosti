'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Reservation } from '@/types/reservation';

export default function PotvrzeniPage() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get('id');
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReservation() {
      if (!reservationId) {
        setError('Chybí ID rezervace');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('id', reservationId)
          .single();

        if (error) throw error;
        setReservation(data);
      } catch (err) {
        console.error('Error fetching reservation:', err);
        setError('Nepodařilo se načíst detaily rezervace');
      } finally {
        setLoading(false);
      }
    }

    fetchReservation();
  }, [reservationId]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <p>Načítání...</p>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || 'Rezervace nenalezena'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-2xl font-light mb-6 text-center">
          {reservation.payment_status === 'confirmed' 
            ? 'Rezervace potvrzena' 
            : 'Rezervace přijata'}
        </h1>

        <div className="space-y-6">
          <div className="border-t border-b border-gray-200 py-4">
            <h2 className="text-lg font-medium mb-4">Detaily rezervace</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-600">Termín pobytu</dt>
                <dd>
                  {new Date(reservation.start_date).toLocaleDateString()} - {new Date(reservation.end_date).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Počet hostů</dt>
                <dd>{reservation.guest_count}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Jméno</dt>
                <dd>{reservation.guest_name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Email</dt>
                <dd>{reservation.guest_email}</dd>
              </div>
            </dl>
          </div>

          {reservation.payment_method === 'bank_transfer' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Platební údaje</h3>
              <p className="text-blue-800">
                Prosím, zašlete platbu na účet:<br />
                Číslo účtu: 123456789/0100<br />
                Variabilní symbol: {reservation.id.slice(0, 10)}<br />
                Částka: 2000 Kč
              </p>
            </div>
          )}

          {reservation.payment_method === 'card' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                Budete přesměrováni na platební bránu...
              </p>
            </div>
          )}

          <div className="text-sm text-gray-500">
            <p>
              Potvrzení rezervace bylo odesláno na váš email. V případě jakýchkoliv dotazů nás neváhejte kontaktovat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 