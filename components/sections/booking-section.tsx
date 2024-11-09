import { motion } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

interface BookingSectionProps {
  selectedDate: Date | undefined
  onDateSelect: (date: Date | undefined) => void
  onBookingRequest: () => void
}

interface BookingFormData {
  name: string
  email: string
  phone: string
  date: Date
}

export function BookingSection({ 
  selectedDate, 
  onDateSelect, 
  onBookingRequest 
}: BookingSectionProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    date: selectedDate || new Date()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            date: formData.date.toISOString(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            status: 'pending'
          }
        ])

      if (error) throw error
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: new Date()
      })
      
      onBookingRequest()
    } catch (error) {
      console.error('Error creating booking:', error)
    }
  }

  return (
    <div id="booking" className="max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-3xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-light mb-6 text-center">Rezervace</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onDateSelect(date)
              if (date) {
                setFormData({...formData, date})
              }
            }}
            className="rounded-lg mx-auto"
          />
          
          <Button
            type="submit"
            className="w-full bg-stone-900 hover:bg-stone-800"
          >
            Odeslat rezervaci
          </Button>
        </form>
      </motion.div>
    </div>
  )
} 