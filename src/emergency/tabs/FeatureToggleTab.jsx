
import React from 'react';

const FeatureToggleTab = ({ featureToggles, toggleFeature }) => {
  return (
    <div>
      <h2 className="text-2xl mb-4">Feature Toggles</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(featureToggles).map(([feature, enabled]) => (
          <div key={feature} className="bg-black/30 p-4 rounded flex justify-between items-center">
            <div>
              <div className="font-bold text-puzzle-gold">
                {feature.charAt(0).toUpperCase() + feature.slice(1)}
              </div>
              <div className="text-sm opacity-70 mt-1">
                {enabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            <button 
              onClick={() => toggleFeature(feature)}
              className={`px-4 py-2 rounded ${
                enabled 
                  ? 'bg-puzzle-aqua text-black' 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureToggleTab;
