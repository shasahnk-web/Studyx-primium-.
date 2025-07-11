
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Video, BookOpen, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Batch {
  id: string;
  name: string;
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

interface ContentManagerProps {
  onUpdate: () => void;
}

const ContentManager = ({ onUpdate }: ContentManagerProps) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [dpps, setDPPs] = useState<DPP[]>([]);
  
  const [isLectureDialogOpen, setIsLectureDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isDPPDialogOpen, setIsDPPDialogOpen] = useState(false);

  const [lectureForm, setLectureForm] = useState({
    title: '',
    videoLink: '',
    batchId: ''
  });

  const [noteForm, setNoteForm] = useState({
    title: '',
    pdfLink: '',
    batchId: ''
  });

  const [dppForm, setDPPForm] = useState({
    title: '',
    pdfLink: '',
    batchId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedBatches = localStorage.getItem('studyx_batches');
    const savedLectures = localStorage.getItem('studyx_lectures');
    const savedNotes = localStorage.getItem('studyx_notes');
    const savedDPPs = localStorage.getItem('studyx_dpps');

    if (savedBatches) setBatches(JSON.parse(savedBatches));
    if (savedLectures) setLectures(JSON.parse(savedLectures));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedDPPs) setDPPs(JSON.parse(savedDPPs));
  };

  const handleAddLecture = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lectureForm.title || !lectureForm.videoLink || !lectureForm.batchId) {
      toast.error('Please fill in all fields');
      return;
    }

    const newLecture: Lecture = {
      id: Date.now().toString(),
      ...lectureForm
    };

    const updatedLectures = [...lectures, newLecture];
    localStorage.setItem('studyx_lectures', JSON.stringify(updatedLectures));
    setLectures(updatedLectures);
    onUpdate();
    
    setLectureForm({ title: '', videoLink: '', batchId: '' });
    setIsLectureDialogOpen(false);
    toast.success('Lecture added successfully');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!noteForm.title || !noteForm.pdfLink || !noteForm.batchId) {
      toast.error('Please fill in all fields');
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      ...noteForm
    };

    const updatedNotes = [...notes, newNote];
    localStorage.setItem('studyx_notes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
    onUpdate();
    
    setNoteForm({ title: '', pdfLink: '', batchId: '' });
    setIsNoteDialogOpen(false);
    toast.success('Note added successfully');
  };

  const handleAddDPP = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dppForm.title || !dppForm.pdfLink || !dppForm.batchId) {
      toast.error('Please fill in all fields');
      return;
    }

    const newDPP: DPP = {
      id: Date.now().toString(),
      ...dppForm
    };

    const updatedDPPs = [...dpps, newDPP];
    localStorage.setItem('studyx_dpps', JSON.stringify(updatedDPPs));
    setDPPs(updatedDPPs);
    onUpdate();
    
    setDPPForm({ title: '', pdfLink: '', batchId: '' });
    setIsDPPDialogOpen(false);
    toast.success('DPP added successfully');
  };

  const handleDeleteLecture = (lectureId: string) => {
    if (confirm('Are you sure you want to delete this lecture?')) {
      const updatedLectures = lectures.filter(l => l.id !== lectureId);
      localStorage.setItem('studyx_lectures', JSON.stringify(updatedLectures));
      setLectures(updatedLectures);
      onUpdate();
      toast.success('Lecture deleted successfully');
    }
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter(n => n.id !== noteId);
      localStorage.setItem('studyx_notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      onUpdate();
      toast.success('Note deleted successfully');
    }
  };

  const handleDeleteDPP = (dppId: string) => {
    if (confirm('Are you sure you want to delete this DPP?')) {
      const updatedDPPs = dpps.filter(d => d.id !== dppId);
      localStorage.setItem('studyx_dpps', JSON.stringify(updatedDPPs));
      setDPPs(updatedDPPs);
      onUpdate();
      toast.success('DPP deleted successfully');
    }
  };

  const getBatchName = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Content Management</h2>

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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Manage Lectures</h3>
            <Dialog open={isLectureDialogOpen} onOpenChange={setIsLectureDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lecture
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Add New Lecture</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddLecture} className="space-y-4">
                  <div>
                    <Label htmlFor="lectureTitle">Title *</Label>
                    <Input
                      id="lectureTitle"
                      value={lectureForm.title}
                      onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="videoLink">Video Link *</Label>
                    <Input
                      id="videoLink"
                      value={lectureForm.videoLink}
                      onChange={(e) => setLectureForm({ ...lectureForm, videoLink: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="https://youtube.com/watch?v=..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lectureBatch">Batch *</Label>
                    <Select
                      value={lectureForm.batchId}
                      onValueChange={(value) => setLectureForm({ ...lectureForm, batchId: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {batches.map(batch => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsLectureDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Lecture</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {lectures.map(lecture => (
              <Card key={lecture.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Video className="w-8 h-8 text-blue-400" />
                      <div>
                        <h4 className="font-semibold">{lecture.title}</h4>
                        <p className="text-sm text-gray-400">
                          Batch: {getBatchName(lecture.batchId)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteLecture(lecture.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {lectures.length === 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">No lectures added yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Manage Notes</h3>
            <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Add New Note</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddNote} className="space-y-4">
                  <div>
                    <Label htmlFor="noteTitle">Title *</Label>
                    <Input
                      id="noteTitle"
                      value={noteForm.title}
                      onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pdfLink">PDF Link *</Label>
                    <Input
                      id="pdfLink"
                      value={noteForm.pdfLink}
                      onChange={(e) => setNoteForm({ ...noteForm, pdfLink: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="https://example.com/notes.pdf"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="noteBatch">Batch *</Label>
                    <Select
                      value={noteForm.batchId}
                      onValueChange={(value) => setNoteForm({ ...noteForm, batchId: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {batches.map(batch => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Note</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {notes.map(note => (
              <Card key={note.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-8 h-8 text-green-400" />
                      <div>
                        <h4 className="font-semibold">{note.title}</h4>
                        <p className="text-sm text-gray-400">
                          Batch: {getBatchName(note.batchId)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {notes.length === 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">No notes added yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="dpps" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Manage DPPs</h3>
            <Dialog open={isDPPDialogOpen} onOpenChange={setIsDPPDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add DPP
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Add New DPP</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddDPP} className="space-y-4">
                  <div>
                    <Label htmlFor="dppTitle">Title *</Label>
                    <Input
                      id="dppTitle"
                      value={dppForm.title}
                      onChange={(e) => setDPPForm({ ...dppForm, title: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dppPdfLink">PDF Link *</Label>
                    <Input
                      id="dppPdfLink"
                      value={dppForm.pdfLink}
                      onChange={(e) => setDPPForm({ ...dppForm, pdfLink: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="https://example.com/dpp.pdf"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dppBatch">Batch *</Label>
                    <Select
                      value={dppForm.batchId}
                      onValueChange={(value) => setDPPForm({ ...dppForm, batchId: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {batches.map(batch => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDPPDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add DPP</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {dpps.map(dpp => (
              <Card key={dpp.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-orange-400" />
                      <div>
                        <h4 className="font-semibold">{dpp.title}</h4>
                        <p className="text-sm text-gray-400">
                          Batch: {getBatchName(dpp.batchId)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteDPP(dpp.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {dpps.length === 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">No DPPs added yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManager;
