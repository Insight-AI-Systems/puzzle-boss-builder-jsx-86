
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SimpleLoginForm from '@/components/simple-auth/LoginForm';
import SimpleRegisterForm from '@/components/simple-auth/RegisterForm';
import { useSimpleAuth } from '@/contexts/simple-auth';

const SimpleAuth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { user } = useSimpleAuth();

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-black/50 backdrop-blur-sm p-8 rounded-lg border border-cyan-500/20">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">
            Welcome to <span className="text-cyan-400">Puzzle Boss</span>
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {activeTab === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Create a new account to get started'}
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <SimpleLoginForm />
          </TabsContent>
          
          <TabsContent value="register">
            <SimpleRegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SimpleAuth;
