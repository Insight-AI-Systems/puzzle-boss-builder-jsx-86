
import React from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  name: string;
  prize: string;
  avatar: string;
  stars: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, name, prize, avatar, stars }) => {
  return (
    <Card className="card-highlight">
      <CardContent className="pt-6">
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < stars ? "fill-puzzle-gold text-puzzle-gold" : "text-muted-foreground"} 
            />
          ))}
        </div>
        <p className="italic text-puzzle-white mb-4">"{quote}"</p>
      </CardContent>
      <CardFooter className="flex items-center gap-4 border-t border-puzzle-aqua/20 pt-4">
        <div className="flex-shrink-0">
          <img 
            src={avatar} 
            alt={name}
            className="w-12 h-12 rounded-full object-cover border-2 border-puzzle-aqua" 
          />
        </div>
        <div>
          <h4 className="font-bold text-puzzle-white">{name}</h4>
          <p className="text-sm text-puzzle-gold">Won: {prize}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "I never thought solving puzzles could be so rewarding! I won a brand new iPad and the competition was so much fun.",
      name: "Sarah Johnson",
      prize: "Apple iPad Pro",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop",
      stars: 5
    },
    {
      quote: "The puzzles are challenging but fair. I spent a weekend solving and ended up winning premium headphones!",
      name: "David Chen",
      prize: "Sony WH-1000XM4",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop",
      stars: 5
    },
    {
      quote: "Puzzle Boss has the best selection of logic puzzles. The timed competitions are addictive and the prizes are amazing.",
      name: "Emma Rodriguez",
      prize: "Nintendo Switch",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop",
      stars: 4
    }
  ];

  return (
    <section className="py-16 bg-puzzle-black/50">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-puzzle-white">
          Winner <span className="text-puzzle-aqua">Testimonials</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Hear from real players who have won prizes on The Puzzle Boss platform.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
