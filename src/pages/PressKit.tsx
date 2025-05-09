
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { Download, FileImage, Image, FileText, Info, Users, MessageSquareQuote } from 'lucide-react';

const PressKit = () => {
  // Mock download function - in a real app, this would trigger a file download
  const handleDownloadAsset = (assetType: string) => {
    console.log(`Downloading ${assetType}...`);
    // In a real implementation, this would initiate a download
    alert(`Download initiated for: ${assetType}`);
  };

  return (
    <PageLayout 
      title="Press Kit" 
      subtitle="Official media resources for The Puzzle Boss"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 p-6 border border-puzzle-aqua/20 rounded-lg bg-gradient-to-r from-puzzle-black/80 to-puzzle-aqua/10">
          <h2 className="text-2xl font-bold text-puzzle-aqua mb-4">About This Press Kit</h2>
          <p className="text-muted-foreground mb-6">
            Welcome to The Puzzle Boss press kit. Here you'll find official logos, brand assets, company information, 
            and media resources. Everything you need to accurately represent our brand in your publication or media outlet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 flex gap-2">
              <Download size={18} />
              Download Complete Press Kit
            </Button>
            <Button variant="outline" className="border-puzzle-aqua/50 text-puzzle-aqua hover:bg-puzzle-aqua/10">
              Contact Our PR Team
            </Button>
          </div>
        </div>

        <Tabs defaultValue="logos" className="w-full mb-10">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="logos">Logos & Brand</TabsTrigger>
            <TabsTrigger value="company">Company Info</TabsTrigger>
            <TabsTrigger value="media">Media Coverage</TabsTrigger>
            <TabsTrigger value="team">Executive Team</TabsTrigger>
          </TabsList>

          <TabsContent value="logos" className="space-y-6">
            <h3 className="text-xl font-bold text-puzzle-white mb-4 flex items-center gap-2">
              <FileImage className="text-puzzle-aqua" size={20} />
              Brand Assets
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Logo Card */}
              <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
                <CardContent className="pt-6">
                  <div className="aspect-video bg-white/5 rounded flex items-center justify-center mb-4">
                    <div className="w-3/4 h-1/2 bg-puzzle-aqua/30 rounded flex items-center justify-center">
                      <span className="font-game text-xl text-puzzle-aqua">LOGO PREVIEW</span>
                    </div>
                  </div>
                  <h4 className="font-medium mb-2">Primary Logo</h4>
                  <p className="text-sm text-muted-foreground mb-4">PNG, SVG | Transparent Background</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs border-puzzle-aqua/30"
                      onClick={() => handleDownloadAsset('Primary Logo - PNG')}
                    >
                      PNG
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs border-puzzle-aqua/30"
                      onClick={() => handleDownloadAsset('Primary Logo - SVG')}
                    >
                      SVG
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs border-puzzle-aqua/30"
                      onClick={() => handleDownloadAsset('Primary Logo - AI')}
                    >
                      AI
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Dark Logo */}
              <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
                <CardContent className="pt-6">
                  <div className="aspect-video bg-black rounded flex items-center justify-center mb-4">
                    <div className="w-3/4 h-1/2 bg-puzzle-aqua/30 rounded flex items-center justify-center">
                      <span className="font-game text-xl text-puzzle-aqua">DARK LOGO</span>
                    </div>
                  </div>
                  <h4 className="font-medium mb-2">Dark Background Logo</h4>
                  <p className="text-sm text-muted-foreground mb-4">PNG, SVG | For dark backgrounds</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs border-puzzle-aqua/30"
                      onClick={() => handleDownloadAsset('Dark Logo - PNG')}
                    >
                      PNG
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs border-puzzle-aqua/30"
                      onClick={() => handleDownloadAsset('Dark Logo - SVG')}
                    >
                      SVG
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Symbol */}
              <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
                <CardContent className="pt-6">
                  <div className="aspect-video bg-white/5 rounded flex items-center justify-center mb-4">
                    <div className="w-1/2 h-1/2 bg-puzzle-aqua/30 rounded-full flex items-center justify-center">
                      <span className="font-game text-xl text-puzzle-aqua">ICON</span>
                    </div>
                  </div>
                  <h4 className="font-medium mb-2">Brand Symbol</h4>
                  <p className="text-sm text-muted-foreground mb-4">PNG, SVG | Icon only version</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs border-puzzle-aqua/30"
                      onClick={() => handleDownloadAsset('Symbol - PNG')}
                    >
                      PNG
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs border-puzzle-aqua/30"
                      onClick={() => handleDownloadAsset('Symbol - SVG')}
                    >
                      SVG
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Separator className="my-8 bg-puzzle-aqua/20" />

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-puzzle-white mb-4 flex items-center gap-2">
                <Image className="text-puzzle-aqua" size={20} />
                Brand Guidelines
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 border border-puzzle-aqua/20 rounded-lg">
                  <h4 className="font-medium mb-2">Brand Colors</h4>
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-puzzle-aqua"></div>
                      <span className="text-sm text-muted-foreground">Primary: #4ECDC4</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-puzzle-gold"></div>
                      <span className="text-sm text-muted-foreground">Accent: #FFD700</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-puzzle-black"></div>
                      <span className="text-sm text-muted-foreground">Background: #121212</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-puzzle-aqua/30"
                    onClick={() => handleDownloadAsset('Color Palette')}
                  >
                    Download Color Palette
                  </Button>
                </div>
                
                <div className="p-4 border border-puzzle-aqua/20 rounded-lg">
                  <h4 className="font-medium mb-2">Typography</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Headings: Game Font<br />
                    Body: Inter<br />
                    Accents: Montserrat
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-puzzle-aqua/30"
                    onClick={() => handleDownloadAsset('Font Package')}
                  >
                    Download Font Package
                  </Button>
                </div>
                
                <div className="p-4 border border-puzzle-aqua/20 rounded-lg">
                  <h4 className="font-medium mb-2">Full Brand Guidelines</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete documentation on proper usage of The Puzzle Boss brand elements.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-puzzle-aqua/30"
                    onClick={() => handleDownloadAsset('Brand Guidelines PDF')}
                  >
                    Download PDF Guidelines
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="company" className="space-y-8">
            <h3 className="text-xl font-bold text-puzzle-white mb-4 flex items-center gap-2">
              <Info className="text-puzzle-aqua" size={20} />
              Company Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-puzzle-aqua">Company Description</h4>
                  <p className="text-muted-foreground text-sm">
                    The Puzzle Boss is the premier skill-based puzzle competition platform where players can win premium prizes through fair competition. Our platform offers a wide range of challenging puzzles across various difficulty levels, ensuring an engaging experience for puzzle enthusiasts of all skill levels.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-puzzle-aqua">Founded</h4>
                  <p className="text-muted-foreground text-sm">2024</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-puzzle-aqua">Headquarters</h4>
                  <p className="text-muted-foreground text-sm">San Francisco, California</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-puzzle-aqua">Key Facts</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Over 100,000 active users</li>
                    <li>500+ unique puzzle challenges</li>
                    <li>$1M+ in prizes awarded</li>
                    <li>Available in 25 countries</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-puzzle-aqua">Mission Statement</h4>
                  <p className="text-muted-foreground text-sm">
                    To create the world's most engaging skill-based puzzle platform where players can win premium prizes through fair competition, while fostering a community of puzzle enthusiasts.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-puzzle-aqua">Company Values</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li><span className="text-puzzle-white">Fairness:</span> We ensure all competitions are skill-based and provide equal opportunity.</li>
                    <li><span className="text-puzzle-white">Community:</span> We foster connections among puzzle enthusiasts worldwide.</li>
                    <li><span className="text-puzzle-white">Quality:</span> We provide only premium prizes and well-designed puzzles.</li>
                    <li><span className="text-puzzle-white">Innovation:</span> We continuously improve our platform and puzzle offerings.</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-puzzle-aqua">Funding</h4>
                  <p className="text-muted-foreground text-sm">
                    Secured $5M in seed funding in April 2025, led by Venture Partners with participation from Angel Investors.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Button 
                variant="outline"
                className="border-puzzle-aqua/30"
                onClick={() => handleDownloadAsset('Company Fact Sheet')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Download Company Fact Sheet
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-8">
            <h3 className="text-xl font-bold text-puzzle-white mb-4 flex items-center gap-2">
              <MessageSquareQuote className="text-puzzle-aqua" size={20} />
              Media Coverage & Resources
            </h3>
            
            <div className="space-y-6">
              <h4 className="font-medium text-puzzle-aqua">Press Releases</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-1">April 10, 2025</p>
                    <h5 className="text-lg font-medium mb-2">The Puzzle Boss Secures $5M in Seed Funding</h5>
                    <p className="text-sm text-muted-foreground mb-4">
                      The Puzzle Boss, a skill-based puzzle platform offering premium brand-name prizes, announced today that it has secured $5 million in seed funding...
                    </p>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-puzzle-aqua/30 w-full"
                      onClick={() => handleDownloadAsset('Press Release - Funding')}
                    >
                      Download Press Release
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-1">March 15, 2025</p>
                    <h5 className="text-lg font-medium mb-2">The Puzzle Boss Announces Strategic Partnership</h5>
                    <p className="text-sm text-muted-foreground mb-4">
                      The Puzzle Boss has partnered with a leading electronics retailer to offer the latest smartphones, laptops, and gaming consoles as prizes...
                    </p>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-puzzle-aqua/30 w-full"
                      onClick={() => handleDownloadAsset('Press Release - Partnership')}
                    >
                      Download Press Release
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-medium text-puzzle-aqua">Media Coverage</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-puzzle-aqua/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-16 bg-white/10 rounded flex items-center justify-center">
                      <span className="text-xs text-white/70">TECH INSIDER</span>
                    </div>
                    <span className="text-xs text-muted-foreground">March 28, 2025</span>
                  </div>
                  <h5 className="text-sm font-medium mb-2">How The Puzzle Boss is Revolutionizing Online Competitions</h5>
                  <Button 
                    variant="link" 
                    className="text-puzzle-aqua p-0 h-auto text-xs"
                  >
                    Read Article →
                  </Button>
                </div>
                
                <div className="p-4 border border-puzzle-aqua/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-16 bg-white/10 rounded flex items-center justify-center">
                      <span className="text-xs text-white/70">GAMING WEEKLY</span>
                    </div>
                    <span className="text-xs text-muted-foreground">March 5, 2025</span>
                  </div>
                  <h5 className="text-sm font-medium mb-2">The Puzzle Boss: Skill-Based Gaming with Real Prizes</h5>
                  <Button 
                    variant="link" 
                    className="text-puzzle-aqua p-0 h-auto text-xs"
                  >
                    Read Article →
                  </Button>
                </div>
                
                <div className="p-4 border border-puzzle-aqua/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-16 bg-white/10 rounded flex items-center justify-center">
                      <span className="text-xs text-white/70">STARTUP JOURNAL</span>
                    </div>
                    <span className="text-xs text-muted-foreground">February 10, 2025</span>
                  </div>
                  <h5 className="text-sm font-medium mb-2">The Puzzle Boss Secures Funding to Expand Platform</h5>
                  <Button 
                    variant="link" 
                    className="text-puzzle-aqua p-0 h-auto text-xs"
                  >
                    Read Article →
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-medium text-puzzle-aqua">Product Images</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="aspect-video bg-puzzle-black/70 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Product Screenshot 1</span>
                </div>
                <div className="aspect-video bg-puzzle-black/70 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Product Screenshot 2</span>
                </div>
                <div className="aspect-video bg-puzzle-black/70 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Product Screenshot 3</span>
                </div>
              </div>
              <Button 
                variant="outline"
                className="border-puzzle-aqua/30"
                onClick={() => handleDownloadAsset('Product Screenshots')}
              >
                <FileImage className="mr-2 h-4 w-4" />
                Download All Product Images
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-8">
            <h3 className="text-xl font-bold text-puzzle-white mb-4 flex items-center gap-2">
              <Users className="text-puzzle-aqua" size={20} />
              Leadership Team
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* CEO */}
              <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-puzzle-aqua/20 flex items-center justify-center">
                      <Users className="h-8 w-8 text-puzzle-aqua" />
                    </div>
                    <div>
                      <h4 className="font-bold">Alex Morgan</h4>
                      <p className="text-sm text-puzzle-aqua">Founder & CEO</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Alex has over 15 years of experience in the gaming industry, previously founding GamingPlatform Inc, which was acquired in 2022. Expert in skill-based gaming and prize competition regulations.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs border-puzzle-aqua/30 w-full"
                    onClick={() => handleDownloadAsset('Bio - Alex Morgan')}
                  >
                    Download Bio & Headshot
                  </Button>
                </CardContent>
              </Card>
              
              {/* CTO */}
              <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-puzzle-aqua/20 flex items-center justify-center">
                      <Users className="h-8 w-8 text-puzzle-aqua" />
                    </div>
                    <div>
                      <h4 className="font-bold">Jamie Lee</h4>
                      <p className="text-sm text-puzzle-aqua">CTO</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Jamie brings extensive technical expertise with previous roles at major tech companies. Specializes in creating scalable gaming platforms and implementing fair-play algorithms.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs border-puzzle-aqua/30 w-full"
                    onClick={() => handleDownloadAsset('Bio - Jamie Lee')}
                  >
                    Download Bio & Headshot
                  </Button>
                </CardContent>
              </Card>
              
              {/* COO */}
              <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-puzzle-aqua/20 flex items-center justify-center">
                      <Users className="h-8 w-8 text-puzzle-aqua" />
                    </div>
                    <div>
                      <h4 className="font-bold">Taylor Rivera</h4>
                      <p className="text-sm text-puzzle-aqua">COO</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Taylor oversees day-to-day operations and strategic partnerships. Previously led operations at a Fortune 500 company with expertise in scaling startups and optimizing customer experiences.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs border-puzzle-aqua/30 w-full"
                    onClick={() => handleDownloadAsset('Bio - Taylor Rivera')}
                  >
                    Download Bio & Headshot
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-4">
              <Button 
                variant="outline"
                className="border-puzzle-aqua/30"
                onClick={() => handleDownloadAsset('Executive Team Package')}
              >
                <Users className="mr-2 h-4 w-4" />
                Download Complete Leadership Information
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 p-6 border border-puzzle-aqua/20 rounded-lg bg-gradient-to-r from-puzzle-black to-puzzle-aqua/10">
          <h2 className="text-2xl font-bold text-puzzle-aqua mb-4">Press Contact</h2>
          <p className="text-muted-foreground mb-6">
            For media inquiries, interview requests, or additional information, please contact our PR team.
          </p>
          <div className="space-y-2">
            <p><span className="text-puzzle-aqua">Email:</span> <a href="mailto:press@puzzleboss.com" className="text-puzzle-white hover:underline">press@puzzleboss.com</a></p>
            <p><span className="text-puzzle-aqua">Phone:</span> +1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PressKit;
