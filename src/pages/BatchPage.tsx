
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, PlayCircle, FileText, BookOpen, Download } from 'lucide-react';

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
  videoLink: string;
  batchId: string;
}

interface Note {
  id: string;
  title: string;
  pdfLink: string;
  batchId: string;
}

interface DPP {
  id: string;
  title: string;
  pdfLink: string;
  batchId: string;
}

const BatchPage = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [dpps, setDPPs] = useState<DPP[]>([]);

  useEffect(() => {
    // Load batch data
    const savedBatches = localStorage.getItem('studyx_batches');
    if (savedBatches) {
      const allBatches = JSON.parse(savedBatches);
      const currentBatch = allBatches.find((b: Batch) => b.id === batchId);
      setBatch(currentBatch);
    }

    // Load lectures
    const savedLectures = localStorage.getItem('studyx_lectures');
    if (savedLectures) {
      const allLectures = JSON.parse(savedLectures);
      const batchLectures = allLectures.filter((lecture: Lecture) => lecture.batchId === batchId);
      setLectures(batchLectures);
    }

    // Load notes
    const savedNotes = localStorage.getItem('studyx_notes');
    if (savedNotes) {
      const allNotes = JSON.parse(savedNotes);
      const batchNotes = allNotes.filter((note: Note) => note.batchId === batchId);
      setNotes(batchNotes);
    }

    // Load DPPs
    const savedDPPs = localStorage.getItem('studyx_dpps');
    if (savedDPPs) {
      const allDPPs = JSON.parse(savedDPPs);
      const batchDPPs = allDPPs.filter((dpp: DPP) => dpp.batchId === batchId);
      setDPPs(batchDPPs);
    }
  }, [batchId]);

  if (!batch) {
    return <div>Batch not found</div>;
  }

  const handleLectureClick = (videoLink: string) => {
    window.open(videoLink, '_blank');
  };

  const handleDownload = (link: string) => {
    window.open(link, '_blank');
  };

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
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold">StudyX</span>
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
              <h1 className="text-4xl font-bold mb-2">{batch.name}</h1>
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
              <TabsTrigger value="lectures" className="data-[state=active]:bg-gray-700">
                Lectures ({lectures.length})
              </TabsTrigger>
              <TabsTrigger value="notes" className="data-[state=active]:bg-gray-700">
                Notes ({notes.length})
              </TabsTrigger>
              <TabsTrigger value="dpps" className="data-[state=active]:bg-gray-700">
                DPPs ({dpps.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lectures" className="mt-6">
              {lectures.length === 0 ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <PlayCircle className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No lectures available yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {lectures.map((lecture) => (
                    <Card key={lecture.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <PlayCircle className="w-8 h-8 text-blue-400" />
                            <div>
                              <h3 className="font-semibold">{lecture.title}</h3>
                              <p className="text-sm text-gray-400">Video Lecture</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleLectureClick(lecture.videoLink)}
                            className="bg-blue-600 hover:bg-blue-700"
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
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {notes.map((note) => (
                    <Card key={note.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <BookOpen className="w-8 h-8 text-green-400" />
                            <div>
                              <h3 className="font-semibold">{note.title}</h3>
                              <p className="text-sm text-gray-400">PDF Notes</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleDownload(note.pdfLink)}
                            className="bg-green-600 hover:bg-green-700"
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
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {dpps.map((dpp) => (
                    <Card key={dpp.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-8 h-8 text-orange-400" />
                            <div>
                              <h3 className="font-semibold">{dpp.title}</h3>
                              <p className="text-sm text-gray-400">Daily Practice Problems</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleDownload(dpp.pdfLink)}
                            className="bg-orange-600 hover:bg-orange-700"
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
