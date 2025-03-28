import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Cell
} from 'recharts';
import { 
  Activity, 
  Users, 
  DollarSign, 
  TrendingDown, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  Bell,
  Sparkles,
  Bot,
  Download,
  Zap
} from 'lucide-react';
import Header from '../../components/common/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { cn } from '../../lib/utils';

// Mock data
const revenueData = [
  { month: 'Jan', actual: 12400, predicted: 12000 },
  { month: 'Feb', actual: 13100, predicted: 12800 },
  { month: 'Mar', actual: 12800, predicted: 13500 },
  { month: 'Apr', actual: 13600, predicted: 14000 },
  { month: 'May', actual: 14500, predicted: 14800 },
  { month: 'Jun', actual: 15200, predicted: 15500 },
];

const churnRiskData = [
  { risk: 'High', count: 23, color: '#ef4444' },
  { risk: 'Medium', count: 45, color: '#f59e0b' },
  { risk: 'Low', count: 156, color: '#10b981' },
];

const customerActivityData = [
  { day: 'Mon', active: 850, churned: 12 },
  { day: 'Tue', active: 860, churned: 8 },
  { day: 'Wed', active: 865, churned: 15 },
  { day: 'Thu', active: 880, churned: 10 },
  { day: 'Fri', active: 890, churned: 7 },
  { day: 'Sat', active: 888, churned: 13 },
  { day: 'Sun', active: 900, churned: 9 },
];

const atRiskCustomers = [
  {
    name: 'Acme Corp',
    risk: 87,
    reason: 'Decreased usage, Support tickets increased',
    status: 'Urgent'
  },
  {
    name: 'TechStart Inc',
    risk: 75,
    reason: 'Payment delays, Feature engagement dropped',
    status: 'High'
  },
  {
    name: 'Global Solutions',
    risk: 65,
    reason: 'Reduced team size, Lower activity',
    status: 'Medium'
  }
];

interface Metrics {
  churnRate: number;
  activeUsers: number;
  previousActiveUsers: number;
  revenueGrowth: number;
  previousRevenueGrowth: number;
}

interface AIInsight {
  type: 'pattern' | 'prediction' | 'correlation' | 'alert' | 'trend';
  title: string;
  description: string;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  recommendation: string;
  confidence: number;
}

// Initial AI insights
const initialAIInsights: AIInsight[] = [
  {
    type: 'pattern',
    title: 'Usage Pattern Change',
    description: 'Detected a 40% decrease in feature usage among enterprise customers',
    impact: 'High',
    recommendation: 'Schedule targeted training sessions for underutilized features',
    confidence: 92
  },
  {
    type: 'prediction',
    title: 'Churn Risk Spike',
    description: 'Predicted 15% increase in churn risk for customers > $10k MRR',
    impact: 'Critical',
    recommendation: 'Implement premium support program for high-value accounts',
    confidence: 88
  },
  {
    type: 'correlation',
    title: 'Feature Correlation',
    description: 'Strong correlation between API usage and customer retention',
    impact: 'Medium',
    recommendation: 'Promote API integration benefits to low-usage accounts',
    confidence: 95
  }
];

// Utility function to generate time difference string
const getTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

// AI Analysis patterns and responses
const aiPatterns: Array<{
  condition: (data: Metrics) => boolean;
  generateInsight: (data: Metrics) => AIInsight;
}> = [
  {
    condition: (data: Metrics): boolean => data.churnRate > 2.0,
    generateInsight: (data: Metrics): AIInsight => ({
      type: 'alert',
      title: 'Elevated Churn Risk',
      description: `Churn rate of ${data.churnRate}% exceeds target threshold of 2.0%`,
      impact: 'Critical',
      recommendation: 'Immediate customer success intervention required',
      confidence: 94
    })
  },
  {
    condition: (data: Metrics): boolean => data.activeUsers < data.previousActiveUsers,
    generateInsight: (data: Metrics): AIInsight => ({
      type: 'pattern',
      title: 'Declining User Activity',
      description: `Active users decreased by ${data.previousActiveUsers - data.activeUsers} this week`,
      impact: 'High',
      recommendation: 'Launch re-engagement campaign for inactive users',
      confidence: 89
    })
  },
  {
    condition: (data: Metrics): boolean => data.revenueGrowth < data.previousRevenueGrowth,
    generateInsight: (data: Metrics): AIInsight => ({
      type: 'trend',
      title: 'Revenue Growth Slowdown',
      description: 'Monthly revenue growth rate has decreased by 2.3%',
      impact: 'Medium',
      recommendation: 'Review pricing strategy and customer segments',
      confidence: 91
    })
  }
];

const DashboardDemo = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [lastScanTime, setLastScanTime] = useState<Date>(new Date());
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(initialAIInsights);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Simulate AI scanning and analysis
  const performAIScan = () => {
    setIsScanning(true);
    
    // Simulate current metrics
    const currentMetrics: Metrics = {
      churnRate: 2.4,
      activeUsers: 900,
      previousActiveUsers: 920,
      revenueGrowth: 12.5,
      previousRevenueGrowth: 14.8
    };

    // Generate new insights based on patterns
    const newInsights: AIInsight[] = aiPatterns
      .filter(pattern => pattern.condition(currentMetrics))
      .map(pattern => pattern.generateInsight(currentMetrics));

    // If no new insights, generate a default one
    if (newInsights.length === 0) {
      newInsights.push({
        type: 'pattern',
        title: 'Stable Performance',
        description: 'All metrics within expected ranges',
        impact: 'Low',
        recommendation: 'Continue monitoring key indicators',
        confidence: 95
      });
    }

    setTimeout(() => {
      setAiInsights(newInsights.slice(0, 3)); // Keep only top 3 insights
      setLastScanTime(new Date());
      setIsScanning(false);
    }, 2000); // Simulate processing time
  };

  // Perform regular scans
  useEffect(() => {
    // Initial scan
    performAIScan();

    // Set up regular scanning interval
    const scanInterval = setInterval(performAIScan, 30000); // Scan every 30 seconds

    return () => clearInterval(scanInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Demo Notice */}
          <div className="bg-brand-green/10 border border-brand-green/20 rounded-lg p-4 mb-8">
            <p className="text-brand-green text-sm font-medium flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              This is a demo dashboard showing how Churnex helps prevent customer churn. 
              <div className="flex justify-between">
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="text-brand-dark-600 text-sm font-medium hover:text-brand-green transition-colors"
                >
                  Contact Sales
                </button>
                <div className={cn(
                  "px-2 py-1 text-xs rounded-md transition-all duration-300",
                  isHovering 
                    ? "bg-brand-green text-white" 
                    : "bg-brand-green-50 text-brand-green-600"
                )}>
                  {isHovering ? 'Risk Alert: 3 customers' : 'New Alert'}
                </div>
              </div>
            </p>
          </div>

          {/* Page Header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-brand-dark-900 sm:text-3xl sm:truncate">
                Churn Prevention Dashboard
              </h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <Button 
                variant="outline" 
                className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button 
                className="bg-brand-green text-white hover:bg-brand-green-600"
              >
                <Zap className="h-4 w-4 mr-2" />
                Take Action
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                title: 'Monthly Revenue', 
                value: '$15,200', 
                change: '+12.5%',
                icon: DollarSign,
                trend: 'up'
              },
              { 
                title: 'Active Users', 
                value: '900', 
                change: '+8.2%',
                icon: Users,
                trend: 'up'
              },
              { 
                title: 'Churn Rate', 
                value: '2.4%', 
                change: '-1.1%',
                icon: TrendingDown,
                trend: 'down'
              },
              { 
                title: 'At Risk Customers', 
                value: '23', 
                change: '+5',
                icon: AlertCircle,
                trend: 'up',
                alert: true
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-lg ${stat.alert ? 'bg-red-50 text-red-600' : 'bg-brand-green/10 text-brand-green'}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-brand-dark-600 truncate">
                            {stat.title}
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-brand-dark-900">
                              {stat.value}
                            </div>
                            <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                              stat.trend === 'up' 
                                ? stat.alert ? 'text-red-600' : 'text-brand-green'
                                : 'text-brand-green'
                            }`}>
                              {stat.change}
                              {stat.trend === 'up' ? (
                                <ArrowUpRight className="h-4 w-4 ml-1" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 ml-1" />
                              )}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* ChurnAI Analysis Section */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Bot className="h-5 w-5 text-brand-green mr-2" />
                  ChurnAI™ Insights
                  <div className="flex items-center ml-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-normal flex items-center ${
                      isScanning 
                        ? 'bg-brand-green/10 text-brand-green animate-pulse' 
                        : 'bg-brand-green/10 text-brand-green'
                    }`}>
                      {isScanning ? (
                        <>
                          <Sparkles className="h-3 w-3 mr-1 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-brand-green rounded-full mr-2"></span>
                          Updated {getTimeAgo(lastScanTime)}
                        </>
                      )}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-2 text-brand-green hover:text-brand-green-600"
                      onClick={performAIScan}
                      disabled={isScanning}
                    >
                      <Zap className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Real-time AI-powered analysis and recommendations based on your customer data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <div className="p-4 rounded-lg border border-gray-200 hover:border-brand-green cursor-pointer transition-all">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start">
                              <div className="p-2 rounded-lg bg-brand-green/10 text-brand-green mr-3">
                                <Sparkles className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-brand-dark-900">{insight.title}</h4>
                                <p className="text-sm text-brand-dark-600">{insight.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                insight.impact === 'Critical' 
                                  ? 'bg-red-100 text-red-700'
                                  : insight.impact === 'High'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {insight.impact} Impact
                              </span>
                              <span className="text-xs bg-brand-green/10 text-brand-green px-2 py-1 rounded-full">
                                {insight.confidence}% confidence
                              </span>
                            </div>
                          </div>
                          <div className="ml-9">
                            <div className="flex items-center text-sm">
                              <Zap className="h-4 w-4 text-brand-green mr-2" />
                              <span className="text-brand-dark-600">
                                Recommended: {insight.recommendation}
                              </span>
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>AI Insight Analysis</DialogTitle>
                          <DialogDescription>
                            Detailed analysis and action plan
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-brand-dark-900 mb-2">Analysis Details</h4>
                            <div className="space-y-3">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="font-medium text-brand-dark-900">Pattern Recognition</div>
                                <p className="text-sm text-brand-dark-600">AI has analyzed historical data patterns and customer behavior to identify this trend.</p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="font-medium text-brand-dark-900">Impact Assessment</div>
                                <p className="text-sm text-brand-dark-600">This insight could affect approximately 25% of your customer base.</p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="font-medium text-brand-dark-900">Confidence Score</div>
                                <p className="text-sm text-brand-dark-600">Based on machine learning models trained on similar patterns across our customer base.</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-brand-dark-900 mb-2">Action Plan</h4>
                            <div className="space-y-2">
                              <div className="flex items-start">
                                <div className="p-1 rounded-full bg-brand-green/10 text-brand-green mr-2">
                                  <span className="block w-2 h-2 rounded-full bg-brand-green"></span>
                                </div>
                                <p className="text-sm text-brand-dark-600">Immediate: Schedule customer success meetings</p>
                              </div>
                              <div className="flex items-start">
                                <div className="p-1 rounded-full bg-brand-green/10 text-brand-green mr-2">
                                  <span className="block w-2 h-2 rounded-full bg-brand-green"></span>
                                </div>
                                <p className="text-sm text-brand-dark-600">This Week: Review product usage analytics</p>
                              </div>
                              <div className="flex items-start">
                                <div className="p-1 rounded-full bg-brand-green/10 text-brand-green mr-2">
                                  <span className="block w-2 h-2 rounded-full bg-brand-green"></span>
                                </div>
                                <p className="text-sm text-brand-dark-600">Next Sprint: Implement feature improvements</p>
                              </div>
                            </div>
                          </div>
                          <div className="pt-4 flex space-x-3">
                            <Button 
                              className="flex-1 bg-brand-green text-white hover:bg-brand-green-600"
                            >
                              Implement Action Plan
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1 border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                            >
                              Schedule Review
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Prediction Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenue Prediction</CardTitle>
                <CardDescription>Actual vs AI-Predicted Revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Actual Revenue"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#6366f1" 
                        strokeWidth={2} 
                        strokeDasharray="5 5"
                        name="AI Prediction"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Customer Activity Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Customer Activity</CardTitle>
                <CardDescription>Daily active users vs churned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={customerActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="active" 
                        stackId="1" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.2}
                        name="Active Users"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="churned" 
                        stackId="2" 
                        stroke="#ef4444" 
                        fill="#ef4444" 
                        fillOpacity={0.2}
                        name="Churned Users"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Churn Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Churn Risk Distribution</CardTitle>
                <CardDescription>Customer base by risk level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={churnRiskData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="risk" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="count" 
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      >
                        {churnRiskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* At-Risk Customers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 text-red-500 mr-2" />
                  High-Risk Customers
                </CardTitle>
                <CardDescription>Immediate attention required</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {atRiskCustomers.map((customer, index) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <div className="p-4 rounded-lg border border-gray-200 hover:border-brand-green cursor-pointer transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-brand-dark-900">{customer.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              customer.status === 'Urgent' 
                                ? 'bg-red-100 text-red-700'
                                : customer.status === 'High'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {customer.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-brand-dark-600">{customer.reason}</p>
                            <div className="flex items-center">
                              <span className="text-red-600 font-medium">{customer.risk}%</span>
                              <span className="text-xs text-brand-dark-500 ml-1">risk</span>
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Risk Analysis: {customer.name}</DialogTitle>
                          <DialogDescription>
                            Detailed risk assessment and recommended actions
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-brand-dark-900 mb-2">Risk Factors</h4>
                            <ul className="list-disc pl-5 space-y-2 text-brand-dark-600">
                              <li>Decreased product usage in last 30 days</li>
                              <li>Support ticket frequency increased by 45%</li>
                              <li>Key feature adoption rate dropped</li>
                              <li>Payment delays in last billing cycle</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-brand-dark-900 mb-2">Recommended Actions</h4>
                            <ul className="list-disc pl-5 space-y-2 text-brand-dark-600">
                              <li>Schedule immediate customer success meeting</li>
                              <li>Offer personalized feature training session</li>
                              <li>Review and adjust payment terms</li>
                              <li>Implement custom success plan</li>
                            </ul>
                          </div>
                          <div className="pt-4">
                            <Button className="w-full">Schedule Intervention</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade CTA */}
          <div className="mt-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-brand-dark-900 mb-2">
                      Want to see more features?
                    </h3>
                    <p className="text-brand-dark-600">
                      Contact our sales team to learn more about Churnex's full capabilities.
                    </p>
                  </div>
                  <Button 
                    size="lg"
                    className="bg-brand-green text-white hover:bg-brand-green-600"
                    onClick={() => window.location.href = '/contact'}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Contact Sales
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardDemo; 