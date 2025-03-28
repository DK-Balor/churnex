import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Brain, Sparkles, Zap, RefreshCw, ArrowRight } from 'lucide-react';

export type ImpactLevel = 'Critical' | 'High' | 'Medium';
export type InsightType = 'pattern' | 'prediction' | 'opportunity';

export interface AIInsight {
  type: InsightType;
  title: string;
  description: string;
  impact: ImpactLevel;
  recommendation: string;
  confidence: number;
  affectedCustomers: number;
}

interface AIInsightsSectionProps {
  insights: AIInsight[];
  onRefresh: () => void;
  isScanning: boolean;
}

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({
  insights,
  onRefresh,
  isScanning
}) => {
  return (
    <Card className="border-none bg-gradient-to-br from-brand-green/5 to-brand-green/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-brand-green/10">
              <Brain className="h-6 w-6 text-brand-green" />
            </div>
            <div>
              <CardTitle className="text-2xl">AI Insights</CardTitle>
              <CardDescription>Real-time analysis and recommendations</CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isScanning}
            className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            Refresh Analysis
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        insight.type === 'pattern' ? 'bg-blue-50 text-blue-600' :
                        insight.type === 'prediction' ? 'bg-purple-50 text-purple-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-brand-dark-900">{insight.title}</h4>
                        <p className="text-sm text-brand-dark-600 mt-1">{insight.description}</p>
                        <div className="flex items-center space-x-2 mt-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            insight.impact === 'Critical' 
                              ? 'bg-red-100 text-red-700'
                              : insight.impact === 'High'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {insight.impact} Impact
                          </span>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-brand-green" style={{
                              opacity: insight.confidence / 100
                            }} />
                            <span className="text-xs bg-brand-green/10 text-brand-green px-2 py-1 rounded-full">
                              {insight.confidence}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>AI Insight Analysis</DialogTitle>
                  <DialogDescription>
                    Detailed analysis and action plan
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-brand-dark-900 mb-3">Analysis Details</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-brand-dark-900">Pattern Recognition</div>
                        <p className="text-sm text-brand-dark-600">AI has analyzed historical data patterns and customer behavior to identify this trend.</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-brand-dark-900">Impact Assessment</div>
                        <p className="text-sm text-brand-dark-600">This insight could affect approximately {insight.affectedCustomers} customers.</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-brand-dark-900">Confidence Score</div>
                        <p className="text-sm text-brand-dark-600">Based on machine learning models trained on similar patterns across our customer base.</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-brand-dark-900 mb-3">Recommended Actions</h4>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="p-1 rounded-full bg-brand-green/10 text-brand-green mr-2">
                          <span className="block w-2 h-2 rounded-full bg-brand-green"></span>
                        </div>
                        <p className="text-sm text-brand-dark-600">{insight.recommendation}</p>
                      </div>
                      <div className="flex items-start">
                        <div className="p-1 rounded-full bg-brand-green/10 text-brand-green mr-2">
                          <span className="block w-2 h-2 rounded-full bg-brand-green"></span>
                        </div>
                        <p className="text-sm text-brand-dark-600">Schedule follow-up meetings with affected customers</p>
                      </div>
                      <div className="flex items-start">
                        <div className="p-1 rounded-full bg-brand-green/10 text-brand-green mr-2">
                          <span className="block w-2 h-2 rounded-full bg-brand-green"></span>
                        </div>
                        <p className="text-sm text-brand-dark-600">Monitor key metrics for the next 30 days</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-brand-green text-white hover:bg-brand-green-600">
                      Implement Action Plan
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button variant="outline" className="flex-1 border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
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
  );
};

export default AIInsightsSection; 