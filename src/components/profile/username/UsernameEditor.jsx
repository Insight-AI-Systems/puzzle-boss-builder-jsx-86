
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

/**
 * Component for displaying and editing the username
 */
const UsernameEditor = ({ profile, onUpdateProfile }) => {
  const { toast } = useToast();
  const [editingUsername, setEditingUsername] = useState(false);
  const [username, setUsername] = useState(profile?.username || '');

  const handleUsernameSubmit = async () => {
    if (username.trim() === '') {
      toast({
        title: "Invalid username",
        description: "Username cannot be empty",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await onUpdateProfile({ username });
      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      setEditingUsername(false);
      toast({
        title: "Username updated",
        description: "Your username has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mt-4">
      {editingUsername ? (
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-puzzle-black border border-puzzle-aqua/50 rounded px-2 py-1 text-puzzle-white text-center"
          />
          <div className="flex justify-center space-x-2">
            <Button 
              onClick={handleUsernameSubmit} 
              size="sm" 
              className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/80"
            >
              Save
            </Button>
            <Button 
              onClick={() => {
                setEditingUsername(false);
                setUsername(profile.username || '');
              }} 
              size="sm" 
              variant="outline" 
              className="border-puzzle-burgundy text-puzzle-burgundy hover:bg-puzzle-burgundy/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <CardTitle className="text-puzzle-white flex items-center justify-center">
          {profile.username || 'Username not set'}
          <button 
            onClick={() => setEditingUsername(true)} 
            className="ml-2 text-puzzle-aqua/70 hover:text-puzzle-aqua transition-colors"
          >
            ✏️
          </button>
        </CardTitle>
      )}
    </div>
  );
};

export default UsernameEditor;
