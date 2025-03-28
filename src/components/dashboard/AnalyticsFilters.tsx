import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Filter, RefreshCw } from 'lucide-react';

export type TimeRange = '7d' | '30d' | '60d' | '90d' | '1y';

interface AnalyticsFiltersProps {
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
  onRefresh: () => void;
  onExport: () => void;
  isExporting?: boolean;
  isRefreshing?: boolean;
}

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '60d', label: 'Last 60 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' }
];

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  timeRange,
  onTimeRangeChange,
  onRefresh,
  onExport,
  isExporting = false,
  isRefreshing = false
}) => {
  return (
    <Card className="border-none bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-brand-dark-400" />
            <Select value={timeRange} onValueChange={onTimeRangeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              disabled={isExporting}
              className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
            >
              <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsFilters; 