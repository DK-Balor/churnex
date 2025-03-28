import React from 'react';
import SideNav from './SideNav';
import { DashboardHeader } from './DashboardHeader';
import DashboardContent from './DashboardContent';

export default function Dashboard() {
  return (
    <div className="fixed inset-0 flex h-screen w-screen overflow-hidden bg-white">
      <SideNav />
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader />
        <DashboardContent />
      </div>
    </div>
  );
} 