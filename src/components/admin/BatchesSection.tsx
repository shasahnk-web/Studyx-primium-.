
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
import { getStorageData, setStorageData } from '@/utils/localStorage';

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
  status: 'active' | 'inactive' | 'completed';
  createdAt: string;
}

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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subjects: [] as string[],
    image: '',
    startDate: '',
    endDate: '',
    fee: '',
    courseId: '',
    status: 'active' as 'active' | 'inactive' | 'completed',
  });

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = () => {
    const savedBatches = getStorageData<Batch>('batches');
    setBatches(savedBatches);
  };

  const saveBatches = (updatedBatches: Batch[]) => {
    const success = setStorageData('batches', updatedBatches);
    if (success) {
      setBatches(updatedBatches);
    } else {
      toast.error('Failed to save batches. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.courseId || formData.subjects.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error('End date must be after start date');
      return;
    }

    const newBatch: Batch = {
      id: editingBatch ? editingBatch.id : Date.now().toString(),
      ...formData,
      createdAt: editingBatch ? editingBatch.createdAt : new Date().toISOString(),
    };

    let updatedBatches;
    if (editingBatch) {
      updatedBatches = batches.map(batch => 
        batch.id === editingBatch.id ? newBatch : batch
      );
      toast.success('Batch updated successfully');
    } else {
      updatedBatches = [...batches, newBatch];
      toast.success('Batch added successfully');
    }

    saveBatches(updatedBatches);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      subjects: [],
      image: '',
      startDate: '',
      endDate: '',
      fee: '',
      courseId: '',
      status: 'active',
    });
    setShowForm(false);
    setEditingBatch(null);
  };

  const handleEdit = (batch: Batch) => {
    setFormData({
      name: batch.name,
      description: batch.description,
      subjects: batch.subjects,
      image: batch.image || '',
      startDate: batch.startDate,
      endDate: batch.endDate,
      fee: batch.fee || '',
      courseId: batch.courseId,
      status: batch.status,
    });
    setEditingBatch(batch);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this batch? This will also remove all associated lectures, notes, and DPPs.')) {
      // Remove batch
      const updatedBatches = batches.filter(batch => batch.id !== id);
      saveBatches(updatedBatches);

      // Remove associated content
      const lectures = getStorageData('lectures');
      const filteredLectures = lectures.filter((item: any) => item.batchId !== id);
      setStorageData('lectures', filteredLectures);

      const notes = getStorageData('notes');
      const filteredNotes = notes.filter((item: any) => item.batchId !== id);
      setStorageData('notes', filteredNotes);

      const dpps = getStorageData('dpps');
      const filteredDpps = dpps.filter((item: any) => item.batchId !== id);
      setStorageData('dpps', filteredDpps);

      toast.success('Batch and associated content deleted successfully');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

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
                  <Select value={formData.courseId} onValueChange={(value) => setFormData({...formData, courseId: value})}>
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
                  <Label htmlFor="startDate" className="text-foreground">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-foreground">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
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
                  <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'completed') => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="image" className="text-foreground">Image URL (Optional)</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="Enter image URL"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingBatch ? 'Update Batch' : 'Add Batch'}
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
                  <TableCell className="text-foreground">{getCourseName(batch.courseId)}</TableCell>
                  <TableCell className="text-foreground">
                    <div className="flex flex-wrap gap-1">
                      {batch.subjects.slice(0, 2).map(subject => (
                        <span key={subject} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                          {subject}
                        </span>
                      ))}
                      {batch.subjects.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{batch.subjects.length - 2} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    <div className="text-sm">
                      <div>{new Date(batch.startDate).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">to {new Date(batch.endDate).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(batch.status)}`}>
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
