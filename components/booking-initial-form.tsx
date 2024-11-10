import { BookingFormData } from '@/lib/types'

interface BookingInitialFormProps {
  onSubmit: (data: BookingFormData) => void
  selectedFrom: string
  selectedTo: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
}

// Změna na pojmenovaný export
export const BookingInitialForm = ({
  onSubmit,
  selectedFrom,
  selectedTo,
  onFromChange,
  onToChange
}: BookingInitialFormProps) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      // Zpracování dat formuláře
    }}>
      {/* Formulářové prvky */}
    </form>
  )
} 