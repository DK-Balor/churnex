import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface ProfileIcon {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const PROFILE_ICONS: ProfileIcon[] = [
  {
    id: 'chef',
    name: 'Chef',
    icon: '👨‍🍳',
    description: 'Master of the kitchen'
  },
  {
    id: 'foodie',
    name: 'Foodie',
    icon: '🍽️',
    description: 'Passionate about great food'
  },
  {
    id: 'restaurant',
    name: 'Restaurant Owner',
    icon: '🏪',
    description: 'Running the show'
  },
  {
    id: 'critic',
    name: 'Food Critic',
    icon: '📝',
    description: 'Expert taste tester'
  },
  {
    id: 'host',
    name: 'Host',
    icon: '👋',
    description: 'Welcoming guests'
  },
  {
    id: 'manager',
    name: 'Manager',
    icon: '💼',
    description: 'Keeping things running'
  }
];

interface ProfileIconModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconId: string) => void;
  onPreview: (iconId: string) => void;
  currentIconId: string;
}

export function ProfileIconModal({ isOpen, onClose, onSelect, onPreview, currentIconId }: ProfileIconModalProps) {
  const [selectedIcon, setSelectedIcon] = useState(currentIconId);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    setSelectedIcon(currentIconId);
  }, [currentIconId]);

  const handleIconSelect = (iconId: string) => {
    setSelectedIcon(iconId);
    onPreview(iconId);
  };

  const handleApply = async () => {
    try {
      setIsApplying(true);
      await onSelect(selectedIcon);
    } catch (error) {
      console.error('Error applying icon:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleCancel = () => {
    setSelectedIcon(currentIconId);
    onPreview(currentIconId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose Your Profile Icon</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {PROFILE_ICONS.map((icon) => (
            <button
              key={icon.id}
              onClick={() => handleIconSelect(icon.id)}
              className={cn(
                "relative flex flex-col items-center p-4 rounded-lg border transition-all hover:bg-gray-50 cursor-pointer",
                selectedIcon === icon.id && "border-brand-green bg-brand-green/5"
              )}
            >
              <span className="text-4xl mb-2">{icon.icon}</span>
              <span className="font-medium">{icon.name}</span>
              <span className="text-sm text-gray-500">{icon.description}</span>
              {selectedIcon === icon.id && (
                <Check className="absolute top-2 right-2 h-5 w-5 text-brand-green" />
              )}
            </button>
          ))}
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isApplying}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={isApplying}>
            {isApplying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : (
              'Apply'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 