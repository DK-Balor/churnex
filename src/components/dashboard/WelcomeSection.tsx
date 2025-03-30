import { useAuth } from '../../lib/auth/AuthContext';

export function WelcomeSection() {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {user?.email}
      </h1>
      <p className="mt-2 text-gray-600">
        Here's what's happening with your projects today.
      </p>
    </div>
  );
} 