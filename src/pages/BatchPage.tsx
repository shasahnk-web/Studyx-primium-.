import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, PlayCircle, FileText, BookOpen, Download, AlertCircle, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchBatches, 
  fetchLectures, 
  fetchNotes, 
  fetchDPPs,
  type Batch,
  type Lecture,
  type Note,
  type DPP 
} from '@/services/supabaseService';

interface LiveLecture {
  id: string;
  title: string;
  description?: string;
  liveUrl: string;
  subject: string;
  batchId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'upcoming' | 'live' | 'completed';
  createdAt: string;
}

const BatchPage = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [dpps, setDPPs] = useState<DPP[]>([]);
  const [liveLectures, setLiveLectures] = useState<LiveLecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBatchData();
  }, [batchId]);

  const loadBatchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!batchId) {
        setError('No batch ID provided');
        return;
      }

      // Load batch data
      const allBatches = await fetchBatches();
      const currentBatch = allBatches.find((b: Batch) => b.id === batchId);
      
      if (!currentBatch) {
        setError('Batch not found');
        setBatch(null);
        return;
      }

      setBatch(currentBatch);

      // Load content for this batch in parallel
      const [lecturesData, notesData, dppsData] = await Promise.all([
        fetchLectures(batchId),
        fetchNotes(batchId),
        fetchDPPs(batchId)
      ]);

      setLectures(lecturesData);
      setNotes(notesData);
      setDPPs(dppsData);
      setLiveLectures([]);

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
    } else {
      toast({
        title: "Error",
        description: "Video URL not available",
        variant: "destructive"
      });
    }
  };

  const handleDownload = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        title: "Error",
        description: "Download URL not available",
        variant: "destructive"
      });
    }
  };

  const handleLiveLectureClick = (liveUrl: string) => {
    if (liveUrl) {
      window.open(liveUrl, '_blank');
    } else {
      toast({
        title: "Error",
        description: "Live lecture URL not available",
        variant: "destructive"
      });
    }
  };

  const normalizeSubjectName = (subject: string) => {
    return subject.toLowerCase().trim();
  };

  const findMatchingBatchSubject = (lectureSubject: string, batchSubjects: string[] = []) => {
    const normalizedLectureSubject = normalizeSubjectName(lectureSubject);
    
    // Direct match first
    const directMatch = batchSubjects.find(batchSubject => 
      normalizeSubjectName(batchSubject) === normalizedLectureSubject
    );
    
    if (directMatch) return directMatch;
    
    // Partial match for common variations
    const partialMatch = batchSubjects.find(batchSubject => {
      const normalizedBatchSubject = normalizeSubjectName(batchSubject);
      return normalizedBatchSubject.includes(normalizedLectureSubject) || 
             normalizedLectureSubject.includes(normalizedBatchSubject);
    });
    
    if (partialMatch) return partialMatch;
    
    // Subject mapping for common variations
    const subjectMappings: Record<string, string[]> = {
      'mathematics': ['maths', 'math'],
      'maths': ['mathematics', 'math'],
      'physics': ['phy'],
      'chemistry': ['chem'],
      'biology': ['bio'],
      'english': ['eng'],
      'hindi': ['hin'],
      'social science': ['sst', 'social studies'],
      'sst': ['social science', 'social studies'],
      'information technology': ['it', 'computer'],
      'it': ['information technology', 'computer'],
      'business studies': ['business', 'bst', 'business studies'],
      'economics': ['eco', 'economy'],
      'hindi elective': ['hindi elect', 'hindi-elective', 'hindi elec'],
      'hindi core': ['hindi', 'hindi-c', 'hindi core'],
      'applied maths': ['applied math', 'applied mathematics', 'app maths']
    };
    
    for (const batchSubject of batchSubjects) {
      const normalizedBatchSubject = normalizeSubjectName(batchSubject);
      
      // Check if batch subject maps to lecture subject
      const mappings = subjectMappings[normalizedBatchSubject] || [];
      if (mappings.includes(normalizedLectureSubject)) {
        return batchSubject;
      }
      
      // Check reverse mapping
      for (const [key, values] of Object.entries(subjectMappings)) {
        if (values.includes(normalizedBatchSubject) && key === normalizedLectureSubject) {
          return batchSubject;
        }
      }
    }
    
    return lectureSubject;
  };

  const getContentBySubject = (subject: string) => {
    const subjectLectures = lectures.filter(item => {
      const matchingSubject = findMatchingBatchSubject(item.subject || '', batch?.subjects);
      return matchingSubject === subject;
    });
    
    const subjectNotes = notes.filter(item => {
      const matchingSubject = findMatchingBatchSubject(item.subject || '', batch?.subjects);
      return matchingSubject === subject;
    });
    
    const subjectDpps = dpps.filter(item => {
      const matchingSubject = findMatchingBatchSubject(item.subject || '', batch?.subjects);
      return matchingSubject === subject;
    });
    
    const subjectLiveLectures = liveLectures.filter(item => {
      const matchingSubject = findMatchingBatchSubject(item.subject, batch?.subjects);
      return matchingSubject === subject;
    });

    return {
      lectures: subjectLectures,
      notes: subjectNotes,
      dpps: subjectDpps,
      liveLectures: subjectLiveLectures
    };
  };

  const renderContentSection = (
    title: string,
    items: Array<{ id: string; title: string; description?: string; topic?: string; scheduledDate?: string; scheduledTime?: string; status?: string; video_url?: string; pdf_url?: string; liveUrl?: string }>,
    icon: React.ReactNode,
    emptyMessage: string,
    onItemClick: (url: string) => void,
    urlKey: 'video_url' | 'pdf_url' | 'liveUrl'
  ) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto text-gray-600 mb-4">{icon}</div>
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-8 h-8 text-blue-400 flex-shrink-0">{icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    )}
                    {item.topic && (
                      <p className="text-sm text-gray-400">Topic: {item.topic}</p>
                    )}
                    {item.scheduledDate && item.scheduledTime && (
                      <p className="text-sm text-gray-400">
                        Scheduled: {new Date(item.scheduledDate).toLocaleDateString()} at {item.scheduledTime}
                      </p>
                    )}
                    {item.status && (
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        item.status === 'live' ? 'bg-red-100 text-red-800' :
                        item.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
                <Button 
                  onClick={() => onItemClick(item[urlKey] as string)}
                  className={`flex-shrink-0 ml-4 ${
                    title === 'Live Lectures' ? 'bg-red-600 hover:bg-red-700' :
                    title === 'Lectures' ? 'bg-blue-600 hover:bg-blue-700' :
                    title === 'Notes' ? 'bg-green-600 hover:bg-green-700' :
                    'bg-orange-600 hover:bg-orange-700'
                  }`}
                  disabled={!item[urlKey]}
                >
                  {title === 'Lectures' || title === 'Live Lectures' ? 'Watch' : 
                   title === 'Notes' || title === 'DPP' ? (
                     <>
                       <Download className="w-4 h-4 mr-2" />
                       Download
                     </>
                   ) : 'Access'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
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
                alt="Study Pro Max Premium" 
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
              alt="Study Pro Max Premium" 
              className="h-8 w-auto"
            />
          </div>
        </div>
      </header>

      {/* Batch Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {batch.image_url && (
              <img 
                src={batch.image_url} 
                alt={batch.name}
                className="w-full md:w-64 h-40 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 text-white">{batch.name}</h1>
              <p className="text-white/80 text-lg mb-4">{batch.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {(batch.subjects || []).map((subject, index) => (
                  <span key={index} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {subject}
                  </span>
                ))}
              </div>
              <div className="text-sm text-white/70">
                {batch.start_date && batch.end_date && (
                  <p>Duration: {new Date(batch.start_date).toLocaleDateString()} - {new Date(batch.end_date).toLocaleDateString()}</p>
                )}
                {batch.fee && <p>Fee: ₹{batch.fee}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-white">Subjects</h2>
          
          {!batch.subjects || batch.subjects.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No subjects available for this batch.</p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {batch.subjects.map((subject) => {
                const subjectContent = getContentBySubject(subject);
                const totalContent = subjectContent.lectures.length + 
                                   subjectContent.notes.length + 
                                   subjectContent.dpps.length + 
                                   subjectContent.liveLectures.length;

                return (
                  <AccordionItem key={subject} value={subject} className="bg-gray-800 border-gray-700 rounded-lg">
                    <AccordionTrigger className="px-6 py-4 text-white hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <span className="text-lg font-semibold">{subject}</span>
                        <span className="text-sm text-gray-400">
                          {totalContent} items
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <Tabs defaultValue="lectures" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 bg-gray-700">
                          <TabsTrigger value="lectures" className="data-[state=active]:bg-gray-600 text-white">
                            Lectures ({subjectContent.lectures.length})
                          </TabsTrigger>
                          <TabsTrigger value="notes" className="data-[state=active]:bg-gray-600 text-white">
                            Notes ({subjectContent.notes.length})
                          </TabsTrigger>
                          <TabsTrigger value="dpps" className="data-[state=active]:bg-gray-600 text-white">
                            DPP ({subjectContent.dpps.length})
                          </TabsTrigger>
                          <TabsTrigger value="live" className="data-[state=active]:bg-gray-600 text-white">
                            Live ({subjectContent.liveLectures.length})
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="lectures" className="mt-6">
                          {renderContentSection(
                            'Lectures',
                            subjectContent.lectures,
                            <PlayCircle className="w-8 h-8" />,
                            'No lectures available for this subject.',
                            handleLectureClick,
                            'video_url'
                          )}
                        </TabsContent>

                        <TabsContent value="notes" className="mt-6">
                          {renderContentSection(
                            'Notes',
                            subjectContent.notes,
                            <BookOpen className="w-8 h-8" />,
                            'No notes available for this subject.',
                            handleDownload,
                            'pdf_url'
                          )}
                        </TabsContent>

                        <TabsContent value="dpps" className="mt-6">
                          {renderContentSection(
                            'DPP',
                            subjectContent.dpps,
                            <FileText className="w-8 h-8" />,
                            'No DPPs available for this subject.',
                            handleDownload,
                            'pdf_url'
                          )}
                        </TabsContent>

                        <TabsContent value="live" className="mt-6">
                          {renderContentSection(
                            'Live Lectures',
                            subjectContent.liveLectures,
                            <Video className="w-8 h-8" />,
                            'No live lectures scheduled for this subject.',
                            handleLiveLectureClick,
                            'liveUrl'
                          )}
                        </TabsContent>
                      </Tabs>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </section>
    </div>
  );
};

export default BatchPage;
