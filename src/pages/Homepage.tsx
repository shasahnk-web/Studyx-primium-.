
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ArrowRight } from 'lucide-react';

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed the gate
    const gateCompleted = localStorage.getItem('gateCompleted') === 'true';
    if (!gateCompleted) {
      navigate('/gate');
    }
  }, [navigate]);

  const handleEnterApp = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8">
            <div className="mb-6">
              <Home className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Welcome to the Homepage!
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                You've successfully accessed StudyX Premium. Ready to start your learning journey?
              </p>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={handleEnterApp}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              >
                Enter StudyX Platform
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <p className="text-sm text-gray-400">
                Access your courses, study materials, and more inside the platform
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Homepage;
