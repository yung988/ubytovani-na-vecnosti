export interface BookingFormData {
  name: string
  email: string
  phone: string
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