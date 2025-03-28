export type AccountType = 'demo' | 'trial' | 'paid'
export type PlanType = 'starter' | 'pro' | 'enterprise'

export interface AccountStatus {
  id: string
  account_type: AccountType
  subscription_tier?: PlanType | null
  created_at: string
  expires_at?: string
  updated_at: string
}

export interface UserProfile {
  id: string
  full_name: string
  avatar_url: string | null
  email: string
  account_type?: AccountType
  subscription_tier?: PlanType
} 