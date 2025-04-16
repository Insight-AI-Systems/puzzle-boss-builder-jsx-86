
import React from 'react';
import { render } from '@testing-library/react';

// Custom render function for components that might need providers
export function renderWithProviders(ui: React.ReactElement, options = {}) {
  return render(ui, {
    ...options,
  });
}

// Simple test function to verify a component renders without crashing
export async function componentRenderTest(Component: React.ComponentType<any>, props = {}) {
  try {
    renderWithProviders(<Component {...props} />);
    return { success: true, message: 'Component rendered successfully' };
  } catch (error) {
    return { 
      success: false, 
      message: `Component failed to render: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

// Simple test runner that logs results to console
export function runComponentTests(tests: Array<{ name: string; test: () => Promise<any> }>) {
  console.log('🧪 Running component tests...');
  
  tests.forEach(async ({ name, test }) => {
    try {
      const result = await test();
      if (result.success) {
        console.log(`✅ ${name}: ${result.message}`);
      } else {
        console.error(`❌ ${name}: ${result.message}`);
      }
    } catch (error) {
      console.error(`❌ ${name}: Unexpected error: ${error instanceof Error ? error.message : String(error)}`)
    }
  });
}
