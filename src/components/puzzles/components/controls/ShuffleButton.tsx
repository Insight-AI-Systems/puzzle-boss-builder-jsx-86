
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ShuffleButtonProps {
  onShuffle: () => void;
  isLoading: boolean;
  isMobile?: boolean;
}

export const ShuffleButton: React.FC<ShuffleButtonProps> = ({
  onShuffle,
  isLoading,
  isMobile = false
}) => {
  return (
    <Button
      variant="outline"
      size={isMobile ? "sm" : "default"}
      className={isMobile ? "h-8 px-2" : "space-x-1"}
      onClick={onShuffle}
      disabled={isLoading}
    >
      <RefreshCw className="h-4 w-4" />
      {!isMobile && <span>Shuffle</span>}
    </Button>
  );
};
