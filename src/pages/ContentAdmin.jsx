
import React from 'react';
import ContentManager from '@/components/admin/ContentManager';
import { Helmet } from 'react-helmet';

const ContentAdmin = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Content Management | The Puzzle Boss Admin</title>
      </Helmet>
      
      <ContentManager />
    </div>
  );
};

export default ContentAdmin;
