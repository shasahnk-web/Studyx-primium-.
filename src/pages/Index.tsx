import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Users, Clock, Settings, Download, Video, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Batch {
  id: string;
  name: string;
}

interface Note {
  id: string;
  title: string;
  subject: string;
  batch_id?: string;
  pdf_url: string;
}

interface DPP {
  id: string;
  title: string;
  subject: string;
  batch_id?: string;
  pdf_url: string;
}

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  subjects: string[];
  gradient: string;
  icon: string;
  badge: string;
  requiresKey?: boolean;
  isBeta?: boolean;
  link?: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [dpps, setDPPs] = useState<DPP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [loadingKey, setLoadingKey] = useState(false);
  const [hasValidKey, setHasValidKey] = useState(false);
  const [keyGenerationStarted, setKeyGenerationStarted] = useState(false);

  // Strict key verification
  useEffect(() => {
    const verifyKey = () => {
      const keyData = localStorage.getItem('pwCourseAccess');
      if (!keyData) {
        setHasValidKey(false);
        return false;
      }
      
      try {
        const { timestamp, verified } = JSON.parse(keyData);
        const now = new Date().getTime();
        const isValid = verified && (now - timestamp < 24 * 60 * 60 * 1000);
        setHasValidKey(isValid);
        return isValid;
      } catch {
        setHasValidKey(false);
        return false;
      }
    };

    verifyKey();
    loadAllData();
  }, []);

  // Block unauthorized access
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.location.pathname.includes('/courses/pw-courses') && !hasValidKey) {
        navigate('/');
        setShowKeyModal(true);
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [hasValidKey, navigate]);

  const fetchBatches = async (): Promise<Batch[]> => {
    return [
      { id: '1', name: 'NEET Batch' },
      { id: '2', name: 'JEE Batch' }
    ];
  };

  const fetchNotes = async (): Promise<Note[]> => {
    return [
      { id: '1', title: 'Organic Chemistry Notes', subject: 'Chemistry', batch_id: '1', pdf_url: '#' },
      { id: '2', title: 'Electrodynamics Notes', subject: 'Physics', batch_id: '1', pdf_url: '#' }
    ];
  };

  const fetchDPPs = async (): Promise<DPP[]> => {
    return [
      { id: '1', title: 'Calculus DPP', subject: 'Mathematics', batch_id: '2', pdf_url: '#' },
      { id: '2', title: 'Genetics DPP', subject: 'Biology', batch_id: '2', pdf_url: '#' }
    ];
  };

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
    setKeyGenerationStarted(true);
    setLoadingKey(true);
    
    setTimeout(() => {
      localStorage.setItem('pwCourseAccess', JSON.stringify({
        timestamp: new Date().getTime(),
        verified: true
      }));
      
      setLoadingKey(false);
      setHasValidKey(true);
      setShowKeyModal(false);
      
      window.open('https://reel2earn.com/RNTky', '_blank');
      navigate('/courses/pw-courses');
    }, 2000);
  };

  const courses: Course[] = [
    {
      id: 'pw-courses',
      title: 'PW Courses',
      subtitle: 'Premium Video Lectures',
      description: 'Comprehensive courses for NEET/JEE preparation',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
      gradient: 'from-green-400 to-green-600',
      icon: '🎓',
      badge: 'PW',
      requiresKey: true
    },
    {
      id: 'pw-live-lectures', // Changed ID
      title: 'PW Live Lectures', // Changed title
      subtitle: 'Live Interactive Classes',
      description: 'Real-time learning with top educators',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
      gradient: 'from-blue-400 to-blue-600',
      icon: '📺',
      badge: 'Live',
      link: 'https://bhanuyadav.xyz/kgprojects/liveplayer/activelive.php'
    },
    {
      id: 'pw-test-series',
      title: 'Test Series',
      subtitle: 'Practice & Evaluation',
      description: 'Full-length tests with detailed analysis',
      subjects: ['NEET Mock', 'JEE Advanced', 'Chapter Tests'],
      gradient: 'from-purple-400 to-purple-600',
      icon: '📝',
      badge: 'New'
    },
    {
      id: 'pw-dpp',
      title: 'Daily Problems',
      subtitle: 'Practice Sheets',
      description: 'Daily practice problems with solutions',
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      gradient: 'from-orange-400 to-orange-600',
      icon: '✍️',
      badge: 'DPP'
    },
    {
      id: 'pw-notes',
      title: 'Study Notes',
      subtitle: 'Comprehensive Material',
      description: 'Well-organized subject notes',
      subjects: ['Short Notes', 'Formulas', 'Diagrams'],
      gradient: 'from-yellow-400 to-yellow-600',
      icon: '📚',
      badge: 'Premium'
    },
    {
      id: 'next-topper',
      title: 'Next Topper',
      subtitle: 'Success Network',
      description: 'Join our community of achievers',
      subjects: ['Mentorship', 'Strategies', 'Success Stories'],
      gradient: 'from-red-400 to-red-600',
      icon: '🏆',
      badge: 'Network',
      link: 'https://studyverse-network.netlify.app/'
    }
  ];

  const stats = [
    { number: `${batches.length}+`, label: 'Active Batches', icon: BookOpen, color: 'text-blue-400' },
    { number: `${notes.length + dpps.length}+`, label: 'Study Materials', icon: FileText, color: 'text-purple-400' },
    { number: '10,000+', label: 'Students', icon: Users, color: 'text-green-400' },
    { number: '24/7', label: 'Doubt Support', icon: Clock, color: 'text-orange-400' }
  ];

  const handleCourseClick = (course: Course) => {
    if (course.link) {
      window.location.href = course.link;
    } else if (course.requiresKey) {
      if (hasValidKey) {
        navigate('/courses/pw-courses');
      } else {
        setShowKeyModal(true);
      }
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  const getBatchName = (batchId: string): string => {
    const batch = batches.find(b => b.id === batchId);
    return batch ? batch.name : 'General Batch';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading StudyX Premium...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Strict Access Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border-2 border-red-500">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 text-red-400">Verification Required</h3>
              <div className="w-16 h-1 bg-red-500 mx-auto mb-4"></div>
              <p className="text-gray-300 mb-6">
                You must complete verification to access premium content.
                <br />
                <span className="text-yellow-400 font-medium">This process cannot be skipped.</span>
              </p>
              
              <Button
                onClick={generateKeyAndRedirect}
                disabled={loadingKey}
                className="bg-red-600 hover:bg-red-700 w-full py-6 text-lg font-bold"
              >
                {loadingKey ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Verify Now to Continue'
                )}
              </Button>
              
              {keyGenerationStarted && !hasValidKey && (
                <p className="text-red-400 font-medium mt-4 animate-pulse">
                  Please complete the verification process
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between p-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-40">
        <div className="flex items-center space-x-4">
          <img 
            src="/logo.png" 
            alt="StudyX Premium" 
            className="h-12 w-auto"
          />
          <div className="border-l border-gray-600 h-8"></div>
          <span className="text-xl font-bold text-gray-200">StudyX Premium</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/admin')}
          className="text-gray-400 hover:text-white hidden md:flex"
        >
          <Settings className="w-4 h-4 mr-2" />
          Admin
        </Button>
      </header>

      <section className="text-center py-16 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
          Study Smarter, Not Harder
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Comprehensive learning platform for NEET & JEE aspirants
        </p>
      </section>

      <section className="px-4 pb-8 -mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                <CardContent className="p-4 text-center">
                  <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                  <h3 className="text-2xl font-bold mb-1 text-white">{stat.number}</h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {(notes.length > 0 || dpps.length > 0) && (
        <section className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Your Study Materials</h2>
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-white">Recently Added</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {notes.slice(0, 2).map((note) => (
                  <Card key={note.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-8 h-8 text-blue-400" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{note.title}</h4>
                          <p className="text-sm text-gray-400">Notes • {note.subject} • {getBatchName(note.batch_id || '')}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => window.open(note.pdf_url, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {dpps.slice(0, 2).map((dpp) => (
                  <Card key={dpp.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-orange-400" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{dpp.title}</h4>
                          <p className="text-sm text-gray-400">DPP • {dpp.subject} • {getBatchName(dpp.batch_id || '')}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => window.open(dpp.pdf_url, '_blank')}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">Our Learning Programs</h2>
          <p className="text-gray-400 text-center mb-12">
            Choose from our comprehensive courses and resources
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card 
                key={course.id}
                className={`bg-gradient-to-br ${course.gradient} border-0 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 h-full`}
                onClick={() => handleCourseClick(course)}
              >
                <CardContent className="p-6 text-white relative h-full flex flex-col">
                  <div className="absolute top-4 right-4 flex space-x-1">
                    <span className="bg-white/90 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                      {course.badge}
                    </span>
                    {course.isBeta && (
                      <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                        Beta
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-4xl mb-3">{course.icon}</div>
                    <h3 className="text-2xl font-bold mb-1">{course.title}</h3>
                    <p className="text-white/80 text-sm mb-3">{course.subtitle}</p>
                    <p className="text-white/70 text-sm mb-4">{course.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {course.subjects.slice(0, 4).map((subject, index) => (
                      <span 
                        key={index}
                        className="bg-white/20 px-2 py-1 rounded text-xs"
                      >
                        {subject}
                      </span>
                    ))}
                    {course.subjects.length > 4 && (
                      <span className="bg-white/20 px-2 py-1 rounded text-xs">
                        +{course.subjects.length - 4} more
                      </span>
                    )}
                  </div>

                  <Button className="w-full bg-white/90 text-gray-900 hover:bg-white mt-auto">
                    {course.id === 'pw-test-series' ? 'Start Tests' : 
                     course.id === 'pw-live-lectures' ? 'Join Live' : // Updated reference
                     course.link ? 'Explore Now' : 'Start Learning'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/logo.png" 
                  alt="StudyX Premium" 
                  className="h-8 w-auto"
                />
                <span className="text-lg font-semibold">StudyX Premium</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering students with quality education and comprehensive study materials.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-blue-400">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/')} className="hover:text-white">Home</button></li>
                <li><button onClick={() => navigate('/materials')} className="hover:text-white">Study Materials</button></li>
                <li><button onClick={() => navigate('/batches')} className="hover:text-white">Batches</button></li>
                <li><button onClick={() => navigate('/tests')} className="hover:text-white">Test Series</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-purple-400">Subjects</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white">Physics</button></li>
                <li><button className="hover:text-white">Chemistry</button></li>
                <li><button className="hover:text-white">Mathematics</button></li>
                <li><button className="hover:text-white">Biology</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-green-400">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: support@studyx.com</li>
                <li>Phone: +91 XXXXX XXXXX</li>
                <li>Office Hours: 9AM - 6PM</li>
                <li>Doubt Support: 24/7</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} StudyX Premium. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
