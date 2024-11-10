'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ReservationData } from '@/types/reservation';

type FormData = {
  guestName: string;
  guestEmail: string;
  guestCount: number;
  paymentMethod: ReservationData['paymentMethod'];
};

export default function ReservacePage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    guestName: '',
    guestEmail: '',
    guestCount: 1,
    paymentMethod: 'bank_transfer'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const startDate = searchParams.get('from');
    const endDate = searchParams.get('to');

    if (!startDate || !endDate) {
      alert('Chybí údaje o termínu');
      return;
    }

    const reservationData: ReservationData = {
      startDate,
      endDate,
      ...formData
    };

    try {
      const response = await fetch('/api/create-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Něco se pokazilo');
      }

      // Pro platbu kartou přesměrujeme na Stripe
      if (formData.paymentMethod === 'card' && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        // Pro bankovní převod přesměrujeme na potvrzovací stránku
        window.location.href = `/rezervace/potvrzeni?id=${data.reservation.id}`;
      }
    } catch (error) {
      alert('Chyba při vytváření rezervace: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-light mb-6">Dokončení rezervace</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Jméno a příjmení
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.guestName}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              guestName: e.target.value
            }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.guestEmail}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              guestEmail: e.target.value
            }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Počet hostů
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.guestCount}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              guestCount: parseInt(e.target.value)
            }))}
          >
            {[1, 2, 3, 4].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Způsob platby
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.paymentMethod}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              paymentMethod: e.target.value as ReservationData['paymentMethod']
            }))}
          >
            <option value="bank_transfer">Bankovní převod</option>
            <option value="card">Platba kartou</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-stone-900 text-white py-2 px-4 rounded-md hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Zpracování...' : 'Dokončit rezervaci'}
        </button>
      </form>
    </div>
  );
} 