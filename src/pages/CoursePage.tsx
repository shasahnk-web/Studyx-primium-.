
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Users, DollarSign, PlayCircle } from 'lucide-react';

interface Batch {
  id: string;
  name: string;
  description: string;
  subjects: string[];
  image?: string;
  startDate: string;
  endDate: string;
  fee?: string;
  courseId: string;
}

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[]>([]);

  const courseInfo = {
    'pw-courses': {
      title: 'PW Courses',
      subtitle: 'Physics Wallah Integration',
      gradient: 'from-green-400 to-green-600',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology']
    },
    'pw-khazana': {
      title: 'PW Khazana',
      subtitle: 'Treasure of Knowledge',
      gradient: 'from-orange-400 to-orange-600',
      subjects: ['Hindi', 'English', 'History', 'Geography', 'Political Science', 'Economics']
    },
    'pw-tests': {
      title: 'PW Tests',
      subtitle: 'Practice & Assessment',
      gradient: 'from-purple-400 to-purple-600',
      subjects: ['Mock Tests', 'Previous Year Papers', 'Chapter Tests', 'Full Syllabus Tests']
    }
  };

  const currentCourse = courseInfo[courseId as keyof typeof courseInfo];

  useEffect(() => {
    // Load batches from localStorage
    const savedBatches = localStorage.getItem('studyx_batches');
    if (savedBatches) {
      const allBatches = JSON.parse(savedBatches);
      const courseBatches = allBatches.filter((batch: Batch) => batch.courseId === courseId);
      setBatches(courseBatches);
    }
  }, [courseId]);

  if (!currentCourse) {
    return <div>Course not found</div>;
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
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold">StudyX</span>
          </div>
        </div>
      </header>

      {/* Course Hero */}
      <section className={`bg-gradient-to-br ${currentCourse.gradient} p-8`}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{currentCourse.title}</h1>
          <p className="text-white/80 text-lg mb-4">{currentCourse.subtitle}</p>
          <div className="flex flex-wrap gap-2">
            {currentCourse.subjects.map((subject, index) => (
              <Badge key={index} variant="secondary" className="bg-white/20 text-white">
                {subject}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Batches Section */}
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Available Batches</h2>
          
          {batches.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                <p className="text-gray-400 mb-4">No batches available for this course yet.</p>
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
                    {batch.image && (
                      <img 
                        src={batch.image} 
                        alt={batch.name}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-bold">{batch.name}</h3>
                    <p className="text-gray-400 text-sm">{batch.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                      </div>
                      {batch.fee && (
                        <div className="flex items-center text-sm text-gray-400">
                          <DollarSign className="w-4 h-4 mr-2" />
                          ₹{batch.fee}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {batch.subjects.map((subject, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => navigate(`/batch/${batch.id}`)}
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      View Batch
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

export default CoursePage;
