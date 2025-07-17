import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Users, Clock, Settings, Download, Video, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchBatches, fetchNotes, fetchDPPs, type Batch, type Note, type DPP } from '@/services/supabaseService';

const Index = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [dpps, setDPPs] = useState<DPP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [loadingKey, setLoadingKey] = useState(false);

  // Check if valid key exists in localStorage
  const hasValidKey = () => {
    const keyData = localStorage.getItem('pwCoursesAccess');
    if (!keyData) return false;
    
    const { expiry } = JSON.parse(keyData);
    return new Date().getTime() < expiry;
  };

  useEffect(() => {
    loadAllData();
    
    // Redirect if trying to access PW Courses directly without key
    if (window.location.pathname.includes('/courses/pw-courses') && !hasValidKey()) {
      navigate('/');
    }
  }, [navigate]);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const [batchesData, notesData, dppsData] = await Promise.all([
        fetchBatches(),
        fetchNotes(),
        fetchDPPs()
      ]);
      setBatches(batchesData);
      setNotes(notesData);
      setDPPs(dppsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateKeyAndRedirect = () => {
    setLoadingKey(true);
    
    setTimeout(() => {
      // Store key with 24-hour expiry
      const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem('pwCoursesAccess', JSON.stringify({ expiry }));
      
      setLoadingKey(false);
      navigate('/courses/pw-courses');
    }, 2000);
  };

  // ... [Keep all other existing code exactly the same until courses array]

  const courses = [
    {
      id: 'pw-courses',
      title: 'PW Courses',
      subtitle: 'Physics Wallah Integration',
      description: 'Padhlo chahe kahin se, Manzil milegi yahi se!',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
      gradient: 'from-green-400 to-green-600',
      icon: '🔬',
      badge: 'PW',
      requiresKey: true // This flag triggers key generation
    },
    // ... [Keep all other course objects exactly the same]
  ];

  const handleCourseClick = (course: any) => {
    if (course.link) {
      window.location.href = course.link;
    } else if (course.requiresKey) {
      if (hasValidKey()) {
        navigate(`/courses/${course.id}`);
      } else {
        setShowKeyModal(true);
      }
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  // ... [Keep all other existing code exactly the same until the return statement]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Key Generation Modal - Only this new part added */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-green-500">
            <h3 className="text-2xl font-bold mb-4 text-green-400">Generate Access Key</h3>
            <p className="text-gray-300 mb-6">
              Your access key will be valid for 24 hours. After expiry, you'll need to generate a new key.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={generateKeyAndRedirect}
                disabled={loadingKey}
                className="bg-green-600 hover:bg-green-700 w-full"
              >
                {loadingKey ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Key...
                  </span>
                ) : (
                  'Generate Key & Continue'
                )}
              </Button>
            </div>
            {loadingKey && (
              <p className="text-center mt-4 text-yellow-400 text-sm">
                Please wait while we generate your secure access key...
              </p>
            )}
            <button
              onClick={() => setShowKeyModal(false)}
              className="mt-4 text-gray-400 hover:text-white text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rest of your existing JSX remains exactly the same */}
      {/* [All original header, sections, cards, and footer code remains unchanged] */}
    </div>
  );
};

export default Index;
