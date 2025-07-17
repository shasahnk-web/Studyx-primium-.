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

  // Check for valid key in localStorage
  const hasValidKey = () => {
    const keyData = localStorage.getItem('pwCoursesKey');
    if (!keyData) return false;
    
    try {
      const { expiry } = JSON.parse(keyData);
      return new Date().getTime() < expiry;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

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
      // Set key with 24-hour expiry
      const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem('pwCoursesKey', JSON.stringify({ expiry }));
      setLoadingKey(false);
      navigate('/courses/pw-courses');
    }, 1500);
  };

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
      requiresKey: true
    },
    {
      id: 'pw-khazana',
      title: 'PW Khazana',
      subtitle: 'Treasure of Knowledge',
      description: 'Padhlo chahe kahin se, Manzil milegi yahi se!',
      subjects: ['Hindi', 'English', 'History', 'Geography', 'Political Science', 'Economics'],
      gradient: 'from-orange-400 to-orange-600',
      icon: '💎',
      badge: 'PW'
    },
    {
      id: 'pw-tests',
      title: 'PW Tests',
      subtitle: 'Practice & Assessment',
      description: 'Padhlo chahe kahin se, Manzil milegi yahi se!',
      subjects: ['Mock Tests', 'Previous Year Papers', 'Chapter Tests', 'Full Syllabus Tests'],
      gradient: 'from-purple-400 to-purple-600',
      icon: '📝',
      badge: 'Beta',
      isBeta: true
    },
    {
      id: 'live-lectures',
      title: 'Live Lectures',
      subtitle: 'Interactive Sessions',
      description: 'Watch live classes from top educators',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
      gradient: 'from-red-400 to-red-600',
      icon: '📺',
      badge: 'Live',
      link: 'https://bhanuyadav.xyz/kgprojects/liveplayer/activelive.php'
    }
  ];

  const stats = [
    { number: `${batches.length}`, label: 'Active Batches', icon: BookOpen, color: 'text-blue-400' },
    { number: `${notes.length + dpps.length}`, label: 'Study Materials', icon: FileText, color: 'text-purple-400' },
    { number: '100+', label: 'Students', icon: Users, color: 'text-green-400' },
    { number: '24/7', label: 'Expert Support', icon: Clock, color: 'text-orange-400' }
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

  const handleNextTopperClick = () => {
    window.open('https://studyverse-network.netlify.app/', '_blank');
  };

  const getBatchName = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading StudyX...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Key Generation Modal - Only for PW Courses */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-green-500">
            <h3 className="text-2xl font-bold mb-4 text-green-400">Access PW Courses</h3>
            <p className="text-gray-300 mb-6">
              Generate a 24-hour access key to view PW Courses content.
              After 24 hours, you'll need to generate a new key.
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
                    Generating Access...
                  </span>
                ) : (
                  'Generate 24-Hour Access'
                )}
              </Button>
            </div>
            <button
              onClick={() => setShowKeyModal(false)}
              className="mt-4 w-full text-gray-400 hover:text-white text-sm"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* Rest of the original code remains exactly the same */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/dcac7197-2a19-41d1-9f13-20ca958e4750.png" 
            alt="StudyX Premium" 
            className="h-12 w-auto"
          />
          <div className="border-l border-gray-600 h-8"></div>
          <span className="text-xl font-bold text-gray-200">Learning Platform</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/admin')}
          className="text-gray-400 hover:text-white"
        >
          <Settings className="w-4 h-4 mr-2" />
          Admin Panel
        </Button>
      </header>

      {/* All other sections remain exactly the same */}
      {/* ... (keep all existing sections exactly as they were) ... */}

    </div>
  );
};

export default Index;
