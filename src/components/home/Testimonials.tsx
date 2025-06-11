
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "Amazing puzzle experience! The quality is outstanding and the competition keeps me coming back."
  },
  {
    name: "Mike Chen",
    rating: 5,
    comment: "Love the variety of puzzles and the smooth gameplay. Great way to relax and challenge myself."
  },
  {
    name: "Emma Rodriguez",
    rating: 5,
    comment: "The prizes are fantastic and the community is so welcoming. Highly recommend!"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-puzzle-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-game text-puzzle-white mb-4">
            What Players Say
          </h2>
          <p className="text-puzzle-white/70">
            Hear from our community of puzzle enthusiasts
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-puzzle-gray border-puzzle-border">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-puzzle-gold fill-current" />
                  ))}
                </div>
                <p className="text-puzzle-white/80 mb-4">"{testimonial.comment}"</p>
                <p className="text-puzzle-aqua font-medium">- {testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
