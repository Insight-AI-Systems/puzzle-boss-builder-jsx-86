
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Users, Target, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-game text-puzzle-aqua mb-4">About The Puzzle Boss</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Learn about our mission, team, and the story behind the world's premier puzzle competition platform
        </p>
      </div>

      {/* Mission Section */}
      <div className="mb-16 p-6 bg-gradient-to-r from-puzzle-black to-puzzle-aqua/10 rounded-lg">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold text-puzzle-aqua mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              The Puzzle Boss was founded with a simple yet powerful mission: to create the world's most engaging 
              skill-based puzzle platform where players can win premium prizes through fair competition.
            </p>
            <p className="text-lg text-muted-foreground">
              We believe in the power of puzzles to challenge minds, spark creativity, and bring people together
              in friendly competition.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="h-56 w-56 bg-puzzle-black/50 rounded-full flex items-center justify-center border-2 border-puzzle-aqua">
              <Target className="h-24 w-24 text-puzzle-aqua" />
              <span className="sr-only">PLACEHOLDER: Mission Image</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Company Values */}
      <h2 className="text-2xl md:text-3xl font-bold text-puzzle-aqua mb-8">Our Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Card className="bg-puzzle-black/20 border-puzzle-aqua/20 hover:border-puzzle-aqua/50 transition-all">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-puzzle-aqua/20 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-puzzle-aqua" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fairness</h3>
              <p className="text-muted-foreground">
                We ensure all competitions are skill-based and provide equal opportunity for all participants.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-puzzle-black/20 border-puzzle-aqua/20 hover:border-puzzle-aqua/50 transition-all">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-puzzle-aqua/20 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-puzzle-aqua" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">
                We foster a supportive community of puzzle enthusiasts who share knowledge and experiences.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-puzzle-black/20 border-puzzle-aqua/20 hover:border-puzzle-aqua/50 transition-all">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-puzzle-aqua/20 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-puzzle-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-muted-foreground">
                We provide only authentic, premium prizes and well-designed puzzles for maximum enjoyment.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-puzzle-black/20 border-puzzle-aqua/20 hover:border-puzzle-aqua/50 transition-all">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-puzzle-aqua/20 flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-puzzle-aqua" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously improve our platform and expand our puzzle offerings to keep the experience fresh.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Team Section */}
      <h2 className="text-2xl md:text-3xl font-bold text-puzzle-aqua mb-8">Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden bg-puzzle-black/20 border-puzzle-aqua/20">
            <div className="h-64 bg-gradient-to-b from-puzzle-aqua/20 to-puzzle-black flex items-center justify-center">
              <Users className="h-24 w-24 text-puzzle-aqua/50" />
              <span className="sr-only">PLACEHOLDER: Team Member Photo</span>
            </div>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-1">Team Member Name</h3>
              <p className="text-puzzle-aqua mb-4">Position Title</p>
              <p className="text-muted-foreground mb-4">
                Brief bio about the team member and their background in the puzzle/gaming industry.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* CTA Section */}
      <div className="text-center p-8 bg-gradient-to-r from-puzzle-aqua/20 to-puzzle-gold/10 rounded-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-puzzle-white mb-4">Join Our Community</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Become part of The Puzzle Boss family. Create an account today to start solving puzzles and winning premium prizes!
        </p>
        <Button size="lg" className="bg-puzzle-aqua hover:bg-puzzle-aqua/80" asChild>
          <Link to="/auth?signup=true">Sign Up Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default About;
