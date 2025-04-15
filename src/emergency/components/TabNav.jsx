
import React from 'react';

const TabNav = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex border-b border-gray-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 ${
              activeTab === tab.id 
                ? 'bg-black/30 text-puzzle-aqua border-b-2 border-puzzle-aqua' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNav;
