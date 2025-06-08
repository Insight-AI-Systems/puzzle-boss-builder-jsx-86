
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { WordSearchGame } from '@/components/games/word-search';

export default function WordSearchGamePage() {
  return (
    <PageLayout 
      title="Word Search" 
      subtitle="Find hidden words in the puzzle grid"
    >
      <WordSearchGame />
    </PageLayout>
  );
}
