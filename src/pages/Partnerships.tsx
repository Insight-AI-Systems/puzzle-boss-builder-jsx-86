
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HandshakeIcon, Building, BadgeCheck, TrendingUp, BarChart3 } from 'lucide-react';

const Partnerships = () => {
  return (
    <PageLayout 
      title="Partnerships" 
      subtitle="Collaborate with The Puzzle Boss to reach our engaged audience"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold text-puzzle-aqua mb-4">Why Partner With Us</h2>
          <p className="text-muted-foreground mb-6">
            The Puzzle Boss offers unique partnership opportunities for brands looking to showcase their products to our engaged community of puzzle enthusiasts.
          </p>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-12 w-12 bg-puzzle-aqua/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-puzzle-aqua" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-puzzle-white mb-1">Targeted Exposure</h3>
                <p className="text-muted-foreground">
                  Showcase your products to our highly engaged audience of puzzle solvers who actively participate in competitions to win premium items.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-12 w-12 bg-puzzle-aqua/20 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-puzzle-aqua" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-puzzle-white mb-1">Measurable Results</h3>
                <p className="text-muted-foreground">
                  Gain valuable insights with our detailed analytics on user engagement, interest levels, and demographic information.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-12 w-12 bg-puzzle-aqua/20 rounded-full flex items-center justify-center">
                <BadgeCheck className="h-6 w-6 text-puzzle-aqua" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-puzzle-white mb-1">Enhanced Brand Perception</h3>
                <p className="text-muted-foreground">
                  Associate your brand with skilled gameplay and premium experiences, elevating your products' perceived value.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-puzzle-aqua mb-4">Partnership Opportunities</h2>
          <div className="space-y-6">
            <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Prize Sponsorship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Feature your products as prizes in our puzzle competitions, gaining direct exposure to potential customers who actively desire your items.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Branded Puzzles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Create custom themed puzzles around your brand, products, or marketing campaigns for maximum engagement.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Category Sponsorship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Become the exclusive sponsor of a puzzle category that aligns with your brand, giving you consistent visibility.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Promotional Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Collaborate on limited-time promotional events featuring special puzzles, exclusive prizes, and co-branded marketing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-puzzle-black/90 to-puzzle-aqua/10 p-8 rounded-lg mb-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:max-w-md">
            <h2 className="text-2xl font-bold text-puzzle-aqua mb-2">Current Partners</h2>
            <p className="text-muted-foreground">
              We're proud to collaborate with leading brands across multiple industries. Join these partners in reaching our engaged audience.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="h-16 w-24 bg-white/5 rounded flex items-center justify-center border border-puzzle-aqua/20">
              <Building className="h-8 w-8 text-puzzle-aqua/50" />
            </div>
            <div className="h-16 w-24 bg-white/5 rounded flex items-center justify-center border border-puzzle-aqua/20">
              <Building className="h-8 w-8 text-puzzle-aqua/50" />
            </div>
            <div className="h-16 w-24 bg-white/5 rounded flex items-center justify-center border border-puzzle-aqua/20">
              <Building className="h-8 w-8 text-puzzle-aqua/50" />
            </div>
            <div className="h-16 w-24 bg-white/5 rounded flex items-center justify-center border border-puzzle-aqua/20">
              <Building className="h-8 w-8 text-puzzle-aqua/50" />
            </div>
            <div className="h-16 w-24 bg-white/5 rounded flex items-center justify-center border border-puzzle-aqua/20">
              <Building className="h-8 w-8 text-puzzle-aqua/50" />
            </div>
            <div className="h-16 w-24 bg-white/5 rounded flex items-center justify-center border border-puzzle-aqua/20">
              <Building className="h-8 w-8 text-puzzle-aqua/50" />
            </div>
          </div>
        </div>
      </div>
      
      <Card className="border-puzzle-aqua/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <HandshakeIcon className="h-5 w-5 mr-2 text-puzzle-aqua" />
            Partner with Us
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Your Name
                </label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email Address
                </label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="block text-sm font-medium">
                  Company Name
                </label>
                <Input id="company" placeholder="Your company" />
              </div>
              <div className="space-y-2">
                <label htmlFor="position" className="block text-sm font-medium">
                  Your Position
                </label>
                <Input id="position" placeholder="e.g. Marketing Director" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="interest" className="block text-sm font-medium">
                Partnership Interest
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your partnership interest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prize">Prize Sponsorship</SelectItem>
                  <SelectItem value="branded">Branded Puzzles</SelectItem>
                  <SelectItem value="category">Category Sponsorship</SelectItem>
                  <SelectItem value="promotional">Promotional Events</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="budget" className="block text-sm font-medium">
                Estimated Budget Range
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-5k">$0 - $5,000</SelectItem>
                  <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                  <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                  <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="50k+">$50,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium">
                Partnership Details
              </label>
              <Textarea 
                id="message" 
                placeholder="Please describe your partnership proposal or inquiry..."
                rows={5}
              />
            </div>
            
            <Button className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80">
              Submit Partnership Inquiry
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default Partnerships;
