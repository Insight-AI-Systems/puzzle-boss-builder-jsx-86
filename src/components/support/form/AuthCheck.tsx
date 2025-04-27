
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export const AuthCheck = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
      <CardContent className="pt-6">
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-puzzle-aqua mb-4" />
          <h3 className="text-xl font-medium mb-2">Authentication Required</h3>
          <p className="text-puzzle-white/70 mb-6">
            Please log in to create a support ticket.
          </p>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
