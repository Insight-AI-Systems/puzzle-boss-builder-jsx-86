
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FeedbackButton } from '@/components/feedback/FeedbackButton';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FeedbackButton />
    </div>
  );
}
