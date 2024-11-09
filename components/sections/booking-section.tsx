import { motion } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { DateRange } from "react-day-picker"
import { parseISO } from "date-fns"

interface BookingFormData {
  name: string
  email: string
  phone: string
  dateRange: DateRange | undefined
}

interface Booking {
  check_in: string
  check_out: string
}

export function BookingSection() {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    dateRange: undefined
  })
  const [existingBookings, setExistingBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [step, setStep] = useState<'calendar' | 'details'>('calendar')

  // Načtení existujících rezervací
  useEffect(() => {
    async function fetchBookings() {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('check_in, check_out')
          .eq('status', 'confirmed')

        if (error) throw error
        setExistingBookings(data || [])
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.dateRange?.from || !formData.dateRange?.to) {
      alert('Prosím vyberte termín pobytu')
      return
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            check_in: formData.dateRange.from.toISOString().split('T')[0],
            check_out: formData.dateRange.to.toISOString().split('T')[0],
            guest_name: formData.name,
            guest_email: formData.email,
            guest_phone: formData.phone,
            status: 'pending'
          }
        ])

      if (error) throw error
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        dateRange: undefined
      })
      setStep('calendar')
      
      alert('Rezervace byla odeslána! Budeme vás kontaktovat.')
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Došlo k chybě při vytváření rezervace.')
    }
  }

  const handleDateSelect = (range: DateRange | undefined) => {
    setFormData({...formData, dateRange: range})
    if (range?.from && range?.to) {
      setStep('details')
    }
  }

  // Vytvoříme pole obsazených dnů pro zobrazení v kalendáři
  const bookedDays = existingBookings.flatMap(booking => {
    const start = parseISO(booking.check_in)
    const end = parseISO(booking.check_out)
    const days = []
    const currentDate = start
    while (currentDate <= end) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return days
  })

  const disabledDays = [{ before: new Date() }]

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
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 'calendar' ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Termín pobytu</label>
                <Calendar
                  mode="range"
                  selected={formData.dateRange}
                  onSelect={handleDateSelect}
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
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Jméno</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                  />
                </div>

                <div className="text-sm text-gray-500">
                  <p>Vybraný termín: {formData.dateRange?.from && formData.dateRange?.to ? 
                    `${formData.dateRange.from.toLocaleDateString()} - ${formData.dateRange.to.toLocaleDateString()}` : 
                    'Není vybrán termín'}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setStep('calendar')}
                    className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-900"
                  >
                    Zpět
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-stone-900 hover:bg-stone-800"
                  >
                    Odeslat rezervaci
                  </Button>
                </div>
              </>
            )}
          </form>
        )}
      </motion.div>
    </div>
  )
}