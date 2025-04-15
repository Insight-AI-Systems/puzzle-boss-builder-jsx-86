
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Progress = () => {
  // These will be connected to Supabase later
  const handleAddComment = () => {
    console.log("Add comment functionality will be implemented after Supabase integration");
  };

  return (
    <div className="min-h-screen bg-puzzle-black p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-game text-puzzle-aqua mb-8">Project Progress Tracker</h1>
        
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
          <CardHeader>
            <CardTitle className="text-puzzle-white">Current Phase: Authentication & User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-game text-puzzle-gold">Tasks</h3>
              <ul className="list-disc pl-6 space-y-2 text-puzzle-white/80">
                <li>Set up Supabase Integration ⏳</li>
                <li>Implement User Authentication 🔒</li>
                <li>Create User Profiles System 👤</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-game text-puzzle-gold">Comments</h3>
              <div className="space-y-4">
                <div className="bg-puzzle-black/30 p-4 rounded-lg border border-puzzle-aqua/10">
                  <p className="text-sm text-puzzle-white/60">No comments yet</p>
                </div>
                
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Add your comment or suggestion..."
                    className="bg-puzzle-black/30 border-puzzle-aqua/20 text-puzzle-white"
                  />
                  <Button 
                    onClick={handleAddComment}
                    className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90"
                  >
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
