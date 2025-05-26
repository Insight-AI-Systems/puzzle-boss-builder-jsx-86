
import React from 'react';
import { useAuth } from '@/hooks/auth';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-puzzle-aqua border-t-transparent mx-auto"></div>
          <p className="text-puzzle-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-puzzle-white">Profile</h1>
        
        <div className="bg-puzzle-black/50 border border-puzzle-aqua/20 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-puzzle-aqua">Account Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-puzzle-white/70 mb-1">
                Email
              </label>
              <p className="text-puzzle-white">{user?.email}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-puzzle-white/70 mb-1">
                Member Since
              </label>
              <p className="text-puzzle-white">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
