import { useNavigate } from 'react-router-dom';

export default function Logo() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className="flex items-center space-x-2"
    >
      <img src="/logo.svg" alt="Churnex Logo" className="h-8 w-auto" />
      <span className="text-xl font-bold text-gray-900">Churnex</span>
    </button>
  );
} 