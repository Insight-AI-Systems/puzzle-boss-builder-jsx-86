
import React from 'react';

const SystemInfoTab = ({ diagnosticData, runDiagnostics }) => {
  return (
    <div>
      <h2 className="text-2xl mb-4">System Diagnostics</h2>
      <div className="bg-black/30 rounded overflow-hidden">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b border-gray-800">
              <td className="p-3 text-puzzle-gold">React Version:</td>
              <td className="p-3">{diagnosticData.reactVersion}</td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="p-3 text-puzzle-gold">Browser:</td>
              <td className="p-3">{diagnosticData.browser}</td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="p-3 text-puzzle-gold">Screen Size:</td>
              <td className="p-3">{diagnosticData.screenSize}</td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="p-3 text-puzzle-gold">URL:</td>
              <td className="p-3">{window.location.href}</td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="p-3 text-puzzle-gold">Local Storage:</td>
              <td className="p-3">{diagnosticData.localStorage ? 'Available' : 'Not Available'}</td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="p-3 text-puzzle-gold">Session Storage:</td>
              <td className="p-3">{diagnosticData.sessionStorage ? 'Available' : 'Not Available'}</td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="p-3 text-puzzle-gold">Storage Items:</td>
              <td className="p-3">{diagnosticData.storageItems}</td>
            </tr>
            <tr>
              <td className="p-3 text-puzzle-gold">Last Updated:</td>
              <td className="p-3">{diagnosticData.timestamp}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button 
        onClick={runDiagnostics}
        className="mt-4 px-4 py-2 bg-puzzle-burgundy text-white rounded hover:bg-puzzle-burgundy/80"
      >
        Refresh Diagnostics
      </button>
    </div>
  );
};

export default SystemInfoTab;
