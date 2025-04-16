
import { runComponentTests, componentRenderTest } from './testUtils';
import { runAllComponentTests } from './componentTests';
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
