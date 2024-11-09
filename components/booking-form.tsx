'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface BookingFormProps {
  selectedFrom: string | null
  selectedTo: string | null
}

type BookingStep = 'details' | 'payment' | 'confirmation'

export function BookingForm({ selectedFrom, selectedTo }: BookingFormProps) {
  const [step, setStep] = useState<BookingStep>('details')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            check_in: selectedFrom,
            check_out: selectedTo,
            guest_name: formData.name,
            guest_email: formData.email,
            guest_phone: formData.phone,
            status: 'pending'
          }
        ])

      if (error) throw error
      
      setStep('confirmation')
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Došlo k chybě při vytváření rezervace.')
    }
  }

  if (!selectedFrom || !selectedTo) {
    return <div>Neplatný termín rezervace</div>
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <div className="flex items-center justify-center mb-8">
        {['details', 'payment', 'confirmation'].map((s, index) => (
          <>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === s ? 'bg-stone-900 text-white' : 'bg-stone-200'
            }`}>{index + 1}</div>
            {index < 2 && <div className="h-1 w-12 bg-stone-200 mx-2" />}
          </>
        ))}
      </div>

      {step === 'details' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-2xl font-light mb-6">Osobní údaje</h2>
            <p className="text-sm text-gray-500 mb-6">
              Termín: {new Date(selectedFrom).toLocaleDateString()} - {new Date(selectedTo).toLocaleDateString()}
            </p>
          </div>

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

          <Button
            type="submit"
            className="w-full bg-stone-900 hover:bg-stone-800"
          >
            Pokračovat k platbě
          </Button>
        </form>
      )}

      {step === 'payment' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-light mb-6">Platba</h2>
          {/* Zde bude implementace platební brány */}
          <p className="text-gray-500">Platební brána bude implementována později</p>
          <Button
            onClick={() => setStep('confirmation')}
            className="w-full bg-stone-900 hover:bg-stone-800"
          >
            Dokončit rezervaci
          </Button>
        </div>
      )}

      {step === 'confirmation' && (
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-light mb-6">Rezervace dokončena</h2>
          <p className="text-gray-500">
            Děkujeme za vaši rezervaci. Na váš email jsme odeslali potvrzení.
          </p>
        </div>
      )}
    </div>
  )
} 