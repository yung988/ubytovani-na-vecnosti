export interface Booking {
  id: number
  created_at: string
  date: string
  name: string
  email: string
  phone: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

export interface Review {
  id: number
  created_at: string
  name: string
  rating: number
  text: string
  date: string
} 