'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

interface PaymentFormProps {
  selectedFrom: string
  selectedTo: string
  onSuccess: () => void
}

export function PaymentForm({ selectedFrom, selectedTo, onSuccess }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    if (!stripe || !elements) return

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: selectedFrom, to: selectedTo }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret)
      })
      .catch((error) => {
        console.error('Error:', error)
        alert('Došlo k chybě při inicializaci platby')
      })
  }, [stripe, elements, selectedFrom, selectedTo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/rezervace/potvrzeni`,
      },
    })

    if (error) {
      console.error('Payment error:', error)
      alert('Došlo k chybě při platbě')
    } else {
      onSuccess()
    }

    setIsLoading(false)
  }

  if (!clientSecret) {
    return <div>Načítání platební brány...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: 'tabs',
          paymentMethodOrder: ['card'],
          defaultValues: {
            billingDetails: {
              name: 'Jan Novák',
            }
          }
        }}
      />
      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-stone-900 hover:bg-stone-800"
      >
        {isLoading ? 'Zpracování...' : 'Zaplatit'}
      </Button>
    </form>
  )
} 