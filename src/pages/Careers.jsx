
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import MainHeader from '@/components/header';

const Careers = () => {
  const jobOpenings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "We're looking for a Senior Frontend Developer to join our team and help build engaging puzzle experiences using React and modern web technologies.",
      responsibilities: [
        "Architect and implement frontend features for our puzzle platform",
        "Collaborate with designers to create intuitive and responsive user interfaces",
        "Optimize application performance and ensure cross-browser compatibility",
        "Write clean, maintainable code with comprehensive unit and integration tests",
        "Mentor junior developers and contribute to engineering best practices"
      ],
      requirements: [
        "5+ years of experience with modern JavaScript and React",
        "Strong understanding of responsive design principles",
        "Experience with state management libraries (Redux, Zustand, etc.)",
        "Knowledge of modern CSS frameworks like Tailwind CSS",
        "Experience with testing frameworks (Jest, React Testing Library)"
      ]
    },
    {
      id: 2,
      title: "Backend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Join our backend team to build scalable services that power our global puzzle competition platform.",
      responsibilities: [
        "Design and develop robust backend services using Node.js/TypeScript",
        "Implement real-time features for puzzle competitions and leaderboards",
        "Collaborate with frontend developers to build and integrate APIs",
        "Optimize database queries and ensure data integrity",
        "Participate in code reviews and technical design discussions"
      ],
      requirements: [
        "3+ years of backend development experience",
        "Strong knowledge of Node.js and TypeScript",
        "Experience with SQL and NoSQL databases",
        "Understanding of RESTful API design principles",
        "Familiarity with cloud services (AWS, GCP, or Azure)"
      ]
    },
    {
      id: 3,
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Help us create beautiful, intuitive interfaces that make puzzle solving a delightful experience for our users.",
      responsibilities: [
        "Create wireframes, prototypes, and high-fidelity designs for web applications",
        "Conduct user research and usability testing to inform design decisions",
        "Collaborate with product managers and engineers to implement designs",
        "Develop and maintain our design system",
        "Stay current with UX trends and best practices"
      ],
      requirements: [
        "3+ years of experience in UI/UX design for web applications",
        "Proficiency with design tools like Figma or Adobe XD",
        "Strong portfolio demonstrating user-centered design process",
        "Understanding of accessibility standards and responsive design",
        "Excellent communication and collaboration skills"
      ]
    },
    {
      id: 4,
      title: "Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Drive growth for The Puzzle Boss through innovative marketing strategies and campaigns.",
      responsibilities: [
        "Develop and execute marketing strategies to acquire new users",
        "Manage social media presence and community engagement",
        "Collaborate with the content team to create compelling marketing materials",
        "Analyze campaign performance and optimize for better results",
        "Stay current with digital marketing trends and best practices"
      ],
      requirements: [
        "4+ years of experience in digital marketing",
        "Strong understanding of social media marketing and content strategy",
        "Experience with marketing analytics tools",
        "Excellent written and verbal communication skills",
        "Creative problem-solving abilities"
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-puzzle-black">
      <MainHeader />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-puzzle-gold">Careers at The Puzzle Boss</h1>
          <p className="text-muted-foreground mb-8">Join our team and help build the future of puzzle competitions!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-card p-6 rounded-lg shadow-lg text-center">
              <div className="w-12 h-12 bg-puzzle-aqua/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-puzzle-aqua" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovative Work</h3>
              <p className="text-card-foreground">Build cutting-edge puzzle experiences for a global audience.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-lg text-center">
              <div className="w-12 h-12 bg-puzzle-aqua/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-puzzle-aqua" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Remote-First</h3>
              <p className="text-card-foreground">Work from anywhere with our fully distributed team.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-lg text-center">
              <div className="w-12 h-12 bg-puzzle-aqua/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-puzzle-aqua" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Growth Opportunities</h3>
              <p className="text-card-foreground">Develop your skills and advance your career with us.</p>
            </div>
          </div>
          
          <div className="bg-card p-8 rounded-lg shadow-lg mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="flex items-center text-xl font-semibold mb-3">
                  <span className="text-puzzle-aqua mr-2">◆</span>
                  <span>Player First</span>
                </h3>
                <p className="text-card-foreground mb-6">
                  We prioritize creating exceptional experiences for our puzzle players in everything we do.
                </p>
                
                <h3 className="flex items-center text-xl font-semibold mb-3">
                  <span className="text-puzzle-aqua mr-2">◆</span>
                  <span>Continuous Innovation</span>
                </h3>
                <p className="text-card-foreground mb-6">
                  We're always looking for new ways to improve our puzzles, platform, and processes.
                </p>
                
                <h3 className="flex items-center text-xl font-semibold mb-3">
                  <span className="text-puzzle-aqua mr-2">◆</span>
                  <span>Diverse Perspectives</span>
                </h3>
                <p className="text-card-foreground">
                  We believe that different viewpoints lead to better solutions and more engaging puzzles.
                </p>
              </div>
              
              <div>
                <h3 className="flex items-center text-xl font-semibold mb-3">
                  <span className="text-puzzle-aqua mr-2">◆</span>
                  <span>Quality Craftsmanship</span>
                </h3>
                <p className="text-card-foreground mb-6">
                  We take pride in creating well-crafted, polished experiences in every aspect of our work.
                </p>
                
                <h3 className="flex items-center text-xl font-semibold mb-3">
                  <span className="text-puzzle-aqua mr-2">◆</span>
                  <span>Transparency</span>
                </h3>
                <p className="text-card-foreground mb-6">
                  We communicate openly and honestly with our team members and our community.
                </p>
                
                <h3 className="flex items-center text-xl font-semibold mb-3">
                  <span className="text-puzzle-aqua mr-2">◆</span>
                  <span>Responsible Growth</span>
                </h3>
                <p className="text-card-foreground">
                  We build for the long term, making decisions that support sustainable success.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-8 rounded-lg shadow-lg mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Open Positions</h2>
            
            <Tabs defaultValue="engineering">
              <TabsList className="mb-6 bg-card border border-puzzle-aqua/30">
                <TabsTrigger value="engineering" className="data-[state=active]:bg-puzzle-aqua/20 data-[state=active]:text-puzzle-aqua">
                  Engineering
                </TabsTrigger>
                <TabsTrigger value="design" className="data-[state=active]:bg-puzzle-aqua/20 data-[state=active]:text-puzzle-aqua">
                  Design
                </TabsTrigger>
                <TabsTrigger value="marketing" className="data-[state=active]:bg-puzzle-aqua/20 data-[state=active]:text-puzzle-aqua">
                  Marketing
                </TabsTrigger>
                <TabsTrigger value="all" className="data-[state=active]:bg-puzzle-aqua/20 data-[state=active]:text-puzzle-aqua">
                  All Departments
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="engineering" className="space-y-6">
                {jobOpenings
                  .filter(job => job.department === "Engineering")
                  .map(job => (
                    <div key={job.id} className="border border-puzzle-aqua/30 rounded-lg p-6 hover:bg-puzzle-aqua/5 transition-colors">
                      <div className="flex flex-wrap justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-puzzle-aqua">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                          <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">{job.location}</Badge>
                          <Badge variant="outline" className="border-puzzle-gold text-puzzle-gold">{job.type}</Badge>
                        </div>
                      </div>
                      <p className="mb-4 text-card-foreground">{job.description}</p>
                      <Button className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black">
                        View Details
                      </Button>
                    </div>
                  ))}
              </TabsContent>
              
              <TabsContent value="design" className="space-y-6">
                {jobOpenings
                  .filter(job => job.department === "Design")
                  .map(job => (
                    <div key={job.id} className="border border-puzzle-aqua/30 rounded-lg p-6 hover:bg-puzzle-aqua/5 transition-colors">
                      <div className="flex flex-wrap justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-puzzle-aqua">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                          <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">{job.location}</Badge>
                          <Badge variant="outline" className="border-puzzle-gold text-puzzle-gold">{job.type}</Badge>
                        </div>
                      </div>
                      <p className="mb-4 text-card-foreground">{job.description}</p>
                      <Button className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black">
                        View Details
                      </Button>
                    </div>
                  ))}
              </TabsContent>
              
              <TabsContent value="marketing" className="space-y-6">
                {jobOpenings
                  .filter(job => job.department === "Marketing")
                  .map(job => (
                    <div key={job.id} className="border border-puzzle-aqua/30 rounded-lg p-6 hover:bg-puzzle-aqua/5 transition-colors">
                      <div className="flex flex-wrap justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-puzzle-aqua">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                          <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">{job.location}</Badge>
                          <Badge variant="outline" className="border-puzzle-gold text-puzzle-gold">{job.type}</Badge>
                        </div>
                      </div>
                      <p className="mb-4 text-card-foreground">{job.description}</p>
                      <Button className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black">
                        View Details
                      </Button>
                    </div>
                  ))}
              </TabsContent>
              
              <TabsContent value="all" className="space-y-6">
                {jobOpenings.map(job => (
                  <div key={job.id} className="border border-puzzle-aqua/30 rounded-lg p-6 hover:bg-puzzle-aqua/5 transition-colors">
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-puzzle-aqua">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">Department: {job.department}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                        <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">{job.location}</Badge>
                        <Badge variant="outline" className="border-puzzle-gold text-puzzle-gold">{job.type}</Badge>
                      </div>
                    </div>
                    <p className="mb-4 text-card-foreground">{job.description}</p>
                    <Button className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black">
                      View Details
                    </Button>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="bg-gradient-to-br from-puzzle-aqua/20 to-puzzle-black p-8 rounded-lg border border-puzzle-aqua/30 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-puzzle-gold">Don't See the Right Fit?</h2>
            <p className="text-card-foreground mb-6 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. Send us your resume and let us know how you'd like to contribute to The Puzzle Boss!
            </p>
            <Button className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black">
              Submit Your Application
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
