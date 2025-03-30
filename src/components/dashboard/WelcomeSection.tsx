import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Clock, Sparkles, Zap } from 'lucide-react';
import { AccountStatus } from '@/types/account';

interface WelcomeSectionProps {
  accountStatus: AccountStatus;
}

const quotes = [
  {
    text: "Preventing churn is not just about retention—it's about building lasting relationships that drive growth.",
    author: "AI Insights"
  },
  {
    text: "Every customer interaction is an opportunity to strengthen loyalty and prevent churn.",
    author: "AI Insights"
  },
  {
    text: "Data-driven decisions today prevent customer churn tomorrow.",
    author: "AI Insights"
  },
  {
    text: "The best time to prevent churn is before it happens.",
    author: "AI Insights"
  }
];

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ accountStatus }) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [quote, setQuote] = React.useState(quotes[Math.floor(Math.random() * quotes.length)]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getRemainingDays = () => {
    if (!accountStatus.expires_at) return null;
    const now = new Date();
    const expiryDate = new Date(accountStatus.expires_at);
    const diffTime = expiryDate.getTime() - now.getTime();
    if (diffTime < 0) return null;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const remainingDays = getRemainingDays();

  return (
    <Card className="bg-gradient-to-r from-brand-green/5 to-brand-green/10 border-none">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Welcome Message and Account Status */}
          <div className="lg:col-span-4 space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-brand-dark-900">
                Welcome back to Churnex
              </h1>
              <p className="text-brand-dark-600">
                Your AI-powered churn prevention platform
              </p>
            </div>
            <div className="flex items-start space-x-3 bg-white/50 backdrop-blur-sm rounded-lg p-4">
              <div className="p-2 rounded-lg bg-brand-green/10">
                <Zap className="h-5 w-5 text-brand-green" />
              </div>
              <div>
                <div className="font-medium text-brand-dark-900">
                  {accountStatus.account_type} Account
                </div>
                {remainingDays && (
                  <div className="text-sm text-brand-dark-600 mt-1">
                    {remainingDays} days remaining
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Time and Date */}
          <div className="lg:col-span-3">
            <div className="flex items-start space-x-4 h-full">
              <div className="p-3 rounded-lg bg-white/50 backdrop-blur-sm">
                <Clock className="h-6 w-6 text-brand-green" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-brand-dark-900">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-brand-dark-600">
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>
          </div>

          {/* AI Quote */}
          <div className="lg:col-span-5">
            <div className="flex items-start space-x-4 h-full">
              <div className="p-3 rounded-lg bg-white/50 backdrop-blur-sm">
                <Brain className="h-6 w-6 text-brand-green" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-brand-dark-600 italic">
                  "{quote.text}"
                </div>
                <div className="text-xs text-brand-dark-500 mt-1">
                  — {quote.author}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection; 