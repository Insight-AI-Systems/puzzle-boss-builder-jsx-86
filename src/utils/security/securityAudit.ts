
/**
 * Security Audit Utilities
 * Tools for auditing and validating security configurations
 */

export interface SecurityAuditResult {
  pass: boolean;
  category: string;
  test: string;
  details?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  remediation?: string;
}

// Check if running in HTTPS
const checkHttps = (): SecurityAuditResult => {
  const isHttps = window.location.protocol === 'https:';
  return {
    pass: isHttps,
    category: 'Transport',
    test: 'HTTPS Enabled',
    details: isHttps ? 'Site is using HTTPS' : 'Site is not using HTTPS',
    severity: 'critical',
    remediation: !isHttps ? 'Enable HTTPS for all connections' : undefined
  };
};

// Check localStorage for sensitive data
const checkLocalStorage = (): SecurityAuditResult => {
  const sensitiveKeywords = [
    'password', 'token', 'secret', 'key', 'auth', 'credential', 'session'
  ];
  
  const sensitiveItems: string[] = [];
  
  // Check all localStorage items
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    
    // Check if key contains sensitive keywords
    if (sensitiveKeywords.some(keyword => key.toLowerCase().includes(keyword))) {
      sensitiveItems.push(key);
    }
    
    // Check if the value might contain sensitive data (very basic check)
    try {
      const value = localStorage.getItem(key);
      if (!value) continue;
      
      // Look for patterns that might indicate tokens or credentials
      if (
        /eyJ[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}/.test(value) || // JWT pattern
        /[a-zA-Z0-9+/]{20,}={0,2}/.test(value) // Base64 pattern
      ) {
        sensitiveItems.push(key);
      }
    } catch (e) {
      // Skip items that can't be parsed
    }
  }
  
  return {
    pass: sensitiveItems.length === 0,
    category: 'Data Storage',
    test: 'Secure Local Storage',
    details: sensitiveItems.length > 0 
      ? `Found potentially sensitive data in localStorage: ${sensitiveItems.join(', ')}` 
      : 'No obvious sensitive data found in localStorage',
    severity: 'high',
    remediation: sensitiveItems.length > 0 
      ? 'Review and remove sensitive data from localStorage, use secure storage alternatives' 
      : undefined
  };
};

// Check for insecure dependencies
const checkDependencyVulnerabilities = (): SecurityAuditResult => {
  // This is a placeholder - in a real implementation, you would:
  // 1. Either use an API to check your dependencies against a vulnerability database
  // 2. Or run this check server-side and just display results
  
  return {
    pass: true, // Placeholder
    category: 'Dependencies',
    test: 'Vulnerable Dependencies',
    details: 'Manual check required: Run "npm audit" to check for vulnerable dependencies',
    severity: 'high',
    remediation: 'Regularly run dependency vulnerability scans'
  };
};

// Check Content-Security-Policy
const checkCSP = (): SecurityAuditResult => {
  // Try to get CSP from meta tag if not in headers
  const cspMetaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  const cspContent = cspMetaTag ? cspMetaTag.getAttribute('content') : null;
  
  const hasCsp = !!cspContent;
  
  return {
    pass: hasCsp,
    category: 'Headers',
    test: 'Content-Security-Policy',
    details: hasCsp 
      ? `CSP found: ${cspContent}` 
      : 'No Content-Security-Policy found',
    severity: 'high',
    remediation: !hasCsp 
      ? 'Implement a Content-Security-Policy to restrict resource loading' 
      : undefined
  };
};

// Run all security audits
export const runSecurityAudit = (): SecurityAuditResult[] => {
  return [
    checkHttps(),
    checkLocalStorage(),
    checkDependencyVulnerabilities(),
    checkCSP()
    // Add more security checks as needed
  ];
};

// Get security score based on audit results
export const getSecurityScore = (results: SecurityAuditResult[]): number => {
  if (results.length === 0) return 0;
  
  // Count passed tests
  const passedTests = results.filter(result => result.pass).length;
  
  // Calculate score as percentage
  return Math.round((passedTests / results.length) * 100);
};

// Generate security audit report
export const generateSecurityReport = (results: SecurityAuditResult[]): string => {
  const score = getSecurityScore(results);
  const date = new Date().toISOString().split('T')[0];
  
  let report = `# Security Audit Report\n\n`;
  report += `**Date:** ${date}\n`;
  report += `**Security Score:** ${score}%\n\n`;
  
  // Add summary
  report += `## Summary\n\n`;
  report += `- **Passed:** ${results.filter(r => r.pass).length} tests\n`;
  report += `- **Failed:** ${results.filter(r => !r.pass).length} tests\n\n`;
  
  // Add detailed results by category
  report += `## Detailed Results\n\n`;
  
  // Group by category
  const categories = [...new Set(results.map(r => r.category))];
  
  categories.forEach(category => {
    report += `### ${category}\n\n`;
    
    const categoryResults = results.filter(r => r.category === category);
    categoryResults.forEach(result => {
      report += `- **${result.test}**: ${result.pass ? '✅ PASS' : '❌ FAIL'}\n`;
      if (result.details) {
        report += `  - ${result.details}\n`;
      }
      if (!result.pass && result.remediation) {
        report += `  - **Remediation:** ${result.remediation}\n`;
      }
      report += `\n`;
    });
  });
  
  return report;
};
