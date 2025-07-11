
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

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

interface BatchManagerProps {
  onUpdate: () => void;
}

const availableSubjects = [
  'Mathematics', 'Chemistry', 'Biology', 'Physics',
  'Hindi', 'English', 'IT', 'Sanskrit', 'SST'
];

const courses = [
  { id: 'pw-courses', name: 'PW Courses' },
  { id: 'pw-khazana', name: 'PW Khazana' },
  { id: 'pw-tests', name: 'PW Tests' }
];

const BatchManager = ({ onUpdate }: BatchManagerProps) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subjects: [] as string[],
    image: '',
    startDate: '',
    endDate: '',
    fee: '',
    courseId: ''
  });

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = () => {
    const savedBatches = localStorage.getItem('studyx_batches');
    if (savedBatches) {
      setBatches(JSON.parse(savedBatches));
    }
  };

  const saveBatches = (updatedBatches: Batch[]) => {
    localStorage.setItem('studyx_batches', JSON.stringify(updatedBatches));
    setBatches(updatedBatches);
    onUpdate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.courseId || formData.subjects.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const batch: Batch = {
      id: editingBatch?.id || Date.now().toString(),
      ...formData
    };

    let updatedBatches;
    if (editingBatch) {
      updatedBatches = batches.map(b => b.id === editingBatch.id ? batch : b);
      toast.success('Batch updated successfully');
    } else {
      updatedBatches = [...batches, batch];
      toast.success('Batch created successfully');
    }

    saveBatches(updatedBatches);
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setFormData({
      name: batch.name,
      description: batch.description,
      subjects: batch.subjects,
      image: batch.image || '',
      startDate: batch.startDate,
      endDate: batch.endDate,
      fee: batch.fee || '',
      courseId: batch.courseId
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (batchId: string) => {
    if (confirm('Are you sure you want to delete this batch?')) {
      const updatedBatches = batches.filter(b => b.id !== batchId);
      saveBatches(updatedBatches);
      toast.success('Batch deleted successfully');
    }
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
      courseId: ''
    });
    setEditingBatch(null);
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, subjects: [...formData.subjects, subject] });
    } else {
      setFormData({ 
        ...formData, 
        subjects: formData.subjects.filter(s => s !== subject) 
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Batch Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBatch ? 'Edit Batch' : 'Add New Batch'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Batch Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="courseId">Course *</Label>
                  <Select
                    value={formData.courseId}
                    onValueChange={(value) => setFormData({ ...formData, courseId: value })}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label>Subjects *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {availableSubjects.map(subject => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={formData.subjects.includes(subject)}
                        onCheckedChange={(checked) => 
                          handleSubjectChange(subject, checked as boolean)
                        }
                      />
                      <Label htmlFor={subject} className="text-sm">{subject}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="fee">Fee (₹)</Label>
                  <Input
                    id="fee"
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBatch ? 'Update' : 'Create'} Batch
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {batches.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">No batches created yet.</p>
            </CardContent>
          </Card>
        ) : (
          batches.map(batch => (
            <Card key={batch.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{batch.name}</h3>
                      <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                        {courses.find(c => c.id === batch.courseId)?.name}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-3">{batch.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {batch.subjects.map(subject => (
                        <span key={subject} className="text-xs bg-gray-700 px-2 py-1 rounded">
                          {subject}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-gray-400 space-x-4">
                      {batch.startDate && (
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                        </span>
                      )}
                      {batch.fee && <span>₹{batch.fee}</span>}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(batch)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(batch.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BatchManager;
