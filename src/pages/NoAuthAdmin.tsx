import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function NoAuthAdmin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🎯 Admin Dashboard (No Auth Required)
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gray-800 border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-purple-400">🧩 Puzzle Management</h2>
            <p className="text-gray-300 mb-4">Manage puzzle configurations and settings</p>
            <Button 
              onClick={() => navigate('/games/jigsaw')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Go to Enhanced Puzzle
            </Button>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-blue-400">👥 User Management</h2>
            <p className="text-gray-300 mb-4">View and manage user accounts</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Manage Users
            </Button>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-green-400">📊 Analytics</h2>
            <p className="text-gray-300 mb-4">View game statistics and metrics</p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              View Analytics
            </Button>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-yellow-400">🎮 Game Settings</h2>
            <p className="text-gray-300 mb-4">Configure game parameters</p>
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
              Game Config
            </Button>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-red-400">🏆 Leaderboards</h2>
            <p className="text-gray-300 mb-4">Manage scores and rankings</p>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              View Leaderboards
            </Button>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-indigo-400">⚙️ Settings</h2>
            <p className="text-gray-300 mb-4">System configuration</p>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
              System Settings
            </Button>
          </Card>
        </div>

        <Card className="p-6 bg-gray-800 border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400 text-sm">Active Games</p>
              <p className="text-2xl font-bold">56</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400 text-sm">Puzzles Completed</p>
              <p className="text-2xl font-bold">8,901</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400 text-sm">Avg. Score</p>
              <p className="text-2xl font-bold">742</p>
            </div>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">
            This is a no-authentication admin panel for testing purposes.
          </p>
          <div className="space-x-4">
            <Button onClick={() => navigate('/')} variant="outline">
              Go to Home
            </Button>
            <Button onClick={() => navigate('/games/jigsaw')} variant="outline">
              Test New Puzzle
            </Button>
            <Button onClick={() => navigate('/test-headbreaker')} variant="outline" className="bg-purple-600 hover:bg-purple-700">
              Test Fixed Headbreaker
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}