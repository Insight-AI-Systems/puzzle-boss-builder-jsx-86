
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const MetaTagManager: React.FC = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [selectedPage, setSelectedPage] = useState('home');

  const pages = [
    { id: 'home', name: 'Home Page' },
    { id: 'puzzles', name: 'Puzzles Page' },
    { id: 'prizes', name: 'Prizes Page' },
    { id: 'about', name: 'About Us' },
    { id: 'contact', name: 'Contact Page' },
    { id: 'faq', name: 'FAQ Page' },
  ];

  const handleSave = () => {
    // In a real implementation, this would save to a database
    toast({
      title: "Meta tags updated",
      description: `Meta information for ${selectedPage} page has been updated successfully.`,
    });
  };

  const handleGenerateSuggestions = () => {
    // In a real implementation, this might use an AI service to generate suggestions
    toast({
      title: "Keyword suggestions",
      description: "Generated keyword suggestions based on your content",
    });
    setKeywords('puzzles, prizes, games, entertainment, rewards, online puzzles');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Label htmlFor="page-select" className="text-sm font-medium">Select Page:</Label>
        <Select value={selectedPage} onValueChange={setSelectedPage}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select page" />
          </SelectTrigger>
          <SelectContent>
            {pages.map(page => (
              <SelectItem key={page.id} value={page.id}>{page.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList>
          <TabsTrigger value="basic">Basic Meta Tags</TabsTrigger>
          <TabsTrigger value="open-graph">Open Graph</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Page Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Page Title (55-60 characters recommended)"
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground text-right">{title.length}/60</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Meta Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Meta Description (150-160 characters recommended)"
                maxLength={160}
                rows={3}
              />
              <p className="text-xs text-muted-foreground text-right">{description.length}/160</p>
            </div>
            
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="keywords">Meta Keywords</Label>
                <Button variant="outline" size="sm" onClick={handleGenerateSuggestions}>Generate Suggestions</Button>
              </div>
              <Textarea 
                id="keywords" 
                value={keywords} 
                onChange={(e) => setKeywords(e.target.value)} 
                placeholder="Enter keywords separated by commas"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">Not as important for SEO as they once were, but still useful for internal site search</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="open-graph" className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="og-title">OG Title</Label>
              <Input 
                id="og-title" 
                value={ogTitle} 
                onChange={(e) => setOgTitle(e.target.value)} 
                placeholder="Title for social media sharing"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="og-description">OG Description</Label>
              <Textarea 
                id="og-description" 
                value={ogDescription} 
                onChange={(e) => setOgDescription(e.target.value)} 
                placeholder="Description for social media sharing"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="og-image">OG Image URL</Label>
              <Input 
                id="og-image" 
                value={ogImage} 
                onChange={(e) => setOgImage(e.target.value)} 
                placeholder="https://example.com/image.jpg (1200×630 pixels recommended)"
              />
              <p className="text-xs text-muted-foreground">This image will be displayed when your page is shared on social media</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4 mt-4">
          <Card className="border border-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-blue-600">
                {title || 'Page Title Will Appear Here'}
              </CardTitle>
              <p className="text-xs text-green-700">https://example.com/{selectedPage}</p>
            </CardHeader>
            <CardContent className="text-sm">
              <p>{description || 'Your meta description will appear here. This is what users see in search engine results.'}</p>
            </CardContent>
          </Card>
          
          <Card className="border border-muted">
            <CardHeader className="pb-2">
              <p className="text-xs text-muted-foreground">Facebook/Twitter Preview</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {ogImage && <div className="bg-muted h-40 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Image Preview ({ogImage})</p>
              </div>}
              <h3 className="text-base font-medium">{ogTitle || title || 'Social Media Title'}</h3>
              <p className="text-sm">{ogDescription || description || 'Your social media description will appear here'}</p>
              <p className="text-xs text-muted-foreground">example.com</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2">
        <Button onClick={handleSave}>Save Meta Tags</Button>
      </div>
    </div>
  );
};
