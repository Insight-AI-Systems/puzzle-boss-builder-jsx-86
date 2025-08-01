
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, HelpCircle, Ticket } from 'lucide-react';
import { SupportHome } from '@/components/support/SupportHome';
import { useAuth } from '@/contexts/AuthContext';

const Support = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Support Center</h1>
          <p className="text-muted-foreground text-lg">
            Get help and find answers to your questions
          </p>
        </div>

        <Tabs defaultValue="help" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="help" className="flex items-center">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & FAQ
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center">
              <Ticket className="mr-2 h-4 w-4" />
              Support Tickets
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact Us
            </TabsTrigger>
          </TabsList>

          <TabsContent value="help">
            <SupportHome />
          </TabsContent>

          <TabsContent value="tickets">
            {isAuthenticated ? (
              <Card>
                <CardHeader>
                  <CardTitle>Support Tickets</CardTitle>
                  <CardDescription>
                    View and manage your support requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Support ticket functionality will be implemented here.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Ticket className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Sign in required</h3>
                    <p className="text-muted-foreground mb-4">
                      Please sign in to view your support tickets
                    </p>
                    <Button>Sign In</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Get in touch with our support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Contact information and forms will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Support;
