import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DataSyncButtonProps {
  onSyncComplete?: () => void;
}

const DataSyncButton: React.FC<DataSyncButtonProps> = ({ onSyncComplete }) => {
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('https://aqepnfjkrzczlxdsoagq.supabase.co/functions/v1/stripe-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();
      
      if (data.success) {
        onSyncComplete?.();
      } else {
        throw new Error(data.error || 'Failed to sync data');
      }
    } catch (error) {
      console.error('Error syncing data:', error);
      // You might want to show an error toast here
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={isSyncing}
      variant="outline"
      size="sm"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? 'Syncing...' : 'Sync Data'}
    </Button>
  );
};

export default DataSyncButton; 