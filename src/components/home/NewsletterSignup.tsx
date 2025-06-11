
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    // TODO: Implement newsletter signup
    setEmail('');
  };

  return (
    <section className="py-16 bg-puzzle-gray">
      <div className="container mx-auto px-6">
        <Card className="max-w-2xl mx-auto bg-puzzle-black border-puzzle-border">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-puzzle-white">
              <Mail className="h-6 w-6 text-puzzle-aqua" />
              Stay Updated
            </CardTitle>
            <p className="text-puzzle-white/70">
              Get the latest puzzle releases, competitions, and exclusive offers
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-puzzle-gray border-puzzle-border text-puzzle-white"
                required
              />
              <Button type="submit" className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black">
                Subscribe
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
