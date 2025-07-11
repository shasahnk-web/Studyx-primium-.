
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, PlayCircle, FileText, BookOpen, Download, AlertCircle } from 'lucide-react';
import { getStorageData, addStorageListener } from '@/utils/localStorage';

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

interface Lecture {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  subject: string;
  topic?: string;
  batchId: string;
  createdAt: string;
}

interface Note {
  id: string;
  title: string;
  description?: string;
  pdfUrl: string;
  subject: string;
  batchId: string;
  createdAt: string;
}

interface DPP {
  id: string;
  title: string;
  description?: string;
  pdfUrl: string;
  subject: string;
  batchId: string;
  createdAt: string;
}

const BatchPage = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [dpps, setDPPs] = useState<DPP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBatchData();
    
    // Set up storage listener for real-time updates
    const removeListener = addStorageListener(() => {
      loadBatchData();
    });

    return removeListener;
  }, [batchId]);

  const loadBatchData = () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load batch data
      const allBatches = getStorageData<Batch>('batches');
      const currentBatch = allBatches.find((b: Batch) => b.id === batchId);
      
      if (!currentBatch) {
        setError('Batch not found');
        setBatch(null);
      } else {
        setBatch(currentBatch);
      }

      // Load lectures for this batch
      const allLectures = getStorageData<Lecture>('lectures');
      const batchLectures = allLectures.filter((lecture: Lecture) => lecture.batchId === batchId);
      setLectures(batchLectures);

      // Load notes for this batch
      const allNotes = getStorageData<Note>('notes');
      const batchNotes = allNotes.filter((note: Note) => note.batchId === batchId);
      setNotes(batchNotes);

      // Load DPPs for this batch
      const allDPPs = getStorageData<DPP>('dpps');
      const batchDPPs = allDPPs.filter((dpp: DPP) => dpp.batchId === batchId);
      setDPPs(batchDPPs);

    } catch (error) {
      console.error('Error loading batch data:', error);
      setError('Failed to load batch data. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLectureClick = (videoUrl: string) => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  const handleDownload = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading batch data...</p>
        </div>
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
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

        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="bg-gray-800 border-gray-700 max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
              <h2 className="text-xl font-bold mb-2 text-white">
                {error || 'Batch Not Found'}
              </h2>
              <p className="text-gray-400 mb-6">
                {error ? 'There was an error loading the batch data.' : 'The requested batch could not be found.'}
              </p>
              <Button onClick={() => navigate('/')} className="w-full">
                Return to Home
              </Button>
            </CardContent>
          </Card>
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
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
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

      {/* Batch Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {batch.image && (
              <img 
                src={batch.image} 
                alt={batch.name}
                className="w-full md:w-64 h-40 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 text-white">{batch.name}</h1>
              <p className="text-white/80 text-lg mb-4">{batch.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {batch.subjects.map((subject, index) => (
                  <span key={index} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {subject}
                  </span>
                ))}
              </div>
              <div className="text-sm text-white/70">
                <p>Duration: {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}</p>
                {batch.fee && <p>Fee: ₹{batch.fee}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="lectures" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="lectures" className="data-[state=active]:bg-gray-700 text-white">
                Lectures ({lectures.length})
              </TabsTrigger>
              <TabsTrigger value="notes" className="data-[state=active]:bg-gray-700 text-white">
                Notes ({notes.length})
              </TabsTrigger>
              <TabsTrigger value="dpps" className="data-[state=active]:bg-gray-700 text-white">
                DPPs ({dpps.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lectures" className="mt-6">
              {lectures.length === 0 ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <PlayCircle className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No lectures available yet.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Lectures will appear here once they are added by the admin.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {lectures.map((lecture) => (
                    <Card key={lecture.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <PlayCircle className="w-8 h-8 text-blue-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white truncate">{lecture.title}</h3>
                              <div className="text-sm text-gray-400">
                                <span>{lecture.subject}</span>
                                {lecture.topic && <span> • {lecture.topic}</span>}
                              </div>
                              {lecture.description && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{lecture.description}</p>
                              )}
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleLectureClick(lecture.videoUrl)}
                            className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 ml-4"
                            disabled={!lecture.videoUrl}
                          >
                            Watch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              {notes.length === 0 ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No notes available yet.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Notes will appear here once they are added by the admin.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {notes.map((note) => (
                    <Card key={note.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <BookOpen className="w-8 h-8 text-green-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white truncate">{note.title}</h3>
                              <p className="text-sm text-gray-400">{note.subject} • PDF Notes</p>
                              {note.description && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{note.description}</p>
                              )}
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleDownload(note.pdfUrl)}
                            className="bg-green-600 hover:bg-green-700 flex-shrink-0 ml-4"
                            disabled={!note.pdfUrl}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="dpps" className="mt-6">
              {dpps.length === 0 ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <FileText className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No DPPs available yet.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Daily Practice Problems will appear here once they are added by the admin.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {dpps.map((dpp) => (
                    <Card key={dpp.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <FileText className="w-8 h-8 text-orange-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white truncate">{dpp.title}</h3>
                              <p className="text-sm text-gray-400">{dpp.subject} • Daily Practice Problems</p>
                              {dpp.description && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{dpp.description}</p>
                              )}
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleDownload(dpp.pdfUrl)}
                            className="bg-orange-600 hover:bg-orange-700 flex-shrink-0 ml-4"
                            disabled={!dpp.pdfUrl}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default BatchPage;
