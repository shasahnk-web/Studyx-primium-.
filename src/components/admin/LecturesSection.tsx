
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
import { getStorageData, setStorageData } from '@/utils/localStorage';

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

interface Batch {
  id: string;
  name: string;
  subjects: string[];
}

const subjects = ['Maths', 'Chemistry', 'Biology', 'Physics', 'Hindi', 'English', 'IT', 'Sanskrit', 'SST'];

// Data validation schema
const validateLectureData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!data.videoUrl || data.videoUrl.trim().length === 0) {
    errors.push('Video URL is required');
  } else {
    // Basic URL validation
    try {
      new URL(data.videoUrl);
    } catch {
      errors.push('Valid video URL is required');
    }
  }
  
  if (!data.subject || data.subject.trim().length === 0) {
    errors.push('Subject is required');
  }
  
  if (!data.batchId || data.batchId.trim().length === 0) {
    errors.push('Batch selection is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export function LecturesSection() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    subject: '',
    topic: '',
    batchId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      console.log('Loading lectures and batches data...');
      
      const savedLectures = getStorageData<Lecture>('lectures');
      const savedBatches = getStorageData<Batch>('batches');
      
      console.log('Loaded lectures from storage:', savedLectures);
      console.log('Loaded batches from storage:', savedBatches);
      
      setLectures(savedLectures);
      setBatches(savedBatches);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data. Please refresh the page.');
    }
  };

  const saveLectureData = (updatedLectures: Lecture[]) => {
    try {
      console.log('Saving lectures to storage:', updatedLectures);
      
      const success = setStorageData('lectures', updatedLectures);
      
      if (success) {
        setLectures(updatedLectures);
        console.log('Lectures saved successfully');
        
        // Trigger storage event for cross-component updates
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'studyx_lectures',
          newValue: JSON.stringify(updatedLectures),
          storageArea: localStorage
        }));
        
        // Also dispatch a custom event for immediate updates
        window.dispatchEvent(new CustomEvent('lecturesUpdated', {
          detail: { lectures: updatedLectures }
        }));
        
        return true;
      } else {
        console.error('Failed to save lectures to localStorage');
        toast.error('Failed to save lecture. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error saving lectures:', error);
      toast.error('Failed to save lecture. Please try again.');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate form data
      const validation = validateLectureData(formData);
      
      if (!validation.isValid) {
        validation.errors.forEach(error => toast.error(error));
        return;
      }

      // Verify batch exists and subject is valid
      const selectedBatch = batches.find(batch => batch.id === formData.batchId);
      if (!selectedBatch) {
        toast.error('Selected batch not found');
        return;
      }

      // Verify subject exists in batch
      const normalizedSubject = formData.subject.toLowerCase().trim();
      const batchHasSubject = selectedBatch.subjects.some(batchSubject => 
        batchSubject.toLowerCase().trim() === normalizedSubject
      );

      if (!batchHasSubject) {
        console.warn(`Subject "${formData.subject}" not found in batch subjects:`, selectedBatch.subjects);
        // Still allow it but log warning
      }

      const newLecture: Lecture = {
        id: editingLecture ? editingLecture.id : Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        videoUrl: formData.videoUrl.trim(),
        subject: formData.subject,
        topic: formData.topic.trim(),
        batchId: formData.batchId,
        createdAt: editingLecture ? editingLecture.createdAt : new Date().toISOString(),
      };

      console.log('Creating/updating lecture:', newLecture);

      let updatedLectures;
      if (editingLecture) {
        updatedLectures = lectures.map(lecture => 
          lecture.id === editingLecture.id ? newLecture : lecture
        );
        console.log('Updated existing lecture');
      } else {
        updatedLectures = [...lectures, newLecture];
        console.log('Added new lecture');
      }

      const saveSuccess = saveLectureData(updatedLectures);
      
      if (saveSuccess) {
        toast.success(editingLecture ? 'Lecture updated successfully' : 'Lecture added successfully');
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting lecture:', error);
      toast.error('An error occurred while saving the lecture');
    } finally {
      setIsLoading(false);
    }
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
    console.log('Editing lecture:', lecture);
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
      console.log('Deleting lecture with ID:', id);
      const updatedLectures = lectures.filter(lecture => lecture.id !== id);
      const success = saveLectureData(updatedLectures);
      
      if (success) {
        toast.success('Lecture deleted successfully');
      }
    }
  };

  const getBatchName = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  // Get available subjects for selected batch
  const getAvailableSubjects = () => {
    if (!formData.batchId) return subjects;
    
    const selectedBatch = batches.find(batch => batch.id === formData.batchId);
    return selectedBatch ? selectedBatch.subjects : subjects;
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
                  <Label htmlFor="batch" className="text-foreground">Batch *</Label>
                  <Select 
                    value={formData.batchId} 
                    onValueChange={(value) => setFormData({...formData, batchId: value, subject: ''})}
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
                    disabled={!formData.batchId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.batchId ? "Select subject" : "Select batch first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableSubjects().map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.batchId && (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
