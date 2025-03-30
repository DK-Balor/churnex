import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Clock, InfoIcon } from 'lucide-react';
import Logo from '@/components/common/Logo';
import {
  LayoutDashboard,
  Users,
  LineChart,
  Brain,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  Settings,
  HeartPulse,
  Target,
  Zap,
  ChevronDown,
  CheckCircle2,
  Bell,
  Home,
  TrendingUp,
  ChevronRight,
  FileText,
  Users2,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';

interface AccountStatus {
  account_type: 'demo' | 'trial' | 'paid';
  subscription_tier?: string;
  expires_at?: string;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  hasDropdown?: boolean;
  isOpen?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NavItem = ({ icon, label, href, isActive, hasDropdown, isOpen, onClick }: NavItemProps) => (
  <Link
    to={`/dashboard${href}`}
    className={cn(
      "flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all duration-200",
      isActive
        ? "bg-brand-green/10 text-brand-green"
        : "text-gray-600 hover:bg-gray-100/60 hover:text-brand-green"
    )}
    onClick={onClick}
  >
    <span className={cn(
      "p-1 rounded-lg transition-colors",
      isActive ? "text-brand-green" : "text-gray-500 group-hover:text-brand-green"
    )}>
      {icon}
    </span>
    <span>{label}</span>
    {hasDropdown && (
      <span className="ml-auto">
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </span>
    )}
  </Link>
);

const navigation = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Projects', href: '/dashboard/projects' },
  { name: 'Customers', href: '/dashboard/customers' },
  { name: 'Settings', href: '/dashboard/settings' },
];

export function SideNav() {
  const location = useLocation();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              isActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

export default function SideNav() {
  const location = useLocation();
  const { user } = useAuth();
  const [isExpanded] = useState(true);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [insightsOpen, setInsightsOpen] = useState(false);

  useEffect(() => {
    const fetchAccountStatus = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) return;

        const { data, error } = await supabase
          .from('account_status')
          .select('account_type, subscription_tier, expires_at')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) setAccountStatus(data);
      } catch (error) {
        console.error('Error fetching account status:', error);
      }
    };

    fetchAccountStatus();
  }, []);

  useEffect(() => {
    if (location.pathname.includes('/insights')) {
      setInsightsOpen(true);
    }
  }, [location.pathname]);

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'paid':
        return 'bg-brand-green/10 text-brand-green border-brand-green/20';
      case 'trial':
        return 'bg-amber-50/50 text-amber-600 border-amber-200/30';
      default:
        return 'bg-amber-50/50 text-amber-600 border-amber-200/30';
    }
  };

  const getRemainingDaysColor = (type: string) => {
    switch (type) {
      case 'paid':
        return 'text-brand-green';
      case 'trial':
        return 'text-amber-600';
      default:
        return 'text-amber-600';
    }
  };

  const getRemainingDays = () => {
    if (!accountStatus?.expires_at) return null;
    const now = new Date();
    const expiryDate = new Date(accountStatus.expires_at);
    const diffTime = expiryDate.getTime() - now.getTime();
    if (diffTime < 0) return 'Expired';
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${days} Days Remaining`;
  };

  const getExpiryDate = () => {
    if (!accountStatus?.expires_at) return null;
    return new Date(accountStatus.expires_at).toLocaleDateString();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: isExpanded ? 280 : 0, opacity: 1 }}
      className="h-screen flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden"
    >
      <div className="flex h-[65px] items-center justify-center flex-shrink-0">
        <div className="scale-110">
          <Logo />
        </div>
      </div>

      {/* Account Status */}
      {accountStatus && (
        <div className="px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-3 text-sm font-medium">
            <div 
              className={cn(
                "inline-flex px-3.5 py-1.5 rounded-full border",
                getBadgeVariant(accountStatus.account_type)
              )}
            >
              {accountStatus.account_type}
            </div>
            {accountStatus.expires_at && (
              <>
                <div className="text-gray-200 select-none">|</div>
                <div className={cn(
                  "flex items-center gap-2",
                  getRemainingDaysColor(accountStatus.account_type)
                )}>
                  <span>{getRemainingDays()}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="opacity-60 hover:opacity-100 transition-opacity">
                        <InfoIcon className="h-3.5 w-3.5" />
                      </TooltipTrigger>
                      <TooltipContent 
                        className="bg-gray-900 text-white border-0 px-3 py-2 rounded-lg shadow-lg"
                        sideOffset={5}
                      >
                        <p>Your {accountStatus.account_type} account expires on {getExpiryDate()}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Navigation Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Main Navigation */}
        <div className="flex-1 space-y-0.5 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <NavItem
            icon={<Home className="h-5 w-5" />}
            label="Overview"
            href="/"
            isActive={location.pathname === "/dashboard"}
          />
          <NavItem
            icon={<HeartPulse className="h-5 w-5" />}
            label="Customer Health"
            href="/health"
            isActive={location.pathname === "/dashboard/health"}
          />
          <NavItem
            icon={<AlertTriangle className="h-5 w-5" />}
            label="Risk Detection"
            href="/risk"
            isActive={location.pathname === "/dashboard/risk"}
          />
          <NavItem
            icon={<Users2 className="h-5 w-5" />}
            label="Segments"
            href="/segments"
            isActive={location.pathname === "/dashboard/segments"}
          />
          
          {/* AI Insights with Animated Dropdown */}
          <div>
            <NavItem
              icon={<Brain className="h-5 w-5" />}
              label="AI Insights"
              href="/insights"
              hasDropdown
              isOpen={insightsOpen}
              isActive={location.pathname.includes("/dashboard/insights")}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                setInsightsOpen(!insightsOpen);
              }}
            />
            <AnimatePresence initial={false}>
              {insightsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="ml-5 space-y-0.5 border-l pl-3 py-1">
                    <NavItem
                      icon={<Users className="h-4 w-4" />}
                      label="Behavior Analysis"
                      href="/insights/behavior"
                      isActive={location.pathname === "/dashboard/insights/behavior"}
                    />
                    <NavItem
                      icon={<Target className="h-4 w-4" />}
                      label="Churn Predictions"
                      href="/insights/predictions"
                      isActive={location.pathname === "/dashboard/insights/predictions"}
                    />
                    <NavItem
                      icon={<TrendingUp className="h-4 w-4" />}
                      label="Success Patterns"
                      href="/insights/patterns"
                      isActive={location.pathname === "/dashboard/insights/patterns"}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavItem
            icon={<MessageCircle className="h-5 w-5" />}
            label="Feedback"
            href="/feedback"
            isActive={location.pathname === "/dashboard/feedback"}
          />
          <NavItem
            icon={<BarChart3 className="h-5 w-5" />}
            label="Analytics"
            href="/analytics"
            isActive={location.pathname === "/dashboard/analytics"}
          />
          <NavItem
            icon={<FileText className="h-5 w-5" />}
            label="Reports"
            href="/reports"
            isActive={location.pathname === "/dashboard/reports"}
          />
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-100 flex-shrink-0">
          <nav className="space-y-0.5 p-3">
            <NavItem
              icon={<Bell className="h-5 w-5" />}
              label="Alerts"
              href="/alerts"
              isActive={location.pathname === "/dashboard/alerts"}
            />
            <NavItem
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              href="/settings"
              isActive={location.pathname === "/dashboard/settings"}
            />
          </nav>
        </div>
      </div>
    </motion.div>
  );
} 