import { useAuth } from '../../lib/auth/AuthContext';
import { Button } from '../ui/button';

export function UserProfile() {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">
          {user?.email}
        </span>
      </div>
      <Button
        variant="ghost"
        className="text-gray-600 hover:text-gray-900"
      >
        Profile
      </Button>
    </div>
  );
} 