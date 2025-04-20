
import React from 'react';
import { TrendingUp, BarChart3, BadgeCheck } from 'lucide-react';

const BenefitCard = ({ icon: Icon, title, description }: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 h-12 w-12 bg-puzzle-aqua/20 rounded-full flex items-center justify-center">
      <Icon className="h-6 w-6 text-puzzle-aqua" />
    </div>
    <div>
      <h3 className="text-lg font-medium text-puzzle-white mb-1">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

const WhyPartnerWithUs = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Targeted Exposure",
      description: "Showcase your products to our highly engaged audience of puzzle solvers who actively participate in competitions to win premium items."
    },
    {
      icon: BarChart3,
      title: "Measurable Results",
      description: "Gain valuable insights with our detailed analytics on user engagement, interest levels, and demographic information."
    },
    {
      icon: BadgeCheck,
      title: "Enhanced Brand Perception",
      description: "Associate your brand with skilled gameplay and premium experiences, elevating your products' perceived value."
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-puzzle-aqua mb-4">Why Partner With Us</h2>
      <p className="text-muted-foreground mb-6">
        The Puzzle Boss offers unique partnership opportunities for brands looking to showcase their products to our engaged community of puzzle enthusiasts.
      </p>
      <div className="space-y-6">
        {benefits.map((benefit, index) => (
          <BenefitCard key={index} {...benefit} />
        ))}
      </div>
    </div>
  );
};

export default WhyPartnerWithUs;
