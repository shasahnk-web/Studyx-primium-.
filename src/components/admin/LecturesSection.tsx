
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Video, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  fetchLectures, 
  createLecture, 
  updateLecture, 
  deleteLecture,
  fetchBatches,
  subscribeToLectures,
  type Lecture,
  type Batch 
} from '@/services/supabaseService';

const subjects = ['Maths', 'Chemistry', 'Biology', 'Physics', 'Hindi', 'English', 'IT', 'Sanskrit', 'SST'];

export function LecturesSection() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    subject: '',
    topic: '',
    batch_id: '',
    course_id: '',
  });

  useEffect(() => {
    loadData();
    
    // Set up real-time subscription for lectures
    const unsubscribe = subscribeToLectures((updatedLectures) => {
      console.log('📡 Lectures updated via subscription:', updatedLectures.length);
      setLectures(updatedLectures);
    });

    return unsubscribe;
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Loading lectures and batches data...');
      
      const [lecturesData, batchesData] = await Promise.all([
        fetchLectures(),
        fetchBatches()
      ]);
      
      console.log('✅ Loaded data:', {
        lectures: lecturesData.length,
        batches: batchesData.length
      });
      
      setLectures(lecturesData);
      setBatches(batchesData);
    } catch (error) {
      console.error('❌ Error loading data:', error);
      toast.error('Failed to load data. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('🔄 Submitting lecture form:', formData);

      // Validate required fields
      if (!formData.title.trim()) {
        toast.error('Title is required');
        return;
      }
      if (!formData.video_url.trim()) {
        toast.error('Video URL is required');
        return;
      }
      if (!formData.subject) {
        toast.error('Subject is required');
        return;
      }
      if (!formData.batch_id) {
        toast.error('Batch selection is required');
        return;
      }

      // Validate URL format
      try {
        new URL(formData.video_url);
      } catch {
        toast.error('Please enter a valid video URL');
        return;
      }

      // Verify batch exists and get course_id
      const selectedBatch = batches.find(batch => batch.id === formData.batch_id);
      if (!selectedBatch) {
        toast.error('Selected batch not found');
        return;
      }

      // Verify subject exists in batch
      const batchSubjects = selectedBatch.subjects || [];
      if (!batchSubjects.includes(formData.subject)) {
        console.warn(`Subject "${formData.subject}" not in batch subjects:`, batchSubjects);
        // Allow it but warn user
        toast.warning(`Subject "${formData.subject}" is not in the selected batch's subjects list`);
      }

      const lectureData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        video_url: formData.video_url.trim(),
        subject: formData.subject,
        topic: formData.topic.trim() || null,
        batch_id: formData.batch_id,
        course_id: selectedBatch.course_id,
      };

      console.log('📝 Lecture data to save:', lectureData);

      if (editingLecture) {
        const updated = await updateLecture(editingLecture.id, lectureData);
        if (updated) {
          setLectures(prev => prev.map(lecture => 
            lecture.id === editingLecture.id ? updated : lecture
          ));
          resetForm();
        }
      } else {
        const created = await createLecture(lectureData);
        if (created) {
          setLectures(prev => [created, ...prev]);
          resetForm();
        }
      }
    } catch (error) {
      console.error('❌ Error submitting lecture:', error);
      toast.error('An error occurred while saving the lecture');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_url: '',
      subject: '',
      topic: '',
      batch_id: '',
      course_id: '',
    });
    setShowForm(false);
    setEditingLecture(null);
  };

  const handleEdit = (lecture: Lecture) => {
    console.log('✏️ Editing lecture:', lecture);
    setFormData({
      title: lecture.title,
      description: lecture.description || '',
      video_url: lecture.video_url,
      subject: lecture.subject || '',
      topic: lecture.topic || '',
      batch_id: lecture.batch_id || '',
      course_id: lecture.course_id || '',
    });
    setEditingLecture(lecture);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lecture?')) {
      console.log('🗑️ Deleting lecture with ID:', id);
      const success = await deleteLecture(id);
      
      if (success) {
        setLectures(prev => prev.filter(lecture => lecture.id !== id));
      }
    }
  };

  const getBatchName = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  // Get available subjects for selected batch
  const getAvailableSubjects = () => {
    if (!formData.batch_id) return subjects;
    
    const selectedBatch = batches.find(batch => batch.id === formData.batch_id);
    return selectedBatch?.subjects || subjects;
  };

  if (isLoading && lectures.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Loading lectures...</span>
        </div>
      </div>
    );
  }

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
                  <Label htmlFor="batch" className="text-foreground">Batch *</Label>
                  <Select 
                    value={formData.batch_id} 
                    onValueChange={(value) => setFormData({...formData, batch_id: value, subject: ''})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch first" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map(batch => (
                        <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject" className="text-foreground">Subject *</Label>
                  <Select 
                    value={formData.subject} 
                    onValueChange={(value) => setFormData({...formData, subject: value})}
                    disabled={!formData.batch_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.batch_id ? "Select subject" : "Select batch first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableSubjects().map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.batch_id && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Available subjects for selected batch
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="topic" className="text-foreground">Topic</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    placeholder="Enter topic name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="video_url" className="text-foreground">Video URL *</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({...formData, video_url: e.target.value})}
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : (editingLecture ? 'Update Lecture' : 'Add Lecture')}
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
          {lectures.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No lectures found. Add your first lecture!</p>
            </div>
          ) : (
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
                    <TableCell className="text-foreground">{getBatchName(lecture.batch_id || '')}</TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
