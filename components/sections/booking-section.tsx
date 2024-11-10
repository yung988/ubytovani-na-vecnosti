import { motion } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { DateRange } from "react-day-picker"
import { parseISO } from "date-fns"
import { useRouter } from 'next/navigation'
import type { ReservationData } from '@/types/reservation';

interface Reservation {
  start_date: string
  end_date: string
}

export function BookingSection() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [existingBookings, setExistingBookings] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('start_date, end_date')
          .eq('payment_status', 'confirmed')

        if (error) throw error
        setExistingBookings(data || [])
      } catch (error) {
        console.error('Error fetching reservations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleContinue = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      alert('Prosím vyberte termín pobytu');
      return;
    }

    const startDate = dateRange.from.toISOString().split('T')[0];
    const endDate = dateRange.to.toISOString().split('T')[0];

    // Kontrola dostupnosti před přesměrováním
    const isAvailable = await checkAvailability(dateRange.from, dateRange.to);
    
    if (!isAvailable) {
      alert('Vybraný termín je již obsazen');
      return;
    }

    // Přesměrování na stránku rezervace s vybranými daty
    router.push(`/rezervace?from=${startDate}&to=${endDate}`);
  };

  // Vytvoříme pole obsazených dnů pro zobrazení v kalendáři
  const bookedDays = existingBookings.flatMap(booking => {
    const start = parseISO(booking.start_date)
    const end = parseISO(booking.end_date)
    const days = []
    const currentDate = new Date(start)
    while (currentDate <= end) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return days
  })

  const disabledDays = [{ before: new Date() }]

  const checkAvailability = async (startDate: Date, endDate: Date) => {
    const response = await fetch('/api/check-availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startDate, endDate }),
    });
    
    const data = await response.json();
    return data.available;
  };

  const createReservation = async (reservationData: ReservationData) => {
    const response = await fetch('/api/create-reservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    });
    
    return response.json();
  };

  return (
    <div id="booking" className="max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-3xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-light mb-6 text-center">Rezervace</h2>
        {isLoading ? (
          <div className="text-center">Načítání kalendáře...</div>
        ) : (
          <div className="space-y-6">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              disabled={disabledDays}
              modifiers={{ booked: bookedDays }}
              modifiersStyles={{
                booked: {
                  backgroundColor: 'rgb(254, 226, 226)',
                  color: 'rgb(185, 28, 28)',
                  textDecoration: 'line-through'
                }
              }}
              numberOfMonths={2}
              className="rounded-lg mx-auto border"
            />

            {dateRange?.from && dateRange?.to && (
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  <p>Vybraný termín: {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}</p>
                </div>
                <Button
                  onClick={handleContinue}
                  className="w-full bg-stone-900 hover:bg-stone-800"
                >
                  Pokračovat k rezervaci
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}