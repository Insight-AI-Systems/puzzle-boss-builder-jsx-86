
import React, { useState } from 'react';
import MainHeader from '@/components/header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { PermissionGate } from '@/components/PermissionGate';
import { ROLES } from '@/utils/permissions';

const ContentAdmin = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('terms');
  
  // Use separate forms for each content section
  const termsForm = useForm({
    defaultValues: {
      title: 'Terms of Service',
      content: '... existing terms content ...'
    }
  });
  
  const privacyForm = useForm({
    defaultValues: {
      title: 'Privacy Policy',
      content: '... existing privacy content ...'
    }
  });
  
  const cookiesForm = useForm({
    defaultValues: {
      title: 'Cookie Policy',
      content: '... existing cookie policy content ...'
    }
  });
  
  const contestRulesForm = useForm({
    defaultValues: {
      title: 'Contest Rules',
      content: '... existing contest rules content ...'
    }
  });
  
  const supportForm = useForm({
    defaultValues: {
      title: 'Support',
      email: 'support@puzzleboss.com',
      phone: '+1 (555) 123-4567',
      faqItems: [
        { question: 'How do I purchase credits?', answer: 'You can purchase credits from your account dashboard.' },
        { question: 'What happens if I don\'t complete a puzzle?', answer: 'If you don\'t complete a puzzle within the time limit, your entry fee is not refunded.' },
        { question: 'How do I claim my prize?', answer: 'When you win a contest, you\'ll receive instructions via email.' }
      ]
    }
  });
  
  const partnershipsForm = useForm({
    defaultValues: {
      title: 'Partnership Opportunities',
      contactEmail: 'partnerships@puzzleboss.com'
    }
  });
  
  const careersForm = useForm({
    defaultValues: {
      title: 'Careers at The Puzzle Boss',
      jobs: [
        { title: 'Senior Frontend Developer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
        { title: 'Backend Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
        { title: 'UX/UI Designer', department: 'Design', location: 'Remote', type: 'Full-time' },
        { title: 'Marketing Manager', department: 'Marketing', location: 'Remote', type: 'Full-time' }
      ]
    }
  });
  
  const pressForm = useForm({
    defaultValues: {
      title: 'Press & Media',
      pressContact: 'press@puzzleboss.com',
      pressReleases: [
        { date: 'April 10, 2025', title: 'The Puzzle Boss Launches Global Puzzle Competition Platform', excerpt: 'Launch announcement...' },
        { date: 'March 15, 2025', title: 'The Puzzle Boss Secures $5M in Seed Funding', excerpt: 'Funding announcement...' }
      ]
    }
  });

  const onSubmit = (data) => {
    // In a real implementation, this would save to a database
    console.log('Saving content:', data);
    toast.success('Content updated successfully!');
  };
  
  // Handle editable sections of pages
  const handleContentSave = (formHandler) => {
    formHandler.handleSubmit(onSubmit)();
  };
  
  return (
    <PermissionGate
      role={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}
      fallback={
        <div className="flex flex-col min-h-screen bg-puzzle-black">
          <MainHeader />
          <div className="container mx-auto px-4 py-32 text-center">
            <h1 className="text-3xl font-bold text-puzzle-gold mb-4">Access Denied</h1>
            <p className="text-puzzle-white mb-6">You don't have permission to access this page.</p>
          </div>
          <Footer />
        </div>
      }
    >
      <div className="flex flex-col min-h-screen bg-puzzle-black">
        <MainHeader />
        
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-puzzle-gold">Content Management</h1>
                <p className="text-muted-foreground">Edit website content and pages</p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <span className="bg-puzzle-aqua/20 text-puzzle-aqua px-3 py-1 rounded-full text-sm">
                  Logged in as: {profile?.username || 'Admin'} ({profile?.role || 'Unknown Role'})
                </span>
              </div>
            </div>
            
            <div className="bg-card rounded-lg shadow-lg overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full flex overflow-x-auto bg-card border-b border-puzzle-aqua/20 rounded-none px-4">
                  <TabsTrigger value="terms" className="data-[state=active]:bg-puzzle-aqua/20 data-[state=active]:text-puzzle-aqua">
                    Terms
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="data-[state=active]:bg-puzzle-aqua/20 data-[state=active]:text-puzzle-aqua">
                    Privacy
                  </TabsTrigger>
                  <TabsTrigger value="cookies" className="data-[state=active]:bg-puzzle-aqua/20 data-[state=active]:text-puzzle-aqua">
                    Cookies
                  </TabsTrigger>
                  <TabsTrigger value="contestRules" className="data-[state=active]:bg-puzzle-aqua/20 data-[state=active]:text-puzzle-aqua">
                    Contest Rules
                  </TabsTrigger>
                  <TabsTrigger value="support" className="data-[state=active]:bg-puzzle-aqua/20 data-[state=active]:text-puzzle-aqua">
                    Support
                  </TabsTrigger>
                  <TabsTrigger value="partnerships" className="data-[state=active]:bg-puzzle-aqua/20 data-[state=active]:text-puzzle-aqua">
                    Partnerships
                  </TabsTrigger>
                  <TabsTrigger value="careers" className="data-[state=active]:bg-puzzle-aqua/20 data-[state=active]:text-puzzle-aqua">
                    Careers
                  </TabsTrigger>
                  <TabsTrigger value="press" className="data-[state=active]:bg-puzzle-aqua/20 data-[state=active]:text-puzzle-aqua">
                    Press
                  </TabsTrigger>
                </TabsList>
                
                <div className="p-6">
                  <TabsContent value="terms" className="mt-0">
                    <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Edit Terms of Service</h2>
                    <Form {...termsForm}>
                      <div className="space-y-6">
                        <FormField
                          control={termsForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={termsForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Content</FormLabel>
                              <FormDescription>
                                Use Markdown format for content structure.
                              </FormDescription>
                              <FormControl>
                                <Textarea {...field} rows={15} className="font-mono" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end gap-3">
                          <Button type="button" variant="outline" onClick={() => termsForm.reset()}>
                            Reset
                          </Button>
                          <Button 
                            type="button" 
                            className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black"
                            onClick={() => handleContentSave(termsForm)}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="privacy" className="mt-0">
                    <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Edit Privacy Policy</h2>
                    <Form {...privacyForm}>
                      <div className="space-y-6">
                        <FormField
                          control={privacyForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={privacyForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Content</FormLabel>
                              <FormDescription>
                                Use Markdown format for content structure.
                              </FormDescription>
                              <FormControl>
                                <Textarea {...field} rows={15} className="font-mono" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end gap-3">
                          <Button type="button" variant="outline" onClick={() => privacyForm.reset()}>
                            Reset
                          </Button>
                          <Button 
                            type="button" 
                            className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black"
                            onClick={() => handleContentSave(privacyForm)}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="cookies" className="mt-0">
                    <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Edit Cookie Policy</h2>
                    <Form {...cookiesForm}>
                      <div className="space-y-6">
                        <FormField
                          control={cookiesForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={cookiesForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Content</FormLabel>
                              <FormDescription>
                                Use Markdown format for content structure.
                              </FormDescription>
                              <FormControl>
                                <Textarea {...field} rows={15} className="font-mono" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end gap-3">
                          <Button type="button" variant="outline" onClick={() => cookiesForm.reset()}>
                            Reset
                          </Button>
                          <Button 
                            type="button" 
                            className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black"
                            onClick={() => handleContentSave(cookiesForm)}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="contestRules" className="mt-0">
                    <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Edit Contest Rules</h2>
                    <Form {...contestRulesForm}>
                      <div className="space-y-6">
                        <FormField
                          control={contestRulesForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={contestRulesForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Content</FormLabel>
                              <FormDescription>
                                Use Markdown format for content structure.
                              </FormDescription>
                              <FormControl>
                                <Textarea {...field} rows={15} className="font-mono" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end gap-3">
                          <Button type="button" variant="outline" onClick={() => contestRulesForm.reset()}>
                            Reset
                          </Button>
                          <Button 
                            type="button" 
                            className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black"
                            onClick={() => handleContentSave(contestRulesForm)}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="support" className="mt-0">
                    <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Edit Support Page</h2>
                    <Form {...supportForm}>
                      <div className="space-y-6">
                        <FormField
                          control={supportForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={supportForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Support Email</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={supportForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Support Phone</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div>
                          <FormLabel>FAQ Items</FormLabel>
                          <FormDescription>
                            Frequently asked questions that appear on the support page.
                          </FormDescription>
                          
                          <div className="space-y-4 mt-2">
                            {supportForm.watch('faqItems')?.map((_, index) => (
                              <div key={index} className="p-4 border border-puzzle-aqua/20 rounded-lg">
                                <FormField
                                  control={supportForm.control}
                                  name={`faqItems.${index}.question`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Question</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={supportForm.control}
                                  name={`faqItems.${index}.answer`}
                                  render={({ field }) => (
                                    <FormItem className="mt-2">
                                      <FormLabel>Answer</FormLabel>
                                      <FormControl>
                                        <Textarea {...field} rows={2} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 text-red-500 hover:text-red-700"
                                  onClick={() => {
                                    const currentFaqs = supportForm.getValues('faqItems');
                                    supportForm.setValue('faqItems', currentFaqs.filter((_, i) => i !== index));
                                  }}
                                >
                                  Remove Item
                                </Button>
                              </div>
                            ))}
                            
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const currentFaqs = supportForm.getValues('faqItems') || [];
                                supportForm.setValue('faqItems', [
                                  ...currentFaqs,
                                  { question: '', answer: '' }
                                ]);
                              }}
                            >
                              Add FAQ Item
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                          <Button type="button" variant="outline" onClick={() => supportForm.reset()}>
                            Reset
                          </Button>
                          <Button 
                            type="button" 
                            className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black"
                            onClick={() => handleContentSave(supportForm)}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </TabsContent>

                  <TabsContent value="partnerships" className="mt-0">
                    <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Edit Partnerships Page</h2>
                    <Form {...partnershipsForm}>
                      <div className="space-y-6">
                        <FormField
                          control={partnershipsForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={partnershipsForm.control}
                          name="contactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Email</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end gap-3">
                          <Button type="button" variant="outline" onClick={() => partnershipsForm.reset()}>
                            Reset
                          </Button>
                          <Button 
                            type="button" 
                            className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black"
                            onClick={() => handleContentSave(partnershipsForm)}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="careers" className="mt-0">
                    <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Edit Careers Page</h2>
                    <Form {...careersForm}>
                      <div className="space-y-6">
                        <FormField
                          control={careersForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div>
                          <FormLabel>Job Listings</FormLabel>
                          <FormDescription>
                            Current open positions at The Puzzle Boss.
                          </FormDescription>
                          
                          <div className="space-y-4 mt-2">
                            {careersForm.watch('jobs')?.map((_, index) => (
                              <div key={index} className="p-4 border border-puzzle-aqua/20 rounded-lg">
                                <FormField
                                  control={careersForm.control}
                                  name={`jobs.${index}.title`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Job Title</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                  <FormField
                                    control={careersForm.control}
                                    name={`jobs.${index}.department`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Department</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={careersForm.control}
                                    name={`jobs.${index}.location`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={careersForm.control}
                                    name={`jobs.${index}.type`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 text-red-500 hover:text-red-700"
                                  onClick={() => {
                                    const currentJobs = careersForm.getValues('jobs');
                                    careersForm.setValue('jobs', currentJobs.filter((_, i) => i !== index));
                                  }}
                                >
                                  Remove Job
                                </Button>
                              </div>
                            ))}
                            
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const currentJobs = careersForm.getValues('jobs') || [];
                                careersForm.setValue('jobs', [
                                  ...currentJobs,
                                  { title: '', department: '', location: 'Remote', type: 'Full-time' }
                                ]);
                              }}
                            >
                              Add Job Listing
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                          <Button type="button" variant="outline" onClick={() => careersForm.reset()}>
                            Reset
                          </Button>
                          <Button 
                            type="button" 
                            className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black"
                            onClick={() => handleContentSave(careersForm)}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="press" className="mt-0">
                    <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Edit Press Page</h2>
                    <Form {...pressForm}>
                      <div className="space-y-6">
                        <FormField
                          control={pressForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={pressForm.control}
                          name="pressContact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Press Contact Email</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div>
                          <FormLabel>Press Releases</FormLabel>
                          <FormDescription>
                            List of press releases to display on the page.
                          </FormDescription>
                          
                          <div className="space-y-4 mt-2">
                            {pressForm.watch('pressReleases')?.map((_, index) => (
                              <div key={index} className="p-4 border border-puzzle-aqua/20 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <FormField
                                    control={pressForm.control}
                                    name={`pressReleases.${index}.date`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <div className="md:col-span-3">
                                    <FormField
                                      control={pressForm.control}
                                      name={`pressReleases.${index}.title`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Title</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                </div>
                                
                                <FormField
                                  control={pressForm.control}
                                  name={`pressReleases.${index}.excerpt`}
                                  render={({ field }) => (
                                    <FormItem className="mt-2">
                                      <FormLabel>Excerpt</FormLabel>
                                      <FormControl>
                                        <Textarea {...field} rows={2} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 text-red-500 hover:text-red-700"
                                  onClick={() => {
                                    const currentReleases = pressForm.getValues('pressReleases');
                                    pressForm.setValue('pressReleases', currentReleases.filter((_, i) => i !== index));
                                  }}
                                >
                                  Remove Press Release
                                </Button>
                              </div>
                            ))}
                            
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const currentReleases = pressForm.getValues('pressReleases') || [];
                                pressForm.setValue('pressReleases', [
                                  ...currentReleases,
                                  { date: new Date().toLocaleDateString(), title: '', excerpt: '' }
                                ]);
                              }}
                            >
                              Add Press Release
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                          <Button type="button" variant="outline" onClick={() => pressForm.reset()}>
                            Reset
                          </Button>
                          <Button 
                            type="button" 
                            className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black"
                            onClick={() => handleContentSave(pressForm)}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
            
            <div className="mt-8 p-6 bg-puzzle-aqua/10 rounded-lg border border-puzzle-aqua/30">
              <h3 className="text-xl font-semibold mb-4 text-puzzle-gold">Content Management Tips</h3>
              <ul className="space-y-2 text-puzzle-white">
                <li className="flex items-start">
                  <span className="text-puzzle-aqua mr-2">•</span>
                  <span>Changes will be published immediately to the website.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-puzzle-aqua mr-2">•</span>
                  <span>Use markdown formatting for content structure (headings, lists, links).</span>
                </li>
                <li className="flex items-start">
                  <span className="text-puzzle-aqua mr-2">•</span>
                  <span>Preview functionality will be available in a future update.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-puzzle-aqua mr-2">•</span>
                  <span>Content history and version control is managed automatically.</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PermissionGate>
  );
};

export default ContentAdmin;
