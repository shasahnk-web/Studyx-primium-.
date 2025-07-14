import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Users, Clock, Settings, Download, Video, ExternalLink, Trophy, Star, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchBatches, fetchNotes, fetchDPPs, type Batch, type Note, type DPP } from '@/services/supabaseService';

const Index = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [dpps, setDPPs] = useState<DPP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      
      console.log('🔄 Loading all data from Supabase...');
      
      // Load all data in parallel
      const [batchesData, notesData, dppsData] = await Promise.all([
        fetchBatches(),
        fetchNotes(),
        fetchDPPs()
      ]);
      
      console.log('📊 Data loaded:', {
        batches: batchesData.length,
        notes: notesData.length,
        dpps: dppsData.length
      });

      setBatches(batchesData);
      setNotes(notesData);
      setDPPs(dppsData);
    } catch (error) {
      console.error('❌ Error loading data:', error);
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
      window.open(course.link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  const handleNextTopperClick = () => {
    window.open('https://studyverse-network.netlify.app/', '_blank', 'noopener,noreferrer');
  };

  const handleOpenLivePlayer = () => {
    window.open('https://bhanuyadav.xyz/kgprojects/liveplayer/activelive.php', '_blank', 'noopener,noreferrer');
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
      {/* Header with StudyX Premium Logo */}
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

      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
          Study Smart with StudyX Premium
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Comprehensive learning modules designed for academic excellence
        </p>
      </section>

      {/* Quick Stats */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
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

      {/* Recent Study Materials Section */}
      {(notes.length > 0 || dpps.length > 0) && (
        <section className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Your Study Materials</h2>
            
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-white">Recent Materials</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {notes.slice(0, 3).map((note) => (
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
                {dpps.slice(0, 3).map((dpp) => (
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

      {/* Courses Section with Next Topper */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">Our Courses</h2>
          <p className="text-gray-400 text-center mb-12">
            Choose from our comprehensive learning programs
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card 
                key={course.id}
                className={`bg-gradient-to-br ${course.gradient} border-0 cursor-pointer transform hover:scale-105 transition-all duration-300`}
                onClick={() => handleCourseClick(course)}
              >
                <CardContent className="p-6 text-white relative">
                  <div className="absolute top-4 right-4">
                    <span className="bg-white text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                      {course.badge}
                    </span>
                    {course.isBeta && (
                      <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold ml-1">
                        Beta
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-3xl mb-2">{course.icon}</div>
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

                  <Button className="w-full bg-white text-gray-900 hover:bg-gray-100">
                    {course.id === 'pw-tests' ? 'Start Practice' : 'Start Learning'}
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Next Topper Card */}
            <Card 
              className="bg-gradient-to-br from-yellow-900/30 via-orange-800/20 to-red-900/30 border-yellow-500/50 hover:border-yellow-400/70 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={handleNextTopperClick}
            >
              <CardContent className="p-6 text-white relative">
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                    Premium
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="text-3xl mb-2">🏆</div>
                  <h3 className="text-2xl font-bold mb-1">Next Topper</h3>
                  <p className="text-white/80 text-sm mb-3">Success Network</p>
                  <p className="text-white/70 text-sm mb-4">Join the community of achievers and be the next success story</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-white/20 px-2 py-1 rounded text-xs">Top Performers</span>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs">Expert Guidance</span>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs">Success Stories</span>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs">Mentorship</span>
                </div>

                <Button className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                  <Trophy className="w-4 h-4 mr-2" />
                  Explore Network
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Player Section */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-white flex items-center justify-center">
              <Video className="w-8 h-8 mr-3 text-red-500" />
              Live Player
            </h2>
            <p className="text-gray-400 text-lg">
              Watch live lectures and interactive sessions
            </p>
          </div>

          <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Live Session</span>
                </h3>
                <Button 
                  onClick={handleOpenLivePlayer}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-2">
                <iframe
                  src="https://bhanuyadav.xyz/kgprojects/liveplayer/activelive.php"
                  title="Live Lectures Player"
                  className="w-full h-96 rounded-lg border-0"
                  allow="fullscreen"
                  loading="lazy"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/lovable-uploads/dcac7197-2a19-41d1-9f13-20ca958e4750.png" 
                  alt="StudyX Premium" 
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-gray-400 text-sm">
                Empowering students with quality education and comprehensive study materials for academic excellence.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-blue-400">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Batches</a></li>
                <li><a href="#" className="hover:text-white">Resources</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-purple-400">Popular Subjects</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Physics</a></li>
                <li><a href="#" className="hover:text-white">Chemistry</a></li>
                <li><a href="#" className="hover:text-white">Mathematics</a></li>
                <li><a href="#" className="hover:text-white">Biology</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-green-400">Contact Info</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: support@studyx.com</li>
                <li>Phone: +91 98765 43210</li>
                <li>Address: Mumbai, India</li>
                <li>Hours: 24/7 Support</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 StudyX Premium. All rights reserved. Made with ❤️ for students in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
