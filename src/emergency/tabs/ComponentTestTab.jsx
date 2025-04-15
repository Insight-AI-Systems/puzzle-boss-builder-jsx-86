
import React, { useState } from 'react';
import { ErrorCatcher } from '../components/ErrorCatcher';

const ComponentTestTab = ({ componentTests, testResults, runComponentTest }) => {
  const [selectedTest, setSelectedTest] = useState(null);

  const formatTime = (isoString) => {
    try {
      return new Date(isoString).toLocaleTimeString();
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Component Tests</h2>
      <div className="flex gap-6">
        <div className="w-1/3">
          <h3 className="text-xl text-puzzle-gold mb-3">Available Tests</h3>
          <div className="space-y-2">
            {Object.entries(componentTests).map(([id, test]) => (
              <button
                key={id}
                onClick={() => {
                  setSelectedTest(id);
                  runComponentTest(id);
                }}
                className={`w-full p-3 text-left rounded ${
                  selectedTest === id
                    ? 'bg-puzzle-black border border-puzzle-aqua'
                    : 'bg-black/30 hover:bg-black/50'
                }`}
              >
                <div className="font-bold">{test.name}</div>
                <div className="text-sm opacity-70 mt-1">{test.description}</div>
                {testResults[id] && (
                  <div className={`text-xs mt-2 ${
                    testResults[id].success ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {testResults[id].status} {testResults[id].success ? '✓' : '✗'}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="w-2/3 bg-black/40 rounded p-4">
          {selectedTest ? (
            <div>
              <h3 className="text-xl text-puzzle-gold mb-3">
                {componentTests[selectedTest]?.name || 'Test'} Results
              </h3>
              
              <div className="mb-4 bg-black/30 p-4 rounded min-h-[150px]">
                <ErrorCatcher>
                  {componentTests[selectedTest]?.component()}
                </ErrorCatcher>
              </div>
              
              {testResults[selectedTest] && (
                <div className="text-sm">
                  <div>Started: {formatTime(testResults[selectedTest].startTime)}</div>
                  {testResults[selectedTest].endTime && (
                    <div>Completed: {formatTime(testResults[selectedTest].endTime)}</div>
                  )}
                  <div className={`mt-2 ${
                    testResults[selectedTest].success ? 'text-green-400' : 'text-red-400'
                  }`}>
                    Status: {testResults[selectedTest].status}
                  </div>
                  {testResults[selectedTest].error && (
                    <div className="text-red-400 mt-2">
                      Error: {testResults[selectedTest].error}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 opacity-50">
              Select a test to run
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentTestTab;
