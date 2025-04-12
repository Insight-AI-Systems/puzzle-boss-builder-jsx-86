
import React from 'react';
import { Star } from 'lucide-react';

const Testimonial = ({ name, location, text, rating, image }) => {
  return (
    <div className="card-highlight p-6 flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full overflow-hidden">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-puzzle-white font-bold">{name}</h4>
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
      </div>
      
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < rating ? "text-puzzle-gold fill-puzzle-gold" : "text-muted-foreground"} 
          />
        ))}
      </div>
      
      <blockquote className="text-muted-foreground flex-grow">
        "{text}"
      </blockquote>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah J.",
      location: "New York, USA",
      text: "I've won two premium prizes already! The puzzle competitions are challenging but so much fun. Definitely worth joining!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1288&auto=format&fit=crop"
    },
    {
      name: "Michael T.",
      location: "London, UK",
      text: "The Puzzle Boss has the best UI of any puzzle competition site I've used. The challenges are creative and the prizes are amazing.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop"
    },
    {
      name: "Aisha R.",
      location: "Toronto, Canada",
      text: "I'm addicted to these puzzle challenges! The competition is fierce but fair, and I've improved my puzzle skills so much.",
      rating: 4,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-16 bg-puzzle-black/50">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-puzzle-white">
          What Our <span className="text-puzzle-gold">Players</span> Say
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Join our community of puzzle enthusiasts and experience the thrill of competition.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
