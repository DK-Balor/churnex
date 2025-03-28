import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import {
  BehaviorAnalysis,
  ChurnPredictions,
  SuccessPatterns,
  Analytics,
  Alerts,
  Settings,
} from './pages/PlaceholderPages';

// Placeholder components for each section
const Overview = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="p-6 border-2 hover:border-brand-green/20 transition-colors">
        <h3 className="font-semibold text-gray-700">At Risk Customers</h3>
        <p className="text-3xl font-bold text-brand-red mt-2">24</p>
        <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
      </Card>
      <Card className="p-6 border-2 hover:border-brand-green/20 transition-colors">
        <h3 className="font-semibold text-gray-700">Healthy Customers</h3>
        <p className="text-3xl font-bold text-brand-green mt-2">156</p>
        <p className="text-sm text-gray-500 mt-1">+5% from last month</p>
      </Card>
      <Card className="p-6 border-2 hover:border-brand-green/20 transition-colors sm:col-span-2 lg:col-span-1">
        <h3 className="font-semibold text-gray-700">Revenue at Risk</h3>
        <p className="text-3xl font-bold text-amber-500 mt-2">$45,200</p>
        <p className="text-sm text-gray-500 mt-1">Based on at-risk customers</p>
      </Card>
    </div>
  </div>
);

const CustomerHealth = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">Customer Health</h1>
    <Card className="p-6 border-2 hover:border-brand-green/20 transition-colors">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Health Score Distribution</h2>
      {/* Add health score visualization here */}
    </Card>
  </div>
);

const RiskDetection = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">Risk Detection</h1>
    <Card className="p-6 border-2 hover:border-brand-green/20 transition-colors">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">High Risk Customers</h2>
      {/* Add risk detection content here */}
    </Card>
  </div>
);

const Segments = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">Customer Segments</h1>
    <Card className="p-6 border-2 hover:border-brand-green/20 transition-colors">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Segment Analysis</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-4 rounded-lg bg-gray-50/80 border border-gray-200/80">
          <h3 className="font-medium text-gray-700">High-Value Customers</h3>
          <p className="text-2xl font-bold text-brand-green mt-2">84</p>
          <p className="text-sm text-gray-500">Average LTV: $2,400</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50/80 border border-gray-200/80">
          <h3 className="font-medium text-gray-700">At-Risk Segments</h3>
          <p className="text-2xl font-bold text-amber-500 mt-2">3</p>
          <p className="text-sm text-gray-500">Potential Revenue Impact: $28,500</p>
        </div>
      </div>
    </Card>
  </div>
);

const Feedback = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">Customer Feedback</h1>
    <Card className="p-6 border-2 hover:border-brand-green/20 transition-colors">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Sentiment Analysis</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50/80 border border-gray-200/80">
          <div>
            <h3 className="font-medium text-gray-700">Overall Sentiment</h3>
            <p className="text-sm text-gray-500">Based on recent interactions</p>
          </div>
          <span className="text-lg font-semibold text-brand-green">Positive</span>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50/80 border border-gray-200/80">
          <div>
            <h3 className="font-medium text-gray-700">Response Rate</h3>
            <p className="text-sm text-gray-500">Last 30 days</p>
          </div>
          <span className="text-lg font-semibold text-brand-green">78%</span>
        </div>
      </div>
    </Card>
  </div>
);

const Reports = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
    <Card className="p-6 border-2 hover:border-brand-green/20 transition-colors">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Available Reports</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50/80 border border-gray-200/80 hover:border-brand-green/20 transition-colors">
          <div>
            <h3 className="font-medium text-gray-700">Monthly Churn Report</h3>
            <p className="text-sm text-gray-500">March 2024</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-brand-green hover:bg-brand-green/10 rounded-lg transition-colors">
            Download
          </button>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50/80 border border-gray-200/80 hover:border-brand-green/20 transition-colors">
          <div>
            <h3 className="font-medium text-gray-700">Customer Health Summary</h3>
            <p className="text-sm text-gray-500">Q1 2024</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-brand-green hover:bg-brand-green/10 rounded-lg transition-colors">
            Download
          </button>
        </div>
      </div>
    </Card>
  </div>
);

// Add more section components...

export default function DashboardContent() {
  return (
    <div className="flex-1 min-h-0 bg-gray-50/50">
      <div className="h-full overflow-auto">
        <div className="container mx-auto p-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/health" element={<CustomerHealth />} />
            <Route path="/risk" element={<RiskDetection />} />
            <Route path="/segments" element={<Segments />} />
            <Route path="/insights">
              <Route path="behavior" element={<BehaviorAnalysis />} />
              <Route path="predictions" element={<ChurnPredictions />} />
              <Route path="patterns" element={<SuccessPatterns />} />
              <Route index element={<Navigate to="behavior" replace />} />
            </Route>
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
            {/* Catch any unmatched routes and redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
} 