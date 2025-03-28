import { Brain, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

const getImpactColor = (impact: ImpactLevel) => {
  switch (impact) {
    case 'Critical':
      return 'destructive';
    case 'High':
      return 'warning';
    case 'Medium':
      return 'secondary';
  }
};

const getInsightIcon = (type: InsightType) => {
  switch (type) {
    case 'pattern':
      return <Brain className="h-4 w-4" />;
    case 'prediction':
      return <Sparkles className="h-4 w-4" />;
    case 'opportunity':
      return <ArrowRight className="h-4 w-4" />;
  }
};

export default function AIInsightsSection({ insights, onRefresh, isScanning }: AIInsightsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>
              Actionable insights powered by AI analysis
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isScanning}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan Now'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] overflow-y-auto pr-4">
          <div className="grid gap-4">
            {insights.map((insight, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {getInsightIcon(insight.type)}
                        <h4 className="font-medium">{insight.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {insight.description}
                      </p>
                    </div>
                    <Badge variant={getImpactColor(insight.impact)}>
                      {insight.impact}
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div>
                      <p className="text-sm font-medium">Recommendation</p>
                      <p className="text-sm text-muted-foreground">
                        {insight.recommendation}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Confidence: {insight.confidence}%</span>
                      <span>Affected Customers: {insight.affectedCustomers}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 