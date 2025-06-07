
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGameContainerProps {
  children: React.ReactNode;
  className?: string;
  aspectRatio?: 'square' | '4:3' | '16:9' | 'auto';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function ResponsiveGameContainer({ 
  children, 
  className = '',
  aspectRatio = 'auto',
  maxWidth = 'lg'
}: ResponsiveGameContainerProps) {
  const aspectRatioClasses = {
    'square': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    'auto': ''
  };

  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-4xl',
    'xl': 'max-w-6xl',
    'full': 'max-w-full'
  };

  return (
    <div className={cn(
      'w-full mx-auto px-4',
      maxWidthClasses[maxWidth],
      className
    )}>
      <div className={cn(
        'w-full',
        aspectRatioClasses[aspectRatio],
        'min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]'
      )}>
        {children}
      </div>
    </div>
  );
}

export default ResponsiveGameContainer;
