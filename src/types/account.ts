export type AccountType = 'demo' | 'trial' | 'paid';

export type PlanType = 'growth' | 'scale' | 'pro';

export interface Plan {
  type: PlanType;
  name: string;
  price: number;
}

export const PLANS: Record<PlanType, Plan> = {
  growth: {
    type: 'growth',
    name: 'Growth Plan',
    price: 29
  },
  scale: {
    type: 'scale',
    name: 'Scale Plan',
    price: 70
  },
  pro: {
    type: 'pro',
    name: 'Pro Plan',
    price: 199
  }
};

interface Profile {
  first_name: string;
  full_name: string;
}

export type AccountStatus = {
  account_type: 'demo' | 'trial' | 'paid';
  subscription_tier?: string;
  expires_at?: string;
  stripe_account_id?: string;
};

export interface AccountStatusWithUser extends AccountStatus {
  user: {
    email: string;
  };
}

export const getAccountTypeLabel = (type: AccountType, planType: PlanType | null = null): string => {
  switch (type) {
    case 'demo':
      return 'Demo Account';
    case 'trial':
      return planType ? `Trial - ${PLANS[planType].name}` : 'Trial Account';
    case 'paid':
      return planType ? PLANS[planType].name : 'Paid Account';
    default:
      return 'Unknown Account Type';
  }
};

export const getAccountTypeDescription = (type: AccountType, planType: PlanType | null = null): string => {
  switch (type) {
    case 'demo':
      return 'Read-only access with limited features. Upgrade to a trial or paid plan to unlock full functionality.';
    case 'trial':
      if (planType) {
        return `Full access to all ${PLANS[planType].name} features during the trial period. Upgrade to continue after the trial.`;
      }
      return 'Full access to all features during the trial period. Upgrade to a paid plan to continue after the trial.';
    case 'paid':
      if (planType) {
        return `Full access to all ${PLANS[planType].name} features with your subscription.`;
      }
      return 'Full access to all features with your subscription plan.';
    default:
      return 'Unknown account type.';
  }
}; 