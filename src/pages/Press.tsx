
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NewspaperIcon, Download, Mail, FileText, FileImage, ExternalLink } from 'lucide-react';

const pressReleases = [
  {
    id: 1,
    title: "The Puzzle Boss Secures $5M in Seed Funding",
    date: "April 10, 2025",
    excerpt: "The Puzzle Boss, a skill-based puzzle platform offering premium brand-name prizes, announced today that it has secured $5 million in seed funding led by Venture Partners with participation from Angel Investors.",
    link: "#"
  },
  {
    id: 2,
    title: "The Puzzle Boss Announces Strategic Partnership with Major Electronics Retailer",
    date: "March 15, 2025",
    excerpt: "The Puzzle Boss has partnered with a leading electronics retailer to offer the latest smartphones, laptops, and gaming consoles as prizes on its skill-based puzzle platform.",
    link: "#"
  },
  {
    id: 3,
    title: "The Puzzle Boss Reaches 100,000 Active Users Milestone",
    date: "February 22, 2025",
    excerpt: "The Puzzle Boss, the premier skill-based puzzle platform, announced today that it has reached 100,000 active users, marking a significant milestone in the company's growth.",
    link: "#"
  }
];

const mediaFeatures = [
  {
    id: 1,
    outlet: "Tech Insider",
    title: "How The Puzzle Boss is Revolutionizing Online Competitions",
    date: "March 28, 2025",
    logo: "https://placehold.co/60x30/2a2a2a/CCCCCC?text=TI",
    link: "#"
  },
  {
    id: 2,
    outlet: "Gaming Weekly",
    title: "The Puzzle Boss: Skill-Based Gaming with Real Prizes",
    date: "March 5, 2025",
    logo: "https://placehold.co/60x30/2a2a2a/CCCCCC?text=GW",
    link: "#"
  },
  {
    id: 3,
    outlet: "Startup Journal",
    title: "The Puzzle Boss Secures Funding to Expand Platform",
    date: "February 10, 2025",
    logo: "https://placehold.co/60x30/2a2a2a/CCCCCC?text=SJ",
    link: "#"
  },
  {
    id: 4,
    outlet: "Digital Trends",
    title: "The Future of Online Competitions: Interview with The Puzzle Boss CEO",
    date: "January 15, 2025",
    logo: "https://placehold.co/60x30/2a2a2a/CCCCCC?text=DT",
    link: "#"
  }
];

const pressContacts = [
  {
    name: "Sarah Johnson",
    title: "PR Director",
    email: "press@puzzleboss.com",
    phone: "+1 (555) 123-4567"
  },
  {
    name: "Michael Chen",
    title: "Media Relations Manager",
    email: "media@puzzleboss.com",
    phone: "+1 (555) 987-6543"
  }
];

const Press = () => {
  return (
    <PageLayout 
      title="Press & Media" 
      subtitle="News, press releases, and media resources for The Puzzle Boss"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-puzzle-aqua mb-6 flex items-center">
            <NewspaperIcon className="h-6 w-6 mr-2" />
            Press Releases
          </h2>
          
          <div className="space-y-6">
            {pressReleases.map((release) => (
              <Card key={release.id} className="bg-puzzle-black/50 border-puzzle-aqua/20">
                <CardHeader>
                  <div className="text-sm text-muted-foreground mb-1">{release.date}</div>
                  <CardTitle className="text-xl text-puzzle-white">
                    {release.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {release.excerpt}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
                    asChild
                  >
                    <a href={release.link}>
                      <FileText className="h-4 w-4 mr-2" />
                      Read Full Release
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button variant="ghost" className="text-muted-foreground hover:text-puzzle-aqua">
              View All Press Releases
            </Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-puzzle-aqua mb-6 flex items-center">
            <Mail className="h-6 w-6 mr-2" />
            Media Contacts
          </h2>
          
          <Card className="bg-puzzle-black/50 border-puzzle-aqua/20 mb-8">
            <CardHeader>
              <CardTitle className="text-lg text-puzzle-white">For Press Inquiries</CardTitle>
              <CardDescription>
                Please contact our media team for interviews, information, or assets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pressContacts.map((contact, index) => (
                <div key={index}>
                  <h3 className="font-medium text-puzzle-white">{contact.name}</h3>
                  <p className="text-sm text-muted-foreground">{contact.title}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <a href={`mailto:${contact.email}`} className="text-puzzle-aqua hover:underline">
                        {contact.email}
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  </div>
                  {index < pressContacts.length - 1 && (
                    <Separator className="my-4 bg-puzzle-aqua/20" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
          
          <h2 className="text-xl font-bold text-puzzle-aqua mb-4 flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Media Resources
          </h2>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-puzzle-aqua/30 text-puzzle-white hover:bg-puzzle-aqua/10"
            >
              <FileImage className="h-4 w-4 mr-2 text-puzzle-aqua" />
              Download Logo Pack
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-puzzle-aqua/30 text-puzzle-white hover:bg-puzzle-aqua/10"
            >
              <FileImage className="h-4 w-4 mr-2 text-puzzle-aqua" />
              Product Screenshots
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-puzzle-aqua/30 text-puzzle-white hover:bg-puzzle-aqua/10"
            >
              <FileText className="h-4 w-4 mr-2 text-puzzle-aqua" />
              Company Fact Sheet
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-puzzle-aqua/30 text-puzzle-white hover:bg-puzzle-aqua/10"
            >
              <FileText className="h-4 w-4 mr-2 text-puzzle-aqua" />
              Founder Biographies
            </Button>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-puzzle-aqua mb-6 flex items-center">
        <NewspaperIcon className="h-6 w-6 mr-2" />
        In The News
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {mediaFeatures.map((feature) => (
          <Card key={feature.id} className="bg-puzzle-black/50 border-puzzle-aqua/20 flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="h-8 w-16 bg-white/10 rounded flex items-center justify-center">
                  <img src={feature.logo} alt={feature.outlet} className="max-h-6" />
                </div>
                <span className="text-sm text-muted-foreground">{feature.date}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <h3 className="text-lg font-medium text-puzzle-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                Featured in <span className="font-medium text-puzzle-aqua">{feature.outlet}</span>
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full justify-center border-puzzle-aqua/30 text-puzzle-white hover:bg-puzzle-aqua/10"
                asChild
              >
                <a href={feature.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Read Article
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Card className="border-puzzle-aqua/30 bg-gradient-to-r from-puzzle-aqua/10 to-puzzle-black/90">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-puzzle-white mb-2">Press Kit</h3>
              <p className="text-muted-foreground max-w-md">
                Download our comprehensive press kit containing logos, product images, company information, and executive bios.
              </p>
            </div>
            <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
              <Download className="h-4 w-4 mr-2" />
              Download Press Kit
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default Press;
