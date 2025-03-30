import { Search, LogOut, HelpCircle, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import UserProfile from './UserProfile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { PostgrestError } from '@supabase/supabase-js'
import { connectStripeAccount } from '@/lib/stripe/connect'

export function DashboardHeader() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [stripeConnected, setStripeConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if Stripe is connected on component mount
  useEffect(() => {
    checkStripeConnection()
  }, [])

  const checkStripeConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Try to get existing stripe account
      const { data, error } = await supabase
        .from('stripe_accounts')
        .select('connected')
        .eq('user_id', user.id)
        .single()

      if (error) {
        const pgError = error as PostgrestError
        if (pgError.code === 'PGRST116') {
          // Record doesn't exist, create it
          const { data: newAccount, error: insertError } = await supabase
            .from('stripe_accounts')
            .insert([
              { user_id: user.id, connected: false }
            ])
            .select('connected')
            .single()

          if (insertError) {
            console.error('Error creating stripe account:', insertError)
            return
          }
          setStripeConnected(newAccount?.connected || false)
        } else {
          console.error('Error fetching stripe account:', error)
        }
      } else {
        setStripeConnected(data?.connected || false)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error checking Stripe connection:', error.message)
      } else {
        console.error('Error checking Stripe connection:', error)
      }
    }
  }

  const handleStripeConnect = async () => {
    try {
      setIsConnecting(true)
      setError(null)
      
      const { url } = await connectStripeAccount()
      window.location.href = url
    } catch (error) {
      console.error('Error connecting Stripe:', error)
      setError(error instanceof Error ? error.message : 'Failed to connect Stripe')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleHelpClick = () => {
    navigate('/docs')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        {/* Left section - Profile and Name */}
        <div className="flex items-center gap-4">
          <UserProfile />
        </div>

        {/* Middle section - Search */}
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers and projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full pl-8 transition-colors ${
                  isSearchFocused ? 'border-brand-green ring-1 ring-brand-green' : ''
                }`}
              />
            </div>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-3">
          {!stripeConnected && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStripeConnect}
              disabled={isConnecting}
              className="gap-2"
            >
              <Wallet className="h-4 w-4" />
              {isConnecting ? "Connecting..." : "Connect Stripe"}
            </Button>
          )}
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('https://docs.churnex.com', '_blank')}
            className="gap-2"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
} 