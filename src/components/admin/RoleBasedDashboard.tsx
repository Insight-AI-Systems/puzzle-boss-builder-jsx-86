
import React from 'react';
import { UserRole } from '@/types/userTypes';

interface RoleBasedDashboardProps {
  userRole?: UserRole;
  isProtectedAdmin?: boolean;
}

export const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ 
  userRole = 'player',
  isProtectedAdmin = false
}) => {
  // Special case for protected admin
  if (isProtectedAdmin) {
    return (
      <div className="space-y-6">
        <div className="bg-green-900 p-4 rounded-md">
          <h2 className="text-xl font-medium text-white">Protected Admin Access</h2>
          <p className="text-green-100">You have full system access as a protected administrator.</p>
        </div>
        {/* Admin features */}
        {renderAdminFeatures()}
      </div>
    );
  }

  // Role-based dashboard content
  switch (userRole) {
    case 'super_admin':
      return (
        <div className="space-y-6">
          <div className="bg-red-900 p-4 rounded-md">
            <h2 className="text-xl font-medium text-white">Super Admin Dashboard</h2>
            <p className="text-red-100">You have access to all system functions and configurations.</p>
          </div>
          {renderAdminFeatures()}
        </div>
      );
      
    case 'admin':
      return (
        <div className="space-y-6">
          <div className="bg-blue-900 p-4 rounded-md">
            <h2 className="text-xl font-medium text-white">Admin Dashboard</h2>
            <p className="text-blue-100">You can manage users, content, and key site functions.</p>
          </div>
          {renderAdminFeatures()}
        </div>
      );
      
    case 'category_manager':
      return (
        <div className="space-y-6">
          <div className="bg-indigo-900 p-4 rounded-md">
            <h2 className="text-xl font-medium text-white">Category Manager Dashboard</h2>
            <p className="text-indigo-100">Manage puzzle categories and related content.</p>
          </div>
          {renderCategoryManagerFeatures()}
        </div>
      );
    
    case 'social_media_manager':
      return (
        <div className="space-y-6">
          <div className="bg-purple-900 p-4 rounded-md">
            <h2 className="text-xl font-medium text-white">Social Media Manager Dashboard</h2>
            <p className="text-purple-100">Create and manage social media content and promotions.</p>
          </div>
          {renderSocialMediaFeatures()}
        </div>
      );
      
    case 'partner_manager':
      return (
        <div className="space-y-6">
          <div className="bg-amber-900 p-4 rounded-md">
            <h2 className="text-xl font-medium text-white">Partner Manager Dashboard</h2>
            <p className="text-amber-100">Manage partner relationships and prize suppliers.</p>
          </div>
          {renderPartnerManagerFeatures()}
        </div>
      );
      
    case 'cfo':
      return (
        <div className="space-y-6">
          <div className="bg-emerald-900 p-4 rounded-md">
            <h2 className="text-xl font-medium text-white">CFO Dashboard</h2>
            <p className="text-emerald-100">Financial data and reporting access.</p>
          </div>
          {renderCfoFeatures()}
        </div>
      );
    
    default:
      return (
        <div className="space-y-6">
          <div className="bg-gray-900 p-4 rounded-md">
            <h2 className="text-xl font-medium text-white">Access Denied</h2>
            <p className="text-gray-100">You do not have administrator privileges.</p>
          </div>
        </div>
      );
  }
};

// Helper functions to render role-specific features
function renderAdminFeatures() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div className="bg-black/30 p-5 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-2">User Management</h3>
        <p className="text-gray-300 mb-4">Manage user accounts and roles</p>
      </div>
      
      <div className="bg-black/30 p-5 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-2">Content Management</h3>
        <p className="text-gray-300 mb-4">Manage puzzles and categories</p>
      </div>
      
      <div className="bg-black/30 p-5 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-2">Site Settings</h3>
        <p className="text-gray-300 mb-4">Configure global site settings</p>
      </div>
    </div>
  );
}

function renderCategoryManagerFeatures() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <div className="bg-black/30 p-5 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-2">Category Overview</h3>
        <p className="text-gray-300 mb-4">View and edit your assigned categories</p>
      </div>
      
      <div className="bg-black/30 p-5 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-2">Puzzle Management</h3>
        <p className="text-gray-300 mb-4">Create and manage puzzles</p>
      </div>
    </div>
  );
}

function renderSocialMediaFeatures() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <div className="bg-black/30 p-5 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-2">Content Calendar</h3>
        <p className="text-gray-300 mb-4">Schedule and manage social media posts</p>
      </div>
      
      <div className="bg-black/30 p-5 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-2">Analytics</h3>
        <p className="text-gray-300 mb-4">View social media performance metrics</p>
      </div>
    </div>
  );
}

function renderPartnerManagerFeatures() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <div className="bg-black/30 p-5 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-2">Partner Directory</h3>
        <p className="text-gray-300 mb-4">Manage partner relationships</p>
      </div>
      
      <div className="bg-black/30 p-5 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-2">Prize Management</h3>
        <p className="text-gray-300 mb-4">Configure prize offerings</p>
      </div>
    </div>
  );
}

function renderCfoFeatures() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <div className="bg-black/30 p-5 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-2">Financial Overview</h3>
        <p className="text-gray-300 mb-4">View site income and expenses</p>
      </div>
      
      <div className="bg-black/30 p-5 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-2">Reports</h3>
        <p className="text-gray-300 mb-4">Generate financial reports</p>
      </div>
    </div>
  );
}
