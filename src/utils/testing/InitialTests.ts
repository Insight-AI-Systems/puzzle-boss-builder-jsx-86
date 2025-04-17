
import { DatabaseTestRunner } from './runners/DatabaseTestRunner';
import { supabase } from '@/integrations/supabase/client';

export const runInitialTests = async () => {
  console.info('Running initial environment tests...');
  
  // Log current environment
  console.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Skip some tests in production
  if (process.env.NODE_ENV === 'production') {
    console.info('Running in production mode - skipping development tests');
    return;
  }
  
  // Test database connection
  const dbConnected = await DatabaseTestRunner.testDatabaseConnection();
  console.info(`Database connection: ${dbConnected ? 'OK' : 'FAILED'}`);
  
  // Test auth status
  const authOk = await DatabaseTestRunner.testAuthStatus();
  console.info(`Auth system: ${authOk ? 'OK' : 'FAILED'}`);
  
  // Create a demo admin account if it doesn't exist
  await createDemoAdminAccount();
};

const createDemoAdminAccount = async () => {
  try {
    // First check if the demo admin account exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', 'admin')
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking for demo admin account:', checkError);
      return;
    }
    
    // If the account already exists, do nothing
    if (existingUser) {
      console.info('Demo admin account already exists');
      return;
    }
    
    // Create the admin user
    const { data: userData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@puzzleboss.com',
      password: 'Puzzle123!',
      options: {
        data: {
          username: 'admin',
          role: 'super_admin'
        }
      }
    });
    
    if (signUpError) {
      console.error('Error creating demo admin account:', signUpError);
      return;
    }
    
    console.info('Demo admin account created successfully');
    
    // Update the profile if needed
    if (userData?.user?.id) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'super_admin' })
        .eq('id', userData.user.id);
      
      if (updateError) {
        console.error('Error updating demo admin profile:', updateError);
      }
    }
  } catch (err) {
    console.error('Unexpected error creating demo admin:', err);
  }
};
