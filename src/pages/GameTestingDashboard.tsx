
import React from 'react';
import { RoleBasedAccess } from '@/components/auth/RoleBasedAccess';
import GameTestingDashboard from '@/components/admin/testing/GameTestingDashboard';

const GameTestingDashboardPage: React.FC = () => {
  return (
    <RoleBasedAccess
      allowedRoles={['admin', 'super-admin']}
      fallback={
        <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-puzzle-white mb-4">Access Denied</h1>
            <p className="text-puzzle-aqua">You need admin privileges to access the game testing dashboard.</p>
          </div>
        </div>
      }
    >
      <GameTestingDashboard />
    </RoleBasedAccess>
  );
};

export default GameTestingDashboardPage;
