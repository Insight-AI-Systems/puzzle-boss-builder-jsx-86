
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContentEditor } from './ContentEditor';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/admin/ImageUpload';

export const PressKitEditor: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('company');
  const [isSaving, setIsSaving] = useState(false);
  
  // This would typically come from an API call or context
  const [pressKitData, setPressKitData] = useState({
    company: {
      companyDescription: "The Puzzle Boss is the premier skill-based puzzle competition platform where players can win premium prizes through fair competition.",
      founded: "2024",
      headquarters: "San Francisco, California",
      keyFacts: "Over 100,000 active users\n500+ unique puzzle challenges\n$1M+ in prizes awarded\nAvailable in 25 countries",
      missionStatement: "To create the world's most engaging skill-based puzzle platform where players can win premium prizes through fair competition, while fostering a community of puzzle enthusiasts.",
      companyValues: "Fairness: We ensure all competitions are skill-based and provide equal opportunity.\nCommunity: We foster connections among puzzle enthusiasts worldwide.\nQuality: We provide only premium prizes and well-designed puzzles.\nInnovation: We continuously improve our platform and puzzle offerings.",
      funding: "Secured $5M in seed funding in April 2025, led by Venture Partners with participation from Angel Investors."
    },
    team: [
      {
        id: 1,
        name: "Alex Morgan",
        position: "Founder & CEO",
        bio: "Alex has over 15 years of experience in the gaming industry, previously founding GamingPlatform Inc, which was acquired in 2022. Expert in skill-based gaming and prize competition regulations."
      },
      {
        id: 2,
        name: "Jamie Lee",
        position: "CTO",
        bio: "Jamie brings extensive technical expertise with previous roles at major tech companies. Specializes in creating scalable gaming platforms and implementing fair-play algorithms."
      },
      {
        id: 3,
        name: "Taylor Rivera",
        position: "COO",
        bio: "Taylor oversees day-to-day operations and strategic partnerships. Previously led operations at a Fortune 500 company with expertise in scaling startups and optimizing customer experiences."
      }
    ],
    contact: {
      email: "press@puzzleboss.com",
      phone: "+1 (555) 123-4567"
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would typically save to your database
      // await saveToDatabase(pressKitData);
      
      // For now we'll just simulate a delay and show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Press Kit Updated",
        description: "Changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompanyDataChange = (field: string, value: string) => {
    setPressKitData(prev => ({
      ...prev,
      company: {
        ...prev.company,
        [field]: value
      }
    }));
  };
  
  const handleContactDataChange = (field: string, value: string) => {
    setPressKitData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };
  
  const handleTeamMemberChange = (id: number, field: string, value: string) => {
    setPressKitData(prev => ({
      ...prev,
      team: prev.team.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Press Kit Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="company">Company Information</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="contact">Contact Information</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-description">Company Description</Label>
                <Textarea 
                  id="company-description" 
                  value={pressKitData.company.companyDescription}
                  onChange={(e) => handleCompanyDataChange('companyDescription', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="founded">Founded</Label>
                  <Input 
                    id="founded" 
                    value={pressKitData.company.founded}
                    onChange={(e) => handleCompanyDataChange('founded', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headquarters">Headquarters</Label>
                  <Input 
                    id="headquarters" 
                    value={pressKitData.company.headquarters}
                    onChange={(e) => handleCompanyDataChange('headquarters', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-facts">Key Facts (One per line)</Label>
                <Textarea 
                  id="key-facts" 
                  value={pressKitData.company.keyFacts}
                  onChange={(e) => handleCompanyDataChange('keyFacts', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mission">Mission Statement</Label>
                <Textarea 
                  id="mission" 
                  value={pressKitData.company.missionStatement}
                  onChange={(e) => handleCompanyDataChange('missionStatement', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="values">Company Values (One per line)</Label>
                <Textarea 
                  id="values" 
                  value={pressKitData.company.companyValues}
                  onChange={(e) => handleCompanyDataChange('companyValues', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="funding">Funding Information</Label>
                <Textarea 
                  id="funding" 
                  value={pressKitData.company.funding}
                  onChange={(e) => handleCompanyDataChange('funding', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            {pressKitData.team.map((member) => (
              <Card key={member.id} className="mb-4">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`member-name-${member.id}`}>Name</Label>
                        <Input 
                          id={`member-name-${member.id}`} 
                          value={member.name}
                          onChange={(e) => handleTeamMemberChange(member.id, 'name', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`member-position-${member.id}`}>Position</Label>
                        <Input 
                          id={`member-position-${member.id}`} 
                          value={member.position}
                          onChange={(e) => handleTeamMemberChange(member.id, 'position', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`member-bio-${member.id}`}>Biography</Label>
                      <Textarea 
                        id={`member-bio-${member.id}`} 
                        value={member.bio}
                        onChange={(e) => handleTeamMemberChange(member.id, 'bio', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Profile Photo</Label>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-puzzle-aqua/20 flex items-center justify-center">
                          {/* Placeholder for profile image */}
                        </div>
                        <Button variant="outline" className="border-puzzle-aqua/30">
                          Upload Photo
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" className="border-puzzle-aqua/30">
              Add Team Member
            </Button>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="press-email">Press Contact Email</Label>
                <Input 
                  id="press-email" 
                  type="email"
                  value={pressKitData.contact.email}
                  onChange={(e) => handleContactDataChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="press-phone">Press Contact Phone</Label>
                <Input 
                  id="press-phone" 
                  value={pressKitData.contact.phone}
                  onChange={(e) => handleContactDataChange('phone', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-puzzle-aqua hover:bg-puzzle-aqua/80"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PressKitEditor;
