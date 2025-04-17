
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BriefcaseIcon, Globe, Users, Zap, HeartHandshake, Trophy, BarChart } from 'lucide-react';

const jobOpenings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    description: "We're looking for a Senior Frontend Developer to help build and maintain our React-based puzzle platform. The ideal candidate has experience with modern frontend frameworks and a passion for creating engaging user experiences.",
    requirements: [
      "5+ years of experience with React and TypeScript",
      "Experience with state management (Redux, Context API)",
      "Strong CSS skills and familiarity with Tailwind CSS",
      "Knowledge of performance optimization techniques",
      "Experience with responsive design and accessibility"
    ]
  },
  {
    id: 2,
    title: "Puzzle Designer",
    department: "Content",
    location: "Remote",
    type: "Full-time",
    description: "As a Puzzle Designer, you'll be responsible for creating engaging and challenging puzzles for our platform. You'll work closely with our product and development teams to ensure puzzles are fair, fun, and technically feasible.",
    requirements: [
      "Experience designing puzzles or games",
      "Strong analytical and problem-solving skills",
      "Ability to create puzzles with varying difficulty levels",
      "Understanding of user experience principles",
      "Excellent communication and collaboration skills"
    ]
  },
  {
    id: 3,
    title: "Marketing Manager",
    department: "Marketing",
    location: "Hybrid (New York)",
    type: "Full-time",
    description: "We're seeking a Marketing Manager to develop and execute marketing strategies that drive user acquisition and engagement. The ideal candidate has experience in digital marketing and a data-driven approach to decision-making.",
    requirements: [
      "5+ years of experience in digital marketing",
      "Experience with user acquisition strategies",
      "Proficiency with analytics tools and A/B testing",
      "Strong project management skills",
      "Experience in the gaming or puzzle industry a plus"
    ]
  },
  {
    id: 4,
    title: "Customer Support Specialist",
    department: "Operations",
    location: "Remote",
    type: "Part-time",
    description: "As a Customer Support Specialist, you'll be the first point of contact for our users. You'll help resolve issues, answer questions, and ensure a positive experience for everyone using our platform.",
    requirements: [
      "Previous customer service experience",
      "Excellent written and verbal communication skills",
      "Ability to work independently and problem-solve",
      "Patient and empathetic approach to user concerns",
      "Familiarity with helpdesk software"
    ]
  },
  {
    id: 5,
    title: "Backend Developer",
    department: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    description: "We're looking for a Backend Developer to build and maintain our server-side applications. You'll work with our frontend team to ensure seamless integration and optimal performance.",
    requirements: [
      "Experience with Node.js and TypeScript",
      "Familiarity with PostgreSQL and Supabase",
      "Understanding of RESTful APIs and WebSockets",
      "Experience with serverless architecture",
      "Knowledge of security best practices"
    ]
  }
];

const values = [
  {
    icon: Zap,
    title: "Innovation",
    description: "We constantly seek new ways to create engaging puzzle experiences and push the boundaries of what's possible."
  },
  {
    icon: HeartHandshake,
    title: "Integrity",
    description: "We operate with transparency and fairness in everything we do, from puzzle design to prize fulfillment."
  },
  {
    icon: Users,
    title: "Community",
    description: "We foster an inclusive environment where puzzle enthusiasts from all backgrounds can connect and compete."
  },
  {
    icon: Trophy,
    title: "Excellence",
    description: "We strive for the highest quality in our puzzles, platform, and customer experience."
  }
];

const benefits = [
  "Competitive salary and equity packages",
  "Remote-first culture with flexible working hours",
  "Unlimited PTO policy that we actually encourage you to use",
  "Premium health, dental, and vision insurance",
  "401(k) matching program",
  "Monthly wellness stipend",
  "Home office setup allowance",
  "Continuous learning and development budget",
  "Regular team retreats and events",
  "Free credits to play puzzles on our platform"
];

const JobCard = ({ job }: { job: typeof jobOpenings[0] }) => {
  return (
    <Card className="bg-puzzle-black/50 border-puzzle-aqua/20 transition-all hover:border-puzzle-aqua/50 hover:shadow-lg hover:shadow-puzzle-aqua/10">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">{job.department}</Badge>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-puzzle-aqua/50">{job.type}</Badge>
            <Badge variant="outline" className="border-puzzle-aqua/50">{job.location}</Badge>
          </div>
        </div>
        <CardTitle className="text-xl text-puzzle-white">{job.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{job.description}</p>
        <div className="space-y-2">
          <h4 className="font-medium text-puzzle-white">Requirements:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {job.requirements.map((req, index) => (
              <li key={index} className="text-sm text-muted-foreground">{req}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80">
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

const Careers = () => {
  return (
    <PageLayout 
      title="Careers" 
      subtitle="Join our team and help build the future of puzzle competitions"
    >
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-4 bg-puzzle-aqua/10 rounded-full mb-4">
          <BriefcaseIcon className="h-10 w-10 text-puzzle-aqua" />
        </div>
        <h2 className="text-2xl font-bold text-puzzle-white mb-2">Why Work With Us</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          At The Puzzle Boss, we're building a platform that combines skill-based puzzles with premium prizes. 
          We're a team of puzzle enthusiasts, technologists, and innovators who are passionate about creating 
          engaging experiences for our users.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
          <CardHeader>
            <CardTitle className="flex items-center text-puzzle-white">
              <Globe className="h-5 w-5 mr-2 text-puzzle-aqua" />
              Remote-First Culture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We believe great work can happen anywhere. Our team spans multiple time zones, and we emphasize 
              asynchronous communication and flexibility. We have team members across the US, Europe, and Asia, 
              working together to create amazing puzzle experiences.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
          <CardHeader>
            <CardTitle className="flex items-center text-puzzle-white">
              <BarChart className="h-5 w-5 mr-2 text-puzzle-aqua" />
              Growth & Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              As a growing startup, we offer unique opportunities to make a significant impact. Every team member 
              contributes directly to our success, and your ideas will help shape the future of our platform.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-puzzle-aqua mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="bg-puzzle-black/50 border-puzzle-aqua/20">
              <CardHeader className="pb-2 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-puzzle-aqua/20 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-puzzle-aqua" />
                </div>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-puzzle-aqua mb-4 text-center">Benefits & Perks</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          We believe in taking care of our team. Here are some of the benefits you'll enjoy when you join us.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center p-3 border border-puzzle-aqua/20 rounded-lg bg-puzzle-black/30">
              <div className="h-6 w-6 rounded-full bg-puzzle-aqua/20 flex items-center justify-center mr-3">
                <Trophy className="h-3 w-3 text-puzzle-aqua" />
              </div>
              <span className="text-muted-foreground">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-puzzle-aqua mb-8 text-center">Open Positions</h2>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All Departments</TabsTrigger>
            <TabsTrigger value="engineering">Engineering</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {jobOpenings.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </TabsContent>
          
          <TabsContent value="engineering" className="space-y-6">
            {jobOpenings
              .filter(job => job.department === "Engineering")
              .map(job => (
                <JobCard key={job.id} job={job} />
              ))}
          </TabsContent>
          
          <TabsContent value="marketing" className="space-y-6">
            {jobOpenings
              .filter(job => job.department === "Marketing")
              .map(job => (
                <JobCard key={job.id} job={job} />
              ))}
          </TabsContent>
          
          <TabsContent value="operations" className="space-y-6">
            {jobOpenings
              .filter(job => job.department === "Operations" || job.department === "Content")
              .map(job => (
                <JobCard key={job.id} job={job} />
              ))}
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-10">
          <p className="text-muted-foreground mb-4">
            Don't see a position that matches your skills?
          </p>
          <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
            Send General Application
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Careers;
