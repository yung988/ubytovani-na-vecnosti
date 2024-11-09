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
    date: new Date()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data, error } = await supabase
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
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="rounded-lg mx-auto"
        />
        <Button
          className="w-full mt-6 bg-stone-900 hover:bg-stone-800"
          onClick={handleSubmit}
        >
          Kontaktovat pro rezervaci
        </Button>
      </motion.div>
    </div>
  )
} 