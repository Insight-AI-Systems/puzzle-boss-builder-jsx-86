
import React from 'react';
import { useAuth } from '@/hooks/auth';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { isAuthenticated, user, signOut } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-puzzle-white mb-8">Profile</h1>
        
        <div className="bg-puzzle-black/50 border border-puzzle-aqua/20 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-puzzle-aqua mb-2">Email</label>
            <p className="text-puzzle-white">{user?.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-puzzle-aqua mb-2">User ID</label>
            <p className="text-puzzle-white/70 font-mono text-sm">{user?.id}</p>
          </div>
          
          <div className="pt-4 border-t border-puzzle-aqua/20">
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
