
/**
 * The Puzzle Boss - Emergency Recovery Script
 * This standalone script can be used to recover from catastrophic errors
 * by clearing storage and offering basic diagnostic tools.
 * 
 * To use: Add <script src="/recovery.js"></script> to any HTML page
 */

(function() {
  console.log('[RECOVERY] Initializing emergency recovery script');
  
  // Create recovery UI
  function createRecoveryUI() {
    // Create container
    const container = document.createElement('div');
    container.id = 'tb-recovery-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.right = '0';
    container.style.bottom = '0';
    container.style.backgroundColor = 'rgba(0,0,0,0.9)';
    container.style.color = '#00FFFF';
    container.style.fontFamily = 'system-ui, sans-serif';
    container.style.padding = '20px';
    container.style.zIndex = '999999';
    container.style.overflow = 'auto';
    
    // Create header
    const header = document.createElement('div');
    header.innerHTML = `
      <h1 style="color: #FFD700; margin-bottom: 20px;">The Puzzle Boss - Emergency Recovery</h1>
      <p style="margin-bottom: 20px;">Use this tool to recover from application errors.</p>
    `;
    
    // Create action buttons
    const actions = document.createElement('div');
    actions.style.marginBottom = '20px';
    actions.innerHTML = `
      <button id="tb-clear-storage" style="background: #800020; color: white; border: none; padding: 8px 15px; margin-right: 10px; cursor: pointer; border-radius: 4px;">
        Clear All Storage
      </button>
      <button id="tb-reload-app" style="background: #00FFFF; color: black; border: none; padding: 8px 15px; margin-right: 10px; cursor: pointer; border-radius: 4px;">
        Reload Application
      </button>
      <button id="tb-go-home" style="background: #FFD700; color: black; border: none; padding: 8px 15px; margin-right: 10px; cursor: pointer; border-radius: 4px;">
        Go to Homepage
      </button>
      <button id="tb-close-recovery" style="background: #333; color: white; border: none; padding: 8px 15px; cursor: pointer; border-radius: 4px;">
        Close Recovery Tool
      </button>
    `;
    
    // Create diagnostic section
    const diagnostics = document.createElement('div');
    diagnostics.style.backgroundColor = 'rgba(0,0,0,0.5)';
    diagnostics.style.padding = '15px';
    diagnostics.style.borderRadius = '4px';
    diagnostics.style.marginBottom = '20px';
    
    // Create info table
    const info = document.createElement('table');
    info.style.width = '100%';
    info.style.borderCollapse = 'collapse';
    info.style.marginBottom = '15px';
    info.innerHTML = `
      <tr style="border-bottom: 1px solid #333;">
        <td style="padding: 8px; color: #FFD700; width: 180px;">Browser:</td>
        <td style="padding: 8px;">${navigator.userAgent}</td>
      </tr>
      <tr style="border-bottom: 1px solid #333;">
        <td style="padding: 8px; color: #FFD700;">URL:</td>
        <td style="padding: 8px;">${window.location.href}</td>
      </tr>
      <tr style="border-bottom: 1px solid #333;">
        <td style="padding: 8px; color: #FFD700;">Screen Size:</td>
        <td style="padding: 8px;">${window.innerWidth}x${window.innerHeight}</td>
      </tr>
      <tr style="border-bottom: 1px solid #333;">
        <td style="padding: 8px; color: #FFD700;">Local Storage:</td>
        <td style="padding: 8px;">${testStorage('localStorage') ? 'Available' : 'Not Available'}</td>
      </tr>
      <tr style="border-bottom: 1px solid #333;">
        <td style="padding: 8px; color: #FFD700;">Session Storage:</td>
        <td style="padding: 8px;">${testStorage('sessionStorage') ? 'Available' : 'Not Available'}</td>
      </tr>
      <tr style="border-bottom: 1px solid #333;">
        <td style="padding: 8px; color: #FFD700;">Cookies Enabled:</td>
        <td style="padding: 8px;">${navigator.cookieEnabled ? 'Yes' : 'No'}</td>
      </tr>
      <tr style="border-bottom: 1px solid #333;">
        <td style="padding: 8px; color: #FFD700;">Timestamp:</td>
        <td style="padding: 8px;">${new Date().toISOString()}</td>
      </tr>
    `;
    
    // Create log area
    const logContainer = document.createElement('div');
    logContainer.innerHTML = `
      <h3 style="color: #FFD700; margin-top: 0;">Recovery Log</h3>
      <div id="tb-recovery-log" style="background: #111; height: 150px; overflow-y: auto; padding: 10px; font-family: monospace; font-size: 12px; border-radius: 4px;"></div>
    `;
    
    // Add result message area
    const resultMessage = document.createElement('div');
    resultMessage.id = 'tb-recovery-message';
    resultMessage.style.marginTop = '10px';
    resultMessage.style.padding = '10px';
    resultMessage.style.display = 'none';
    resultMessage.style.borderRadius = '4px';
    
    // Assemble UI
    diagnostics.appendChild(info);
    diagnostics.appendChild(logContainer);
    diagnostics.appendChild(resultMessage);
    
    container.appendChild(header);
    container.appendChild(actions);
    container.appendChild(diagnostics);
    
    // Add to document
    document.body.appendChild(container);
    
    // Attach event handlers
    document.getElementById('tb-clear-storage').addEventListener('click', function() {
      clearAllStorage();
    });
    
    document.getElementById('tb-reload-app').addEventListener('click', function() {
      logMessage('Reloading application...');
      window.location.reload();
    });
    
    document.getElementById('tb-go-home').addEventListener('click', function() {
      logMessage('Navigating to homepage...');
      window.location.href = '/';
    });
    
    document.getElementById('tb-close-recovery').addEventListener('click', function() {
      container.style.display = 'none';
    });
    
    logMessage('Recovery tool initialized');
  }
  
  function testStorage(type) {
    try {
      const storage = window[type];
      const testKey = '__test__';
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  function clearAllStorage() {
    try {
      const result = {
        localStorage: false,
        sessionStorage: false,
        cookies: false
      };
      
      // Clear localStorage
      try {
        localStorage.clear();
        result.localStorage = true;
        logMessage('Local storage cleared');
      } catch (e) {
        logMessage('Failed to clear localStorage: ' + e.message, true);
      }
      
      // Clear sessionStorage
      try {
        sessionStorage.clear();
        result.sessionStorage = true;
        logMessage('Session storage cleared');
      } catch (e) {
        logMessage('Failed to clear sessionStorage: ' + e.message, true);
      }
      
      // Clear cookies
      try {
        document.cookie.split(';').forEach(function(cookie) {
          const parts = cookie.split('=');
          const name = parts[0].trim();
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        });
        result.cookies = true;
        logMessage('Cookies cleared');
      } catch (e) {
        logMessage('Failed to clear cookies: ' + e.message, true);
      }
      
      // Show result message
      const messageEl = document.getElementById('tb-recovery-message');
      if (messageEl) {
        if (result.localStorage && result.sessionStorage && result.cookies) {
          messageEl.style.backgroundColor = '#004400';
          messageEl.style.color = 'white';
          messageEl.textContent = 'All storage cleared successfully!';
        } else {
          messageEl.style.backgroundColor = '#440000';
          messageEl.style.color = 'white';
          messageEl.textContent = 'Some storage types could not be cleared. See log for details.';
        }
        messageEl.style.display = 'block';
      }
      
      return result;
    } catch (e) {
      logMessage('Error in clearAllStorage: ' + e.message, true);
    }
  }
  
  function logMessage(message, isError) {
    console[isError ? 'error' : 'log']('[RECOVERY] ' + message);
    
    const logContainer = document.getElementById('tb-recovery-log');
    if (logContainer) {
      const entry = document.createElement('div');
      entry.style.color = isError ? '#FF5555' : '#FFFFFF';
      entry.style.marginBottom = '5px';
      
      const timestamp = new Date().toTimeString().split(' ')[0];
      entry.textContent = `[${timestamp}] ${message}`;
      
      logContainer.appendChild(entry);
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }
  
  // Export functions globally
  window.tbRecovery = {
    show: function() {
      const container = document.getElementById('tb-recovery-container');
      if (container) {
        container.style.display = 'block';
      } else {
        createRecoveryUI();
      }
    },
    hide: function() {
      const container = document.getElementById('tb-recovery-container');
      if (container) {
        container.style.display = 'none';
      }
    },
    clearStorage: clearAllStorage,
    log: logMessage
  };
  
  // Check if we should auto-initialize
  if (window.location.search.includes('recovery=true')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createRecoveryUI);
    } else {
      createRecoveryUI();
    }
  }
  
  // Add keyboard shortcut (Ctrl+Alt+R)
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.altKey && e.key === 'r') {
      window.tbRecovery.show();
      e.preventDefault();
    }
  });
  
  console.log('[RECOVERY] Recovery script loaded. Press Ctrl+Alt+R to activate or add ?recovery=true to URL');
})();
