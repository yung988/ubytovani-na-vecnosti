import { BookingFormData } from '@/lib/types'
import { useState } from 'react'

interface BookingInitialFormProps {
  onSubmit: (data: BookingFormData) => void
  selectedFrom: string
  selectedTo: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
}

export const BookingInitialForm = ({
  onSubmit,
  selectedFrom,
  selectedTo,
  onFromChange,
  onToChange
}: BookingInitialFormProps) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData: BookingFormData = {
      name,
      email,
      dateFrom: selectedFrom,
      dateTo: selectedTo
    }
    
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="dateFrom" className="block text-sm font-medium">
          Od:
        </label>
        <input
          type="date"
          id="dateFrom"
          value={selectedFrom}
          onChange={(e) => onFromChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="dateTo" className="block text-sm font-medium">
          Do:
        </label>
        <input
          type="date"
          id="dateTo"
          value={selectedTo}
          onChange={(e) => onToChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Jméno:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Pokračovat k platbě
      </button>
    </form>
  )
} 