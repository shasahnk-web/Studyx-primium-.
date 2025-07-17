import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Users, Clock, Settings, Download, Video, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchBatches, fetchNotes, fetchDPPs, type Batch, type Note, type DPP } from '@/services/supabaseService';

const AccessKeyPage = ({ onAccessGranted }: { onAccessGranted: () => void }) => {
  useEffect(() => {
    /* Particles.js Configuration */
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = () => {
      (window as any).particlesJS("particles-js", {
        particles: {
          number: { value: 100, density: { enable: true, value_area: 800 } },
          color: { value: "#00bcd4" },
          shape: { type: "circle" },
          opacity: { value: 0.5, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
          size: { value: 2.5, random: true },
          line_linked: { enable: true, distance: 140, color: "#00bcd4", opacity: 0.3, width: 1 },
          move: { enable: true, speed: 1.5, out_mode: "out" }
        },
        interactivity: {
          detect_on: "canvas",
          events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
          modes: { grab: { distance: 120, line_linked: { opacity: 1 } } }
        },
        retina_detect: true
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const urls = {
    server02: 'https://shortner.in/0b3Q',
    server03: 'https://shortner.in/0b3Q',
    recommendServer: 'https://shortner.in/0b3Q',
  };

  const setTemporaryCookieAndRedirect = (cookieName: string, url: string) => {
    if (!url) return alert('Invalid URL!');
    const loadingMessage = document.getElementById("loadingMessage");
    if (loadingMessage) loadingMessage.style.display = "block";
    
    setTimeout(() => {
      document.cookie = `${cookieName}=true; path=/; max-age=${24 * 61 * 60}`;
      onAccessGranted();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900">
      <div id="particles-js" className="absolute inset-0"></div>
      <div className="container mx-auto flex items-center justify-center h-full">
        <div className="bg-gray-800 bg-opacity-70 rounded-xl p-8 max-w-md w-full backdrop-blur-sm border border-cyan-500 border-opacity-30 shadow-lg shadow-cyan-500/10">
          <h2 className="text-2xl font-bold text-center mb-4 text-cyan-400">Generate Your Access Key</h2>
          <p className="text-gray-300 text-center mb-6">
            Click the button below to generate your key.<br /><br />Validity: 30 hours ⏰
          </p>
          <button 
            onClick={() => setTemporaryCookieAndRedirect('server02KeyGenerated', urls.server02)}
            className="w-full bg-transparent hover:bg-cyan-600 text-white font-medium py-2 px-4 border border-cyan-500 rounded-lg transition duration-300 mb-3"
          >
            Website Server - 1
          </button>
          <button 
            onClick={() => setTemporaryCookieAndRedirect('server03KeyGenerated', urls.server03)}
            className="w-full bg-transparent hover:bg-cyan-600 text-white font-medium py-2 px-4 border border-cyan-500 rounded-lg transition duration-300 mb-3"
          >
            Website Server - 2
          </button>
          <button 
            onClick={() => setTemporaryCookieAndRedirect('recommendServerKeyGenerated', urls.recommendServer)}
            className="w-full bg-transparent hover:bg-cyan-600 text-white font-medium py-2 px-4 border border-cyan-500 rounded-lg transition duration-300 mb-3"
          >
            Website Server - 3
          </button>
          <button 
            onClick={() => window.open('https://example.com/tutorial', '_blank')}
            className="w-full bg-transparent hover:bg-cyan-600 text-white font-medium py-2 px-4 border border-cyan-500 rounded-lg transition duration-300 mb-6"
          >
            TUTORIAL VIDEO [EASY METHOD]
          </button>
          <p className="text-gray-400 text-sm text-center mb-2">
            Please do <strong className="text-yellow-400">Watch TUTORIAL Video FIRST</strong>, so that you not face any Problem.
          </p>
          <p className="text-yellow-400 text-sm text-center hidden" id="loadingMessage">
            Generating URL, please wait...
          </p>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [dpps, setDPPs] = useState<DPP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    // Check if access was already granted (cookie exists)
    const cookies = document.cookie.split(';').some(cookie => 
      cookie.trim().startsWith('server02KeyGenerated=') || 
      cookie.trim().startsWith('server03KeyGenerated=') || 
      cookie.trim().startsWith('recommendServerKeyGenerated=')
    );
    
    if (cookies) {
      setAccessGranted(true);
    }
    
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

  const courses = [
    {
      id: 'pw-courses',
      title: 'PW Courses',
      subtitle: 'Physics Wallah Integration',
      description: 'Padhlo chahe kahin se, Manzil milegi yahi se!',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
      gradient: 'from-green-400 to-green-600',
      icon: '🔬',
      badge: 'PW'
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

  if (!accessGranted) {
    return <AccessKeyPage onAccessGranted={() => setAccessGranted(true)} />;
  }

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
      {/* Rest of your existing Index component */}
      {/* ... */}
    </div>
  );
};

export default Index;
