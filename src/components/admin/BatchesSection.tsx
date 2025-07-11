import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Users, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { 
  fetchBatches, 
  createBatch, 
  updateBatch, 
  deleteBatch, 
  subscribeToBatches,
  type Batch 
} from '@/services/supabaseService';

const subjects = ['Maths', 'Chemistry', 'Biology', 'Physics', 'Hindi', 'English', 'IT', 'Sanskrit', 'SST'];
const courses = [
  { id: 'pw-courses', name: 'PW Courses' },
  { id: 'pw-khazana', name: 'PW Khazana' },
  { id: 'pw-tests', name: 'PW Tests' }
];

export function BatchesSection() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subjects: [] as string[],
    image_url: '',
    start_date: '',
    end_date: '',
    fee: '',
    course_id: '',
    status: 'active' as string,
  });

  useEffect(() => {
    loadBatches();
    
    // Set up real-time subscription
    const unsubscribe = subscribeToBatches((updatedBatches) => {
      console.log('📡 Batches updated via subscription:', updatedBatches.length);
      setBatches(updatedBatches);
    });

    return unsubscribe;
  }, []);

  const loadBatches = async () => {
    setIsLoading(true);
    try {
      const data = await fetchBatches();
      setBatches(data);
    } catch (error) {
      console.error('Error loading batches:', error);
      toast.error('Failed to load batches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!formData.name || !formData.description || !formData.course_id || formData.subjects.length === 0) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (formData.start_date && formData.end_date && new Date(formData.end_date) <= new Date(formData.start_date)) {
        toast.error('End date must be after start date');
        return;
      }

      const batchData = {
        name: formData.name,
        description: formData.description,
        subjects: formData.subjects,
        image_url: formData.image_url || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        fee: formData.fee ? parseInt(formData.fee) : null,
        course_id: formData.course_id,
        status: formData.status,
      };

      if (editingBatch) {
        const updated = await updateBatch(editingBatch.id, batchData);
        if (updated) {
          setBatches(prev => prev.map(batch => 
            batch.id === editingBatch.id ? updated : batch
          ));
        }
      } else {
        const created = await createBatch(batchData);
        if (created) {
          setBatches(prev => [created, ...prev]);
        }
      }

      if (editingBatch || formData.name) {
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting batch:', error);
      toast.error('Failed to save batch');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      subjects: [],
      image_url: '',
      start_date: '',
      end_date: '',
      fee: '',
      course_id: '',
      status: 'active',
    });
    setShowForm(false);
    setEditingBatch(null);
  };

  const handleEdit = (batch: Batch) => {
    setFormData({
      name: batch.name,
      description: batch.description || '',
      subjects: batch.subjects || [],
      image_url: batch.image_url || '',
      start_date: batch.start_date || '',
      end_date: batch.end_date || '',
      fee: batch.fee ? batch.fee.toString() : '',
      course_id: batch.course_id || '',
      status: batch.status || 'active',
    });
    setEditingBatch(batch);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this batch? This will also remove all associated lectures, notes, and DPPs.')) {
      const success = await deleteBatch(id);
      if (success) {
        setBatches(prev => prev.filter(batch => batch.id !== id));
      }
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  if (isLoading && batches.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Loading batches...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Batches Management</h1>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Batch</span>
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <Users className="w-5 h-5" />
              <span>{editingBatch ? 'Edit Batch' : 'Add New Batch'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">Batch Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter batch name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="course" className="text-foreground">Course *</Label>
                  <Select value={formData.course_id} onValueChange={(value) => setFormData({...formData, course_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-foreground">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter batch description"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label className="text-foreground">Subjects *</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {subjects.map(subject => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={formData.subjects.includes(subject)}
                        onCheckedChange={() => handleSubjectToggle(subject)}
                      />
                      <Label htmlFor={subject} className="text-sm text-foreground">{subject}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date" className="text-foreground">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date" className="text-foreground">End Date *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fee" className="text-foreground">Fee (Optional)</Label>
                  <Input
                    id="fee"
                    type="number"
                    value={formData.fee}
                    onChange={(e) => setFormData({...formData, fee: e.target.value})}
                    placeholder="Enter fee amount"
                  />
                </div>
                <div>
                  <Label htmlFor="status" className="text-foreground">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="image_url" className="text-foreground">Image URL (Optional)</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="Enter image URL"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : (editingBatch ? 'Update Batch' : 'Add Batch')}
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
          <CardTitle className="text-foreground">All Batches ({batches.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground">Name</TableHead>
                <TableHead className="text-foreground">Course</TableHead>
                <TableHead className="text-foreground">Subjects</TableHead>
                <TableHead className="text-foreground">Duration</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="text-foreground font-medium">{batch.name}</TableCell>
                  <TableCell className="text-foreground">{getCourseName(batch.course_id || '')}</TableCell>
                  <TableCell className="text-foreground">
                    <div className="flex flex-wrap gap-1">
                      {(batch.subjects || []).slice(0, 2).map(subject => (
                        <span key={subject} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                          {subject}
                        </span>
                      ))}
                      {(batch.subjects || []).length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{(batch.subjects || []).length - 2} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    <div className="text-sm">
                      {batch.start_date && batch.end_date && (
                        <>
                          <div>{new Date(batch.start_date).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">to {new Date(batch.end_date).toLocaleDateString()}</div>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      batch.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {batch.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(batch)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(batch.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {batches.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No batches found. Add your first batch!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
