import React from 'react';
import { Card } from '@/components/ui/card';

const PlaceholderSection = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    <Card className="p-6 border-2 hover:border-brand-green/20 transition-colors">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Coming Soon</h2>
        <p className="text-gray-500">This section is under development.</p>
      </div>
    </Card>
  </div>
);

export const BehaviorAnalysis = () => (
  <PlaceholderSection title="Behavior Analysis" />
);

export const ChurnPredictions = () => (
  <PlaceholderSection title="Churn Predictions" />
);

export const SuccessPatterns = () => (
  <PlaceholderSection title="Success Patterns" />
);

export const Analytics = () => (
  <PlaceholderSection title="Analytics" />
);

export const Alerts = () => (
  <PlaceholderSection title="Alerts" />
);

export const Settings = () => (
  <PlaceholderSection title="Settings" />
); 