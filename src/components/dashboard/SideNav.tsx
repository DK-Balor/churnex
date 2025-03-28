import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { InfoIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  LineChart,
  Settings,
  Bell,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Users, label: 'Customers', path: '/dashboard/customers' },
    { icon: LineChart, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
    { icon: Zap, label: 'AI Insights', path: '/dashboard/insights' },
    { icon: CheckCircle2, label: 'Tasks', path: '/dashboard/tasks' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <nav className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <InfoIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ul className="py-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={index}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center px-4 py-2 text-sm font-medium ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
} 