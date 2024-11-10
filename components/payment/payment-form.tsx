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
  formData: {
    name: string
    email: string
    phone: string
  }
}

export function PaymentForm({ selectedFrom, selectedTo, onSuccess, formData }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    if (!stripe || !elements) return

    setIsLoading(true)
    setError(null)

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        from: selectedFrom, 
        to: selectedTo,
        formData 
      }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Něco se pokazilo')
        }
        return data
      })
      .then((data) => {
        setClientSecret(data.clientSecret)
      })
      .catch((error) => {
        setError(error.message)
        console.error('Error:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [stripe, elements, selectedFrom, selectedTo, formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)
    setError(null)

    try {
      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/rezervace/potvrzeni`,
        },
      })

      if (paymentError) {
        throw new Error(paymentError.message || 'Platba se nezdařila')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Došlo k chybě při platbě')
      console.error('Payment error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        <p>Chyba: {error}</p>
        <Button 
          onClick={() => setError(null)}
          className="mt-2"
        >
          Zkusit znovu
        </Button>
      </div>
    )
  }

  if (isLoading && !clientSecret) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
        <span className="ml-2">Načítání platební brány...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: 'tabs',
          paymentMethodOrder: ['card'],
          defaultValues: {
            billingDetails: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            }
          },
          fields: {
            billingDetails: {
              name: 'auto',
              email: 'auto',
              phone: 'auto',
              address: {
                country: 'auto',
                postalCode: 'auto',
                line1: 'auto',
                line2: 'auto',
                city: 'auto',
                state: 'auto',
              }
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