import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { handleStripeOAuthCallback } from '@/lib/stripe/connect'

export function StripeCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        if (!code) {
          throw new Error('No authorization code received')
        }

        await handleStripeOAuthCallback(code)
        navigate('/dashboard?stripe=success')
      } catch (error) {
        console.error('Error handling Stripe callback:', error)
        navigate('/dashboard?stripe=error')
      }
    }

    handleCallback()
  }, [navigate, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Connecting your Stripe account...</h2>
        <p className="mt-2 text-muted-foreground">Please wait while we complete the connection.</p>
      </div>
    </div>
  )
} 