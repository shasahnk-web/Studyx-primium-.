
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Video } from 'lucide-react';
import { toast } from 'sonner';

interface Lecture {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  subject: string;
  topic: string;
  batchId: string;
  createdAt: string;
}

const subjects = ['Maths', 'Chemistry', 'Biology', 'Physics', 'Hindi', 'English', 'IT', 'Sanskrit', 'SST'];

export function LecturesSection() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    subject: '',
    topic: '',
    batchId: '',
  });

  useEffect(() => {
    loadLectures();
    loadBatches();
  }, []);

  const loadLectures = () => {
    const savedLectures = JSON.parse(localStorage.getItem('studyx_lectures') || '[]');
    setLectures(savedLectures);
  };

  const loadBatches = () => {
    const savedBatches = JSON.parse(localStorage.getItem('studyx_batches') || '[]');
    setBatches(savedBatches);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.videoUrl || !formData.subject || !formData.batchId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newLecture: Lecture = {
      id: editingLecture ? editingLecture.id : Date.now().toString(),
      ...formData,
      createdAt: editingLecture ? editingLecture.createdAt : new Date().toISOString(),
    };

    let updatedLectures;
    if (editingLecture) {
      updatedLectures = lectures.map(lecture => 
        lecture.id === editingLecture.id ? newLecture : lecture
      );
      toast.success('Lecture updated successfully');
    } else {
      updatedLectures = [...lectures, newLecture];
      toast.success('Lecture added successfully');
    }

    setLectures(updatedLectures);
    localStorage.setItem('studyx_lectures', JSON.stringify(updatedLectures));
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      subject: '',
      topic: '',
      batchId: '',
    });
    setShowForm(false);
    setEditingLecture(null);
  };

  const handleEdit = (lecture: Lecture) => {
    setFormData({
      title: lecture.title,
      description: lecture.description,
      videoUrl: lecture.videoUrl,
      subject: lecture.subject,
      topic: lecture.topic,
      batchId: lecture.batchId,
    });
    setEditingLecture(lecture);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this lecture?')) {
      const updatedLectures = lectures.filter(lecture => lecture.id !== id);
      setLectures(updatedLectures);
      localStorage.setItem('studyx_lectures', JSON.stringify(updatedLectures));
      toast.success('Lecture deleted successfully');
    }
  };

  const getBatchName = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Lectures Management</h1>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Lecture</span>
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <Video className="w-5 h-5" />
              <span>{editingLecture ? 'Edit Lecture' : 'Add New Lecture'}</span>
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
                    placeholder="Enter lecture title"
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
                  <Label htmlFor="topic" className="text-foreground">Topic</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    placeholder="Enter topic name"
                  />
                </div>
                <div>
                  <Label htmlFor="batch" className="text-foreground">Batch *</Label>
                  <Select value={formData.batchId} onValueChange={(value) => setFormData({...formData, batchId: value})}>
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
              </div>

              <div>
                <Label htmlFor="videoUrl" className="text-foreground">Video URL *</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                  placeholder="YouTube, Vimeo, Google Drive link"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter lecture description"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingLecture ? 'Update Lecture' : 'Add Lecture'}
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
          <CardTitle className="text-foreground">All Lectures ({lectures.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground">Title</TableHead>
                <TableHead className="text-foreground">Subject</TableHead>
                <TableHead className="text-foreground">Topic</TableHead>
                <TableHead className="text-foreground">Batch</TableHead>
                <TableHead className="text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lectures.map((lecture) => (
                <TableRow key={lecture.id}>
                  <TableCell className="text-foreground font-medium">{lecture.title}</TableCell>
                  <TableCell className="text-foreground">{lecture.subject}</TableCell>
                  <TableCell className="text-foreground">{lecture.topic || 'N/A'}</TableCell>
                  <TableCell className="text-foreground">{getBatchName(lecture.batchId)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(lecture)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(lecture.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {lectures.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No lectures found. Add your first lecture!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
