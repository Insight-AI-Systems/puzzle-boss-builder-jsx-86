
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import MainHeader from '@/components/header';

const Press = () => {
  const pressReleases = [
    {
      id: 1,
      date: "April 10, 2025",
      title: "The Puzzle Boss Launches Global Puzzle Competition Platform",
      excerpt: "The Puzzle Boss announces the official launch of its global, skill-based jigsaw puzzle platform where players can compete to win premium brand-name prizes.",
      link: "#"
    },
    {
      id: 2,
      date: "March 15, 2025",
      title: "The Puzzle Boss Secures $5M in Seed Funding",
      excerpt: "Leading tech investors back The Puzzle Boss in its mission to revolutionize online puzzle competitions with a $5 million seed funding round.",
      link: "#"
    },
    {
      id: 3,
      date: "February 28, 2025",
      title: "The Puzzle Boss Partners with Top Electronics Brands",
      excerpt: "New partnerships with leading electronics manufacturers will bring high-value prizes to The Puzzle Boss platform, including smartphones, laptops, and gaming consoles.",
      link: "#"
    },
    {
      id: 4,
      date: "January 20, 2025",
      title: "The Puzzle Boss Announces Beta Launch Date",
      excerpt: "Puzzle enthusiasts can sign up for early access to The Puzzle Boss platform starting February 1, with the public beta launching later that month.",
      link: "#"
    }
  ];

  const mediaFeatures = [
    {
      id: 1,
      outlet: "Tech Insider",
      title: "How The Puzzle Boss is Gamifying Jigsaw Puzzles",
      date: "April 5, 2025",
      logo: "TI",
      link: "#"
    },
    {
      id: 2,
      outlet: "Gaming Chronicle",
      title: "The Puzzle Boss: Revolutionizing Competitive Puzzling",
      date: "March 30, 2025",
      logo: "GC",
      link: "#"
    },
    {
      id: 3,
      outlet: "Digital Trends",
      title: "Win Premium Prizes by Solving Puzzles? The Puzzle Boss Makes It Possible",
      date: "March 22, 2025",
      logo: "DT",
      link: "#"
    },
    {
      id: 4,
      outlet: "Startup Weekly",
      title: "The Puzzle Boss Secures Major Funding to Expand Platform",
      date: "March 16, 2025",
      logo: "SW",
      link: "#"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-puzzle-black">
      <MainHeader />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-puzzle-gold">Press & Media</h1>
          <p className="text-muted-foreground mb-8">Get the latest news and resources about The Puzzle Boss.</p>
          
          <div className="bg-card p-8 rounded-lg shadow-lg mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Media Contacts</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-puzzle-aqua">Press Inquiries</h3>
                <p className="text-card-foreground mb-2">For press inquiries and interview requests:</p>
                <p className="text-card-foreground mb-4">
                  <strong>Contact:</strong> Sarah Williams<br />
                  <strong>Email:</strong> <a href="mailto:press@puzzleboss.com" className="text-puzzle-aqua hover:underline">press@puzzleboss.com</a><br />
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
                <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                  Request Media Kit
                </Button>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-puzzle-aqua">Partnership Opportunities</h3>
                <p className="text-card-foreground mb-2">For partnership and collaboration inquiries:</p>
                <p className="text-card-foreground mb-4">
                  <strong>Contact:</strong> Michael Chen<br />
                  <strong>Email:</strong> <a href="mailto:partnerships@puzzleboss.com" className="text-puzzle-aqua hover:underline">partnerships@puzzleboss.com</a><br />
                  <strong>Phone:</strong> +1 (555) 987-6543
                </p>
                <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                  Partnership Information
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-8 rounded-lg shadow-lg mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Press Releases</h2>
            
            <div className="space-y-8">
              {pressReleases.map(release => (
                <div key={release.id} className="border-b border-puzzle-aqua/20 pb-6 last:border-b-0 last:pb-0">
                  <div className="text-sm text-muted-foreground mb-2">{release.date}</div>
                  <h3 className="text-xl font-semibold mb-2 text-puzzle-aqua">{release.title}</h3>
                  <p className="text-card-foreground mb-4">{release.excerpt}</p>
                  <a href={release.link} className="text-puzzle-gold hover:underline">Read Full Release →</a>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                View All Press Releases
              </Button>
            </div>
          </div>
          
          <div className="bg-card p-8 rounded-lg shadow-lg mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">In The News</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediaFeatures.map(feature => (
                <div key={feature.id} className="border border-puzzle-aqua/30 rounded-lg p-4 hover:bg-puzzle-aqua/5 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                      <span className="font-bold text-gray-600">{feature.logo}</span>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{feature.outlet}</div>
                      <div className="text-xs text-muted-foreground">{feature.date}</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-puzzle-aqua">{feature.title}</h3>
                  <a href={feature.link} className="text-puzzle-gold hover:underline text-sm">Read Article →</a>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                View All Media Coverage
              </Button>
            </div>
          </div>
          
          <div className="bg-card p-8 rounded-lg shadow-lg mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Company Info</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-puzzle-aqua">About The Puzzle Boss</h3>
                <p className="text-card-foreground mb-4">
                  The Puzzle Boss is a global, skill-based jigsaw puzzle platform where players race to complete puzzles to win premium brand-name prizes. Founded in 2025, the company is focused on creating fair, engaging, and secure puzzle competitions for enthusiasts around the world.
                </p>
                <p className="text-card-foreground">
                  Headquartered in San Francisco with a fully remote team spanning multiple continents, The Puzzle Boss is dedicated to revolutionizing the way people experience jigsaw puzzles online.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-puzzle-aqua">Leadership Team</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-card-foreground">Alan Thompson</p>
                    <p className="text-sm text-muted-foreground">Co-Founder & CEO</p>
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">Tamara Rodriguez</p>
                    <p className="text-sm text-muted-foreground">Co-Founder & CTO</p>
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">Vincent Lee</p>
                    <p className="text-sm text-muted-foreground">Chief Operating Officer</p>
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">Julie Chen</p>
                    <p className="text-sm text-muted-foreground">Chief Marketing Officer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-puzzle-aqua/20 to-puzzle-black p-8 rounded-lg border border-puzzle-aqua/30">
            <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Brand Assets</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-puzzle-aqua">Logos & Graphics</h3>
                <p className="text-card-foreground mb-4">
                  Download official logos, icons, and brand graphics for The Puzzle Boss. Available in various formats for both digital and print use.
                </p>
                <Button className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black">
                  Download Brand Kit
                </Button>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-puzzle-aqua">Photos & Videos</h3>
                <p className="text-card-foreground mb-4">
                  Access high-resolution images, product screenshots, and promotional videos for media use. All assets are available for use with proper attribution.
                </p>
                <Button className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black">
                  Access Media Library
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Press;
