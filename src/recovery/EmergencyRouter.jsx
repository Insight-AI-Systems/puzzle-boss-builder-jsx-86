
import React from 'react';
import { useNavigationHelper } from './useNavigationHelper';

/**
 * Simple router for emergency mode that doesn't depend on React Router
 * Uses vanilla JS for navigation between routes
 */
const EmergencyRouter = ({ routes, defaultContent }) => {
  const { currentPath, navigate } = useNavigationHelper();
  
  // Find matching route or default to homepage view
  const currentRoute = routes.find(route => route.path === currentPath) || routes[0];
  
  return (
    <div className="emergency-router">
      <div className="emergency-router-nav">
        <div className="routes-list">
          <h3 className="text-puzzle-gold mb-4">Test Navigation</h3>
          <div className="flex flex-wrap gap-2">
            {routes.map(route => (
              <button
                key={route.path}
                onClick={() => navigate(route.path)}
                className={`px-4 py-2 rounded text-sm ${
                  currentPath === route.path
                    ? 'bg-puzzle-gold text-black'
                    : 'bg-black/30 text-puzzle-aqua hover:bg-black/50'
                }`}
              >
                {route.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="emergency-router-content mt-6 p-4 bg-black/30 rounded">
        <h3 className="text-puzzle-gold mb-2">
          {currentRoute?.name || 'Default View'} Content
        </h3>
        <div>
          {currentRoute?.component ? (
            currentRoute.component()
          ) : (
            defaultContent || (
              <div className="p-4 bg-black/20 rounded">
                <p>Select a route to test its content.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyRouter;
