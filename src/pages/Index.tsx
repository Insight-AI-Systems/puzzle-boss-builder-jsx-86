import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Puzzle, Trophy, Users, Star, ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedPuzzles } from '@/components/home/FeaturedPuzzles';
import { CompetitionHighlights } from '@/components/home/CompetitionHighlights';
import { Testimonials } from '@/components/home/Testimonials';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-puzzle-black min-h-screen">
      <HeroSection />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-puzzle-white mb-8 text-center">
            Explore Our Puzzles
          </h2>
          <FeaturedPuzzles />
        </div>
      </section>

      <section className="py-12 bg-puzzle-black/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-puzzle-white mb-8 text-center">
            Competitions & Leaderboards
          </h2>
          <CompetitionHighlights />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-puzzle-white mb-8 text-center">
            What Our Users Say
          </h2>
          <Testimonials />
        </div>
      </section>

      <section className="py-12 bg-puzzle-black/30">
        <div className="container mx-auto px-4">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
};

export default Index;
