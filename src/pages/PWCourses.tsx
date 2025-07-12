
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Users, DollarSign, PlayCircle, AlertCircle, Lock } from 'lucide-react';
import { fetchBatches, type Batch } from '@/services/supabaseService';

const PWCourses = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check if user has generated a key (has the cookie)
    const checkAccess = () => {
      const cookies = document.cookie.split(';');
      const hasServerKey = cookies.some(cookie => 
        cookie.trim().startsWith('server02KeyGenerated=') ||
        cookie.trim().startsWith('server03KeyGenerated=') ||
        cookie.trim().startsWith('recommendServerKeyGenerated=')
      );
      
      if (!hasServerKey) {
        // Redirect back to task verification if no key is found
        navigate('/courses/pw-courses');
        return;
      }
      
      setHasAccess(true);
      loadBatches();
    };

    checkAccess();
  }, [navigate]);

  const loadBatches = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Loading batches for PW Courses');

      const allBatches = await fetchBatches();
      console.log('📊 All batches from database:', allBatches);
      
      // Filter for PW courses or batches without course_id (default to PW)
      const pwBatches = allBatches.filter((batch: Batch) => {
        const batchCourseId = batch.course_id;
        return !batchCourseId || batchCourseId === 'pw-courses';
      });
      
      console.log('📋 PW Courses batches:', pwBatches.map(b => ({ name: b.name, course_id: b.course_id })));
      
      setBatches(pwBatches);
    } catch (error) {
      console.error('❌ Error loading batches:', error);
      setError('Failed to load batches. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading PW Courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/dcac7197-2a19-41d1-9f13-20ca958e4750.png" 
              alt="StudyX Premium" 
              className="h-8 w-auto"
            />
          </div>
        </div>
      </header>

      {/* Course Hero */}
      <section className="bg-gradient-to-br from-green-400 to-green-600 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-white">PW Courses</h1>
          <p className="text-white/80 text-lg mb-4">Physics Wallah Integration - Premium Access Granted</p>
          <div className="flex flex-wrap gap-2">
            {['Physics', 'Chemistry', 'Mathematics', 'Biology'].map((subject, index) => (
              <Badge key={index} variant="secondary" className="bg-white/20 text-white">
                {subject}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Access Status */}
      <section className="p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-green-900/20 border-green-500/50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <PlayCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-300">Access Key Verified - Welcome to PW Courses!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Batches Section */}
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-white">Available Batches</h2>
          
          {error && (
            <Card className="bg-red-900/20 border-red-500/50 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-300">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {batches.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 mb-4">No PW Course batches available yet.</p>
                <p className="text-sm text-gray-500">
                  Batches will appear here once they are added by the admin.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batches.map((batch) => (
                <Card key={batch.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardHeader>
                    {batch.image_url && (
                      <img 
                        src={batch.image_url} 
                        alt={batch.name}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-bold text-white">{batch.name}</h3>
                    <p className="text-gray-400 text-sm">{batch.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {batch.start_date && batch.end_date && (
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(batch.start_date).toLocaleDateString()} - {new Date(batch.end_date).toLocaleDateString()}
                        </div>
                      )}
                      {batch.fee && (
                        <div className="flex items-center text-sm text-gray-400">
                          <DollarSign className="w-4 h-4 mr-2" />
                          ₹{batch.fee}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(batch.subjects || []).map((subject, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {subject}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => navigate(`/batch/${batch.id}`)}
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Access Batch
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PWCourses;
