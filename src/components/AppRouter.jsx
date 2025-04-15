import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppMode } from '@/contexts/app-mode';
import MinimalApp from '@/MinimalApp';
import { routes } from '@/routes';

const AppRouter = () => {
  const { isMinimal } = useAppMode();

  // Render minimal app if in minimal mode
  if (isMinimal) {
    return <MinimalApp />;
  }

  // Otherwise render the regular app routes
  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} {...route} />
      ))}
    </Routes>
  );
};

export default AppRouter;
