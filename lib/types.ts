export interface BookingFormData {
  name: string
  email: string
  dateFrom: string
  dateTo: string
  selectedFrom?: string | null // přidáno
  selectedTo?: string | null // přidáno
}

export interface Booking {
  id?: string
  check_in: string
  check_out: string
  guest_name: string
  guest_email: string
  guest_phone: string
  status: 'pending' | 'confirmed' | 'cancelled'
  payment_intent_id: string
  created_at?: string
} 