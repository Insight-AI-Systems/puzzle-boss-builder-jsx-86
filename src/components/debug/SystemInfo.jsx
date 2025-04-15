
import React from 'react';

const SystemInfo = ({ renderInfo, appStateInfo }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
      <div className="p-2 bg-gray-800/50 rounded">
        <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Environment</h3>
        <p className="text-xs text-gray-300">Mode: <span className="text-white">{process.env.NODE_ENV}</span></p>
        <p className="text-xs text-gray-300">Rendered at: <span className="text-white">{renderInfo.renderedAt}</span></p>
        <p className="text-xs text-gray-300">DOM Elements: <span className="text-white">{renderInfo.componentCount}</span></p>
        <p className="text-xs text-gray-300">Current route: <span className="text-white">{renderInfo.routePath}</span></p>
      </div>
      
      <div className="p-2 bg-gray-800/50 rounded">
        <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Application State</h3>
        <p className="text-xs text-gray-300">React loaded: <span className={appStateInfo.moduleLoaded.react ? "text-green-400" : "text-red-400"}>{appStateInfo.moduleLoaded.react ? "Yes" : "No"}</span></p>
        <p className="text-xs text-gray-300">Root element: <span className={appStateInfo.moduleLoaded.reactDOM ? "text-green-400" : "text-red-400"}>{appStateInfo.moduleLoaded.reactDOM ? "Found" : "Not found"}</span></p>
        <p className="text-xs text-gray-300">Router: <span className={appStateInfo.moduleLoaded.router ? "text-green-400" : "text-red-400"}>{appStateInfo.moduleLoaded.router ? "Working" : "Not working"}</span></p>
        <p className="text-xs text-gray-300">App module: <span className={appStateInfo.moduleLoaded.app ? "text-green-400" : "text-red-400"}>{appStateInfo.moduleLoaded.app ? "Loaded" : "Not loaded"}</span></p>
      </div>
      
      <div className="p-2 bg-gray-800/50 rounded">
        <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Browser</h3>
        <p className="text-xs text-gray-300">Window: <span className="text-white">{window.innerWidth}x{window.innerHeight}</span></p>
        <p className="text-xs text-gray-300">User Agent: <span className="text-white truncate block">{navigator.userAgent}</span></p>
      </div>
      
      <div className="p-2 bg-gray-800/50 rounded">
        <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Resources</h3>
        <p className="text-xs text-gray-300">Scripts loaded: <span className={appStateInfo.allScriptsLoaded ? "text-green-400" : "text-yellow-400"}>{appStateInfo.allScriptsLoaded ? "All loaded" : "Some pending"}</span></p>
        <p className="text-xs text-gray-300">Navigator online: <span className={navigator.onLine ? "text-green-400" : "text-red-400"}>{navigator.onLine ? "Yes" : "No"}</span></p>
      </div>
    </div>
  );
};

export default SystemInfo;
