
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const OpportunityCard = ({ title, description }: { title: string; description: string }) => (
  <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-sm">{description}</p>
    </CardContent>
  </Card>
);

const PartnershipOpportunities = () => {
  const opportunities = [
    {
      title: "Prize Sponsorship",
      description: "Feature your products as prizes in our puzzle competitions, gaining direct exposure to potential customers who actively desire your items."
    },
    {
      title: "Branded Puzzles",
      description: "Create custom themed puzzles around your brand, products, or marketing campaigns for maximum engagement."
    },
    {
      title: "Category Sponsorship",
      description: "Become the exclusive sponsor of a puzzle category that aligns with your brand, giving you consistent visibility."
    },
    {
      title: "Promotional Events",
      description: "Collaborate on limited-time promotional events featuring special puzzles, exclusive prizes, and co-branded marketing."
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-puzzle-aqua mb-4">Partnership Opportunities</h2>
      <div className="space-y-6">
        {opportunities.map((opportunity, index) => (
          <OpportunityCard key={index} {...opportunity} />
        ))}
      </div>
    </div>
  );
};

export default PartnershipOpportunities;
