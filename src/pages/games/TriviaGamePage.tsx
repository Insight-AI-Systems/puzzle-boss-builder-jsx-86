
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { TriviaGame } from '@/components/games/trivia';

export default function TriviaGamePage() {
  return (
    <PageLayout 
      title="Trivia Challenge" 
      subtitle="Test your knowledge across various categories"
    >
      <TriviaGame />
    </PageLayout>
  );
}
