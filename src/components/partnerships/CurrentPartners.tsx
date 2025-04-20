
import React from 'react';
import { Building } from 'lucide-react';

const CurrentPartners = () => {
  return (
    <div className="bg-gradient-to-r from-puzzle-black/90 to-puzzle-aqua/10 p-8 rounded-lg mb-16">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:max-w-md">
          <h2 className="text-2xl font-bold text-puzzle-aqua mb-2">Current Partners</h2>
          <p className="text-muted-foreground">
            We're proud to collaborate with leading brands across multiple industries. Join these partners in reaching our engaged audience.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {Array(6).fill(null).map((_, index) => (
            <div key={index} className="h-16 w-24 bg-white/5 rounded flex items-center justify-center border border-puzzle-aqua/20">
              <Building className="h-8 w-8 text-puzzle-aqua/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentPartners;
