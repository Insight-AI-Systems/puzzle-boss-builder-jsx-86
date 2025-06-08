
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { TriviaGame } from '@/components/games/trivia';

const TriviaGamePage: React.FC = () => {
  return (
    <PageLayout title="Trivia Lightning">
      <div className="max-w-4xl mx-auto">
        <TriviaGame />
      </div>
    </PageLayout>
  );
};

export default TriviaGamePage;
