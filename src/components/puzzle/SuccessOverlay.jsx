
import React, { memo } from 'react';
import { Check } from 'lucide-react';

// Memoize the SuccessOverlay since it doesn't change once rendered
const SuccessOverlay = memo(() => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-puzzle-black/30 backdrop-blur-[1px] animate-fade-in">
      <div className="text-puzzle-gold flex items-center gap-2 font-bold text-2xl">
        <Check className="w-6 h-6" />
        Complete!
      </div>
    </div>
  );
});

// Display name for debugging
SuccessOverlay.displayName = 'SuccessOverlay';

export default SuccessOverlay;
