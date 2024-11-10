export interface Reservation {
  id: string;
  created_at: string;
  start_date: string;
  end_date: string;
  guest_count: number;
  guest_name: string;
  guest_email: string;
  payment_method: 'card' | 'bank_transfer';
  payment_status: 'pending' | 'confirmed' | 'cancelled';
}

export interface ReservationData {
  startDate: string;
  endDate: string;
  guestCount: number;
  guestName: string;
  guestEmail: string;
  paymentMethod: 'card' | 'bank_transfer';
} 