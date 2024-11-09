'use client'

import { useSearchParams } from 'next/navigation'
import { BookingForm } from '@/components/booking-form'

export default function ReservationPage() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  return (
    <div className="min-h-screen bg-stone-100 py-12">
      <div className="max-w-xl mx-auto px-4">
        <BookingForm selectedFrom={from} selectedTo={to} />
      </div>
    </div>
  )
} 