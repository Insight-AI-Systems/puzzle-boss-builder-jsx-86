
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";

export const GettingStartedGuide: React.FC = () => {
  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold">Getting Started with Marketing Tools</h2>
      <p className="text-muted-foreground">
        Follow these steps to effectively use our marketing tools and improve your online presence.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <span className="font-semibold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Set Up Your SEO</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start by configuring your site's meta tags and structured data to improve search engine visibility.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Configure page meta tags</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Set up structured data</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Generate and submit sitemap</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
              <span className="font-semibold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Plan Your Content</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Develop a comprehensive content strategy and plan your social media posts using the calendar.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Create monthly content themes</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Schedule social media posts</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Prepare blog articles and newsletters</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <span className="font-semibold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Monitor and Optimize</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Track your marketing performance and make data-driven improvements to your strategy.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Review analytics dashboard regularly</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Monitor brand mentions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Adjust strategy based on performance data</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
            <div>
              <span className="font-medium">Connect your social media accounts</span>
              <p className="text-sm text-muted-foreground">Link all your social profiles to enable posting and analytics from one place.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
            <div>
              <span className="font-medium">Set up Google Search Console integration</span>
              <p className="text-sm text-muted-foreground">Connect Search Console for better SEO insights and keyword tracking.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
            <div>
              <span className="font-medium">Create your first marketing campaign</span>
              <p className="text-sm text-muted-foreground">Design a multi-channel campaign to promote your puzzle products.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
