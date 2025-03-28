import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '../../utils/cn';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-8 right-8 p-3 rounded-full bg-brand-green text-white shadow-lg transition-all duration-300 hover:bg-brand-green-600 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      )}
      aria-label="Back to top"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
};

export default BackToTop; 