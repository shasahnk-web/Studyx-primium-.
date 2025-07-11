
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Users, Clock, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

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
    { number: '500+', label: 'Video Lectures', icon: BookOpen, color: 'text-blue-400' },
    { number: '1000+', label: 'Practice Questions', icon: Users, color: 'text-purple-400' },
    { number: '24/7', label: 'Expert Support', icon: Clock, color: 'text-green-400' }
  ];

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-bold">StudyX</span>
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
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Study Smart with StudyX
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Comprehensive learning modules designed for academic excellence
        </p>
      </section>

      {/* Courses Section */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Our Courses</h2>
          <p className="text-gray-400 text-center mb-12">
            Choose from our comprehensive learning programs
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card 
                key={course.id}
                className={`bg-gradient-to-br ${course.gradient} border-0 cursor-pointer transform hover:scale-105 transition-all duration-300`}
                onClick={() => handleCourseClick(course.id)}
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
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                  <h3 className="text-3xl font-bold mb-2">{stat.number}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold">StudyX</span>
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
              © 2024 StudyX. All rights reserved. Made with ❤️ for students in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
