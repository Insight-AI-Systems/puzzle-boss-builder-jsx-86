
import React from 'react';

const FallbackHTML = () => (
  <div style={{ color: '#FFD700', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' }}>
    <h1>The Puzzle Boss - Critical Recovery</h1>
    <p style={{ color: '#00FFFF' }}>React rendering failed completely. Using HTML fallback.</p>
    <div style={{ margin: '20px', padding: '15px', background: '#111', textAlign: 'left' }}>
      <h2 style={{ color: 'white' }}>Recovery Options:</h2>
      <button onClick={() => window.appRecovery.clearStorage()} 
        style={{ margin: '5px', padding: '8px', background: '#800020', color: 'white', border: 'none', cursor: 'pointer' }}>
        Clear Storage
      </button>
      <button onClick={() => window.appRecovery.reloadPage()} 
        style={{ margin: '5px', padding: '8px', background: '#00FFFF', color: 'black', border: 'none', cursor: 'pointer' }}>
        Reload Page
      </button>
      <button onClick={() => window.appRecovery.switchMode('emergency')} 
        style={{ margin: '5px', padding: '8px', background: '#FFD700', color: 'black', border: 'none', cursor: 'pointer' }}>
        Emergency Mode
      </button>
    </div>
  </div>
);

export default FallbackHTML;
