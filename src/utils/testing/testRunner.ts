
import React from 'react';
import { runComponentTests, componentRenderTest } from './testUtils';
import { UsersTab } from '@/components/admin/analytics/tabs/UsersTab';
import { AnalyticsTabs } from '@/components/admin/analytics/AnalyticsTabs';

export function runComponentTestSuite() {
  const tests = [
    {
      name: 'UsersTab Component',
      test: () => componentRenderTest(UsersTab)
    },
    {
      name: 'AnalyticsTabs Component',
      test: () => componentRenderTest(AnalyticsTabs)
    }
  ];

  runComponentTests(tests);
  
  // Run specific component tests
  runAllComponentTests();
  
  return true;
}

// Add this function to the window object so it can be called from the browser console
if (typeof window !== 'undefined') {
  (window as any).runTests = runComponentTestSuite;
}

// Function to test tab definitions
export function testTabDefinitions() {
  try {
    const { getTabDefinitions } = require('@/components/admin/dashboard/TabDefinitions');
    const tabs = getTabDefinitions();
    
    // Test that tabs are defined and have expected properties
    if (!Array.isArray(tabs)) {
      return { 
        success: false, 
        message: `Expected tabs to be an array, but got ${typeof tabs}` 
      };
    }
    
    // Check that all tabs have required properties
    const invalidTabs = tabs.filter(tab => {
      return !tab.id || !tab.label || !tab.icon || !Array.isArray(tab.roles);
    });
    
    if (invalidTabs.length > 0) {
      return { 
        success: false, 
        message: `Found ${invalidTabs.length} tabs with missing required properties` 
      };
    }
    
    // Test that all specified roles are valid
    const validRoles = ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'];
    
    const tabsWithInvalidRoles = tabs.filter(tab => {
      return tab.roles.some(role => !validRoles.includes(role));
    });
    
    if (tabsWithInvalidRoles.length > 0) {
      return { 
        success: false, 
        message: `Found tabs with invalid roles: ${tabsWithInvalidRoles.map(t => t.id).join(', ')}` 
      };
    }
    
    return { 
      success: true, 
      message: `All ${tabs.length} tabs have valid properties and roles` 
    };
  } catch (error) {
    return { 
      success: false, 
      message: `Error testing tab definitions: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

// Run all component-specific tests
export function runAllComponentTests() {
  console.log('🧪 Running specific component tests...');
  
  const tabDefResult = testTabDefinitions();
  if (tabDefResult.success) {
    console.log(`✅ Tab Definitions: ${tabDefResult.message}`);
  } else {
    console.error(`❌ Tab Definitions: ${tabDefResult.message}`);
  }
}
