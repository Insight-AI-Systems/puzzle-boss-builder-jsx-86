
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Image as ImageIcon, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { supabase } from '@/integrations/supabase/client';

// Types for content
type ContentItemType = 'promotion' | 'announcement' | 'testimonial';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: ContentItemType;
  image_url?: string;
  created_at: string;
  active: boolean;
}

export function ContentManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ContentItemType>('promotion');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ContentItem | null>(null);

  // Mock content data for different types
  const mockContent: Record<ContentItemType, ContentItem[]> = {
    promotion: [
      { 
        id: '1', 
        title: 'Summer Sale', 
        content: 'Get 20% off on all premium puzzles this summer!', 
        type: 'promotion', 
        image_url: 'https://placehold.co/600x400?text=Summer+Sale', 
        created_at: new Date().toISOString(),
        active: true
      },
      { 
        id: '2', 
        title: 'Weekend Special', 
        content: 'Double credits on all puzzles completed this weekend!', 
        type: 'promotion', 
        image_url: 'https://placehold.co/600x400?text=Weekend+Special', 
        created_at: new Date().toISOString(),
        active: false
      },
    ],
    announcement: [
      { 
        id: '3', 
        title: 'New Puzzle Category', 
        content: 'We\'ve added a new category of puzzles for Smartwatches!', 
        type: 'announcement', 
        created_at: new Date().toISOString(),
        active: true
      },
      { 
        id: '4', 
        title: 'Maintenance Notice', 
        content: 'The site will be down for maintenance on Sunday from 2-4 AM EST.', 
        type: 'announcement', 
        created_at: new Date().toISOString(),
        active: true
      },
    ],
    testimonial: [
      { 
        id: '5', 
        title: 'Jane D.', 
        content: 'I won a brand new iPhone 14 Pro! The puzzles are challenging but fun.', 
        type: 'testimonial', 
        image_url: 'https://placehold.co/400x400?text=Jane', 
        created_at: new Date().toISOString(),
        active: true
      },
      { 
        id: '6', 
        title: 'John S.', 
        content: 'Amazing platform! I\'ve recommended it to all my friends.', 
        type: 'testimonial', 
        image_url: 'https://placehold.co/400x400?text=John', 
        created_at: new Date().toISOString(),
        active: true
      },
    ],
  };

  // Fetch content items
  const { data: contentItems, isLoading } = useQuery({
    queryKey: ['content-items', activeTab],
    queryFn: async () => {
      // In a real implementation, you would use:
      // const { data, error } = await supabase.from('content').select('*').eq('type', activeTab);
      
      // Mock data for demonstration
      return mockContent[activeTab];
    },
  });

  // Create content mutation
  const createContent = useMutation({
    mutationFn: async (newItem: Omit<ContentItem, 'id' | 'created_at'>) => {
      // In a real implementation, you would use:
      // const { data, error } = await supabase.from('content').insert([newItem]).select();
      
      // Mock response
      return {
        ...newItem,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-items', activeTab] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Content created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create content: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Update content mutation
  const updateContent = useMutation({
    mutationFn: async (updatedItem: ContentItem) => {
      // In a real implementation, you would use:
      // const { data, error } = await supabase.from('content').update(updatedItem).eq('id', updatedItem.id);
      
      // Mock response
      return updatedItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-items', activeTab] });
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update content: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Delete content mutation
  const deleteContent = useMutation({
    mutationFn: async (id: string) => {
      // In a real implementation, you would use:
      // const { data, error } = await supabase.from('content').delete().eq('id', id);
      
      // Mock response
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-items', activeTab] });
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete content: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle content active status mutation
  const toggleContentActive = useMutation({
    mutationFn: async ({ id, active }: { id: string, active: boolean }) => {
      // In a real implementation, you would use:
      // const { data, error } = await supabase.from('content').update({ active }).eq('id', id);
      
      // Mock response
      return { id, active };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-items', activeTab] });
      toast({
        title: "Success",
        description: "Content status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update content status: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Content creation form
  const createForm = useForm({
    defaultValues: {
      title: '',
      content: '',
      image_url: '',
      active: true,
    },
  });

  // Content edit form
  const editForm = useForm({
    defaultValues: {
      title: '',
      content: '',
      image_url: '',
      active: true,
    },
  });

  const handleCreateSubmit = createForm.handleSubmit(data => {
    createContent.mutate({
      ...data,
      type: activeTab,
    });
  });

  const handleEditSubmit = editForm.handleSubmit(data => {
    if (currentItem) {
      updateContent.mutate({
        ...currentItem,
        ...data,
      });
    }
  });

  const handleEdit = (item: ContentItem) => {
    setCurrentItem(item);
    editForm.reset({
      title: item.title,
      content: item.content,
      image_url: item.image_url || '',
      active: item.active,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      deleteContent.mutate(id);
    }
  };

  const handleToggleActive = (id: string, currentActive: boolean) => {
    toggleContentActive.mutate({ id, active: !currentActive });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>Loading content...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Content Management
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
                <Plus className="mr-2 h-4 w-4" /> Add New Content
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Content</DialogTitle>
                <DialogDescription>
                  Add details for the new {activeTab}. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={handleCreateSubmit} className="space-y-6">
                  <FormField
                    control={createForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter content text" 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {(activeTab === 'promotion' || activeTab === 'testimonial') && (
                    <FormField
                      control={createForm.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter image URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <DialogFooter>
                    <Button type="submit" className="bg-puzzle-aqua hover:bg-puzzle-aqua/80" disabled={createContent.isPending}>
                      {createContent.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Content
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>Manage website content, promotions, and testimonials</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="promotion" value={activeTab} onValueChange={(value) => setActiveTab(value as ContentItemType)}>
          <TabsList className="mb-6">
            <TabsTrigger value="promotion">Promotions</TabsTrigger>
            <TabsTrigger value="announcement">Announcements</TabsTrigger>
            <TabsTrigger value="testimonial">Testimonials</TabsTrigger>
          </TabsList>
          
          <TabsContent value="promotion" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contentItems?.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  {item.image_url && (
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <span className={!item.active ? "text-gray-400" : ""}>{item.title}</span>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleToggleActive(item.id, item.active)}
                          className={item.active ? "text-green-500" : "text-gray-400"}
                        >
                          {item.active ? "Active" : "Inactive"}
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-500" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Created on {new Date(item.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className={!item.active ? "text-gray-400" : ""}>{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {contentItems?.length === 0 && (
              <div className="text-center py-10">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No promotions found</h3>
                <p className="mt-1 text-muted-foreground">Get started by creating a new promotion.</p>
                <Button 
                  variant="default" 
                  className="mt-4 bg-puzzle-aqua hover:bg-puzzle-aqua/80"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Promotion
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="announcement" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contentItems?.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <span className={!item.active ? "text-gray-400" : ""}>{item.title}</span>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleToggleActive(item.id, item.active)}
                          className={item.active ? "text-green-500" : "text-gray-400"}
                        >
                          {item.active ? "Active" : "Inactive"}
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-500" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Created on {new Date(item.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className={!item.active ? "text-gray-400" : ""}>{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {contentItems?.length === 0 && (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No announcements found</h3>
                <p className="mt-1 text-muted-foreground">Get started by creating a new announcement.</p>
                <Button 
                  variant="default" 
                  className="mt-4 bg-puzzle-aqua hover:bg-puzzle-aqua/80"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Announcement
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="testimonial" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contentItems?.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex justify-center pt-6">
                    <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-100">
                      <img 
                        src={item.image_url || "https://placehold.co/200x200?text=User"} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <CardHeader className="pb-2 text-center">
                    <CardTitle className="flex flex-col items-center">
                      <span className={!item.active ? "text-gray-400" : ""}>{item.title}</span>
                      <div className="flex gap-2 mt-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleToggleActive(item.id, item.active)}
                          className={item.active ? "text-green-500" : "text-gray-400"}
                        >
                          {item.active ? "Active" : "Inactive"}
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-500" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className={!item.active ? "text-gray-400 italic" : "italic"}>"{item.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {contentItems?.length === 0 && (
              <div className="text-center py-10">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No testimonials found</h3>
                <p className="mt-1 text-muted-foreground">Get started by creating a new testimonial.</p>
                <Button 
                  variant="default" 
                  className="mt-4 bg-puzzle-aqua hover:bg-puzzle-aqua/80"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Testimonial
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</DialogTitle>
              <DialogDescription>
                Update the details for this {activeTab}. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter content text" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {(activeTab === 'promotion' || activeTab === 'testimonial') && (
                  <FormField
                    control={editForm.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={editForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel>Active</FormLabel>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" className="bg-puzzle-aqua hover:bg-puzzle-aqua/80" disabled={updateContent.isPending}>
                    {updateContent.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Content
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
