
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface Note {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  subject: string;
  lectureId?: string;
  batchId: string;
  createdAt: string;
}

const subjects = ['Maths', 'Chemistry', 'Biology', 'Physics', 'Hindi', 'English', 'IT', 'Sanskrit', 'SST'];

export function NotesSection() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [lectures, setLectures] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pdfUrl: '',
    subject: '',
    lectureId: '',
    batchId: '',
  });

  useEffect(() => {
    loadNotes();
    loadBatches();
    loadLectures();
  }, []);

  const loadNotes = () => {
    const savedNotes = JSON.parse(localStorage.getItem('studyx_notes') || '[]');
    setNotes(savedNotes);
  };

  const loadBatches = () => {
    const savedBatches = JSON.parse(localStorage.getItem('studyx_batches') || '[]');
    setBatches(savedBatches);
  };

  const loadLectures = () => {
    const savedLectures = JSON.parse(localStorage.getItem('studyx_lectures') || '[]');
    setLectures(savedLectures);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.pdfUrl || !formData.subject || !formData.batchId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newNote: Note = {
      id: editingNote ? editingNote.id : Date.now().toString(),
      ...formData,
      createdAt: editingNote ? editingNote.createdAt : new Date().toISOString(),
    };

    let updatedNotes;
    if (editingNote) {
      updatedNotes = notes.map(note => 
        note.id === editingNote.id ? newNote : note
      );
      toast.success('Note updated successfully');
    } else {
      updatedNotes = [...notes, newNote];
      toast.success('Note added successfully');
    }

    setNotes(updatedNotes);
    localStorage.setItem('studyx_notes', JSON.stringify(updatedNotes));
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      pdfUrl: '',
      subject: '',
      lectureId: '',
      batchId: '',
    });
    setShowForm(false);
    setEditingNote(null);
  };

  const handleEdit = (note: Note) => {
    setFormData({
      title: note.title,
      description: note.description,
      pdfUrl: note.pdfUrl,
      subject: note.subject,
      lectureId: note.lectureId || '',
      batchId: note.batchId,
    });
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem('studyx_notes', JSON.stringify(updatedNotes));
      toast.success('Note deleted successfully');
    }
  };

  const getBatchName = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  const getLectureName = (lectureId?: string) => {
    if (!lectureId) return 'N/A';
    const lecture = lectures.find(l => l.id === lectureId);
    return lecture ? lecture.title : 'Unknown Lecture';
  };

  const getFilteredLectures = () => {
    return lectures.filter(lecture => lecture.batchId === formData.batchId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Notes Management</h1>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Note</span>
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <FileText className="w-5 h-5" />
              <span>{editingNote ? 'Edit Note' : 'Add New Note'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-foreground">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter note title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-foreground">Subject *</Label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="batch" className="text-foreground">Batch *</Label>
                  <Select value={formData.batchId} onValueChange={(value) => setFormData({...formData, batchId: value, lectureId: ''})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map(batch => (
                        <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="lecture" className="text-foreground">Lecture (Optional)</Label>
                  <Select value={formData.lectureId} onValueChange={(value) => setFormData({...formData, lectureId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lecture" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No specific lecture</SelectItem>
                      {getFilteredLectures().map(lecture => (
                        <SelectItem key={lecture.id} value={lecture.id}>{lecture.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="pdfUrl" className="text-foreground">PDF URL *</Label>
                <Input
                  id="pdfUrl"
                  value={formData.pdfUrl}
                  onChange={(e) => setFormData({...formData, pdfUrl: e.target.value})}
                  placeholder="Enter PDF link"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter note description"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingNote ? 'Update Note' : 'Add Note'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">All Notes ({notes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground">Title</TableHead>
                <TableHead className="text-foreground">Subject</TableHead>
                <TableHead className="text-foreground">Batch</TableHead>
                <TableHead className="text-foreground">Lecture</TableHead>
                <TableHead className="text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell className="text-foreground font-medium">{note.title}</TableCell>
                  <TableCell className="text-foreground">{note.subject}</TableCell>
                  <TableCell className="text-foreground">{getBatchName(note.batchId)}</TableCell>
                  <TableCell className="text-foreground">{getLectureName(note.lectureId)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(note)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(note.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {notes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No notes found. Add your first note!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
