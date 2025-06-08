
import React from 'react';
import { ClerkAuthButtons } from './ClerkAuthButtons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AuthForm: React.FC = () => {
  return (
    <Card className="bg-puzzle-gray border-puzzle-border">
      <CardHeader>
        <CardTitle className="text-center text-puzzle-white">
          Get Started
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-puzzle-white/70 mb-6">
            Sign in or create an account to start playing puzzles and track your progress.
          </p>
          <ClerkAuthButtons />
        </div>
      </CardContent>
    </Card>
  );
};
