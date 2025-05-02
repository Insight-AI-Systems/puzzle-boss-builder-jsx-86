
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Youtube, Linkedin, RefreshCcw, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const SocialMediaAccounts: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Connected Accounts</h3>
        <Button size="sm" variant="outline">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <Facebook className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Facebook</div>
                  <div className="text-sm text-muted-foreground">Puzzle Boss Official Page</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">Connected</Badge>
                <Button variant="ghost" size="sm">Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-pink-100 p-2 rounded-full mr-4">
                  <Instagram className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <div className="font-medium">Instagram</div>
                  <div className="text-sm text-muted-foreground">@puzzleboss_official</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">Connected</Badge>
                <Button variant="ghost" size="sm">Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-sky-100 p-2 rounded-full mr-4">
                  <Twitter className="h-5 w-5 text-sky-500" />
                </div>
                <div>
                  <div className="font-medium">Twitter</div>
                  <div className="text-sm text-muted-foreground">@PuzzleBoss</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">Connected</Badge>
                <Button variant="ghost" size="sm">Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-red-100 p-2 rounded-full mr-4">
                  <Youtube className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium">YouTube</div>
                  <div className="text-sm text-muted-foreground">Puzzle Boss Channel</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">Connected</Badge>
                <Button variant="ghost" size="sm">Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <Linkedin className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <div className="font-medium">LinkedIn</div>
                  <div className="text-sm text-muted-foreground">Puzzle Boss Company Page</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-gray-100 text-gray-500">Not Connected</Badge>
                <Button variant="outline" size="sm">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Connect
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Account
        </Button>
      </div>
    </div>
  );
};
