import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import type { AIInsight, Metrics } from '@/types/dashboard';

const mockMetrics: Metrics = {
  totalCustomers: 1250,
  activeCustomers: 1100,
  churnRate: 0.12,
  monthlyRevenue: 125000,
  growthRate: 0.08
};

const mockInsights: AIInsight[] = [
  {
    id: '1',
    title: 'High Churn Risk Detected',
    description: 'Several customers in the enterprise segment showing signs of dissatisfaction.',
    severity: 'high',
    category: 'churn',
    createdAt: new Date().toISOString()
  }
];

export default function DashboardDemo() {
  const [metrics, setMetrics] = useState<Metrics>(mockMetrics);
  const [insights, setInsights] = useState<AIInsight[]>(mockInsights);
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMetrics(mockMetrics);
      setInsights(mockInsights);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Demo</h1>
        <Button onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.totalCustomers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.activeCustomers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{(metrics.churnRate * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${metrics.monthlyRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>Real-time analysis of customer behavior</CardDescription>
          </CardHeader>
          <CardContent>
            {insights.map((insight) => (
              <div key={insight.id} className="mb-4 p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <Brain className="w-5 h-5 mr-2" />
                  <h3 className="font-semibold">{insight.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full justify-start">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button className="w-full justify-start">
                <ArrowRight className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 