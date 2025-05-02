
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { CalendarIcon, Clock, Instagram, Facebook, Twitter, Youtube, Trash2, Edit } from "lucide-react";

type Post = {
  id: string;
  title: string;
  content: string;
  platform: string;
  date: Date;
  time: string;
  status: 'scheduled' | 'published' | 'draft';
};

export const SocialMediaCalendar: React.FC = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'New Puzzle Launch',
      content: 'We're excited to launch our new puzzle collection! Check it out now.',
      platform: 'instagram',
      date: new Date(),
      time: '10:00',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Weekly Contest',
      content: 'Join our weekly puzzle contest and win amazing prizes!',
      platform: 'facebook',
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: '15:30',
      status: 'draft'
    }
  ]);
  
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [newPost, setNewPost] = useState<Omit<Post, 'id'>>({
    title: '',
    content: '',
    platform: 'instagram',
    date: new Date(),
    time: '12:00',
    status: 'draft'
  });
  
  const handleAddPost = () => {
    const post: Post = {
      ...newPost,
      id: Math.random().toString(36).substring(7)
    };
    
    setPosts([...posts, post]);
    setIsAddPostOpen(false);
    setNewPost({
      title: '',
      content: '',
      platform: 'instagram',
      date: new Date(),
      time: '12:00',
      status: 'draft'
    });
    
    toast({
      title: "Post scheduled",
      description: `Your post "${post.title}" has been scheduled for ${format(post.date, 'PPP')} at ${post.time}.`,
    });
  };
  
  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
    
    toast({
      title: "Post deleted",
      description: "The post has been removed from your calendar.",
    });
  };
  
  // Filter posts for the selected date
  const postsForSelectedDate = date 
    ? posts.filter(post => 
        post.date.getDate() === date.getDate() && 
        post.date.getMonth() === date.getMonth() && 
        post.date.getFullYear() === date.getFullYear()
      )
    : [];
    
  // Function to render platform icon
  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Content Calendar</h3>
            <Dialog open={isAddPostOpen} onOpenChange={setIsAddPostOpen}>
              <DialogTrigger asChild>
                <Button size="sm">New Post</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule New Post</DialogTitle>
                  <DialogDescription>
                    Create a new post for your social media platforms.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select 
                      value={newPost.platform} 
                      onValueChange={(value) => setNewPost({...newPost, platform: value})}
                    >
                      <SelectTrigger id="platform" className="w-full">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title">Post Title</Label>
                    <Input 
                      id="title" 
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Post Content</Label>
                    <Textarea 
                      id="content" 
                      rows={4}
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Date</Label>
                      <div className="flex">
                        <Input
                          type="date"
                          value={format(newPost.date, 'yyyy-MM-dd')}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : new Date();
                            setNewPost({...newPost, date});
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Time</Label>
                      <Input 
                        id="time" 
                        type="time"
                        value={newPost.time}
                        onChange={(e) => setNewPost({...newPost, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newPost.status}
                      onValueChange={(value: any) => setNewPost({...newPost, status: value})}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddPostOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddPost}>Schedule Post</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          <div className="mt-4 space-y-1">
            <h4 className="text-sm font-medium">Upcoming Posts</h4>
            <div className="text-sm">
              {posts.length === 0 ? (
                <p className="text-muted-foreground py-2">No posts scheduled</p>
              ) : (
                posts.slice(0, 3).map(post => (
                  <div key={post.id} className="flex items-center py-1">
                    <div className="mr-2">
                      {renderPlatformIcon(post.platform)}
                    </div>
                    <div className="flex-1 truncate">{post.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(post.date, 'MMM d')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardContent className="p-4">
          <div className="mb-4">
            <h3 className="font-medium">
              Posts for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
            </h3>
          </div>
          
          {postsForSelectedDate.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No posts scheduled for this date</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsAddPostOpen(true)}
              >
                Schedule a Post
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {postsForSelectedDate.map(post => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          {renderPlatformIcon(post.platform)}
                        </div>
                        <span className="font-medium">{post.title}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(post.status)}`}>
                          {post.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{post.content}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.time}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
