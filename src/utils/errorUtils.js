
export const logErrorToDOM = (error, source = 'Unknown') => {
  console.error(`[STARTUP:${source}] Error:`, error);
  
  try {
    const errorDisplay = document.createElement('div');
    errorDisplay.style.backgroundColor = '#800020';
    errorDisplay.style.color = 'white';
    errorDisplay.style.padding = '10px';
    errorDisplay.style.margin = '10px 0';
    errorDisplay.style.borderRadius = '4px';
    errorDisplay.innerHTML = `
      <h3>Error in ${source}</h3>
      <p>${error.message || String(error)}</p>
      ${error.stack ? `<pre style="white-space:pre-wrap;max-height:200px;overflow:auto;background:#111;padding:8px;font-size:12px">${error.stack}</pre>` : ''}
    `;
    
    // Try to add to diagnostics container first, fallback to body
    const diagnosticsEl = document.getElementById('startup-diagnostics');
    if (diagnosticsEl) {
      diagnosticsEl.appendChild(errorDisplay);
    } else {
      document.body.appendChild(errorDisplay);
    }
  } catch (displayError) {
    console.error('[STARTUP] Failed to display error:', displayError);
  }
};

export const createDiagnosticsContainer = () => {
  try {
    if (!document.getElementById('startup-diagnostics')) {
      const diagnosticsContainer = document.createElement('div');
      diagnosticsContainer.id = 'startup-diagnostics';
      diagnosticsContainer.style.margin = '20px';
      diagnosticsContainer.style.padding = '10px';
      diagnosticsContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
      diagnosticsContainer.style.color = '#00FFFF';
      diagnosticsContainer.style.fontFamily = 'monospace';
      document.body.appendChild(diagnosticsContainer);
    }
  } catch (e) {
    console.error('[STARTUP] Failed to create diagnostics container:', e);
  }
};
