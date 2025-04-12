
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import MainHeader from '@/components/header';

const Partnerships = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to a backend
    toast.success("Partnership inquiry submitted successfully! Our team will contact you shortly.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-puzzle-black">
      <MainHeader />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-puzzle-gold">Partnership Opportunities</h1>
          <p className="text-muted-foreground mb-8">Join forces with The Puzzle Boss to create exciting opportunities for puzzle enthusiasts worldwide.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-puzzle-aqua/20 to-puzzle-black p-8 rounded-lg border border-puzzle-aqua/30">
              <h2 className="text-2xl font-semibold mb-4 text-puzzle-aqua">Why Partner With Us?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-puzzle-gold mr-2">✓</span>
                  <span>Reach a highly engaged audience of puzzle enthusiasts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-puzzle-gold mr-2">✓</span>
                  <span>Showcase your products or services as premium prizes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-puzzle-gold mr-2">✓</span>
                  <span>Increase brand awareness through co-branded puzzle competitions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-puzzle-gold mr-2">✓</span>
                  <span>Access detailed analytics about user engagement with your brand</span>
                </li>
                <li className="flex items-start">
                  <span className="text-puzzle-gold mr-2">✓</span>
                  <span>Benefit from our global reach across multiple markets</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-puzzle-gold">Partnership Types</h2>
              <div className="space-y-4">
                <div className="p-4 border border-puzzle-aqua/30 rounded-lg">
                  <h3 className="font-semibold text-puzzle-aqua">Prize Sponsorship</h3>
                  <p>Provide products to be featured as prizes in our puzzle competitions.</p>
                </div>
                <div className="p-4 border border-puzzle-aqua/30 rounded-lg">
                  <h3 className="font-semibold text-puzzle-aqua">Co-branded Contests</h3>
                  <p>Create unique puzzle experiences featuring your brand's visual identity.</p>
                </div>
                <div className="p-4 border border-puzzle-aqua/30 rounded-lg">
                  <h3 className="font-semibold text-puzzle-aqua">Media Partnerships</h3>
                  <p>Cross-promotion opportunities with complementary platforms and services.</p>
                </div>
                <div className="p-4 border border-puzzle-aqua/30 rounded-lg">
                  <h3 className="font-semibold text-puzzle-aqua">Affiliate Program</h3>
                  <p>Earn commissions by referring new users to The Puzzle Boss.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-8 rounded-lg shadow-lg mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Success Stories</h2>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="md:col-span-1">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">TP</span>
                  </div>
                </div>
                <div className="md:col-span-3">
                  <h3 className="text-xl font-medium mb-2">TechPrime Electronics</h3>
                  <p className="text-card-foreground mb-2">"Partnering with The Puzzle Boss has significantly increased our brand visibility among tech enthusiasts. Our products reached a highly engaged audience, resulting in a 28% increase in website traffic."</p>
                  <p className="text-sm text-muted-foreground">— Sarah Chen, Marketing Director</p>
                </div>
              </div>
              
              <div className="border-t border-puzzle-aqua/20 my-6"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="md:col-span-1">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">LG</span>
                  </div>
                </div>
                <div className="md:col-span-3">
                  <h3 className="text-xl font-medium mb-2">Luxury Goods Co.</h3>
                  <p className="text-card-foreground mb-2">"The co-branded puzzle competitions we created with The Puzzle Boss provided an innovative way to engage with our target demographic. The detailed analytics helped us refine our digital strategy."</p>
                  <p className="text-sm text-muted-foreground">— Marcus Johnson, Digital Strategy Lead</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Partner With Us</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="companyName" className="block text-sm font-medium">
                    Company Name
                  </label>
                  <Input id="companyName" placeholder="Your company" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="contactName" className="block text-sm font-medium">
                    Contact Name
                  </label>
                  <Input id="contactName" placeholder="Your name" required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email Address
                  </label>
                  <Input id="email" type="email" placeholder="contact@company.com" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Phone Number
                  </label>
                  <Input id="phone" placeholder="+1 123 456 7890" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="website" className="block text-sm font-medium">
                  Company Website
                </label>
                <Input id="website" placeholder="https://www.example.com" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="partnershipType" className="block text-sm font-medium">
                  Partnership Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-puzzle-aqua" />
                    <span>Prize Sponsorship</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-puzzle-aqua" />
                    <span>Co-branded Contests</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-puzzle-aqua" />
                    <span>Media Partnership</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-puzzle-aqua" />
                    <span>Affiliate Program</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Tell Us About Your Proposal
                </label>
                <Textarea 
                  id="message" 
                  placeholder="Please describe how you'd like to partner with us..."
                  rows={6}
                  required
                />
              </div>
              
              <div>
                <Button type="submit" className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black">
                  Submit Proposal
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Partnerships;
