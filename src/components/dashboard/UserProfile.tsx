import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  showSettingsMenu?: boolean;
}

export default function UserProfile({ showSettingsMenu = true }: UserProfileProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <img
          src="/avatars/avatar-1.png"
          alt="User avatar"
          className="h-8 w-8 rounded-full"
        />
        <span className="text-sm font-medium text-gray-700">John Doe</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
          <div className="py-1">
            <button
              onClick={() => {
                navigate('/settings/profile');
                setShowDropdown(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile Settings
            </button>
            {showSettingsMenu && (
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </button>
            )}
            <button
              onClick={() => {
                navigate('/login');
                setShowDropdown(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 