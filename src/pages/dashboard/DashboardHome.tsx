import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Overview from '@/components/dashboard/Overview';
import DashboardContent from '@/components/dashboard/DashboardContent';

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <Overview />
      <DashboardContent />
    </div>
  );
} 