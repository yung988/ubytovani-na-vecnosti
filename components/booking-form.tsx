'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { PaymentForm } from './payment/payment-form'
import { BookingFormData } from '@/lib/types'
import { BookingInitialForm } from './booking-initial-form'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function BookingForm() {
  const [selectedFrom, setSelectedFrom] = useState('')
  const [selectedTo, setSelectedTo] = useState('')
  const [formData, setFormData] = useState<BookingFormData | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  const handleInitialSubmit = (data: BookingFormData): void => {
    setFormData(data)
    setShowPayment(true)
  }

  const handlePaymentSuccess = () => {
    // Můžete přidat další logiku po úspěšné platbě
    console.log('Platba byla úspěšná')
  }

  return (
    <div className="max-w-md mx-auto">
      {!showPayment ? (
        <BookingInitialForm 
          onSubmit={handleInitialSubmit}
          selectedFrom={selectedFrom}
          selectedTo={selectedTo}
          onFromChange={setSelectedFrom}
          onToChange={setSelectedTo}
        />
      ) : formData && (
        <Elements stripe={stripePromise}>
          <PaymentForm
            selectedFrom={selectedFrom}
            selectedTo={selectedTo}
            formData={formData}
            onSuccess={handlePaymentSuccess}
          />
        </Elements>
      )}
    </div>
  )
} 