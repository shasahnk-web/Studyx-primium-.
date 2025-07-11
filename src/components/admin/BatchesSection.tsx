
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Users, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';

interface Batch {
  id: string;
  name: string;
  description: string;
  subjects: string[];
  imageUrl: string;
  startDate: string;
  endDate: string;
  fee: number;
  status: 'active' | 'inactive';
  enrolledCount: number;
  createdAt: string;
}

const subjects = ['Maths', 'Chemistry', 'Biology', 'Physics', 'Hindi', 'English', 'IT', 'Sanskrit', 'SST'];

export function BatchesSection() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subjects: [] as string[],
    imageUrl: '',
    startDate: '',
    endDate: '',
    fee: 0,
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = () => {
    const savedBatches = JSON.parse(localStorage.getItem('studyx_batches') || '[]');
    setBatches(savedBatches);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || formData.subjects.length === 0) {
      toast.error('Please fill in all required fields and select at least one subject');
      return;
    }

    const newBatch: Batch = {
      id: editingBatch ? editingBatch.id : Date.now().toString(),
      ...formData,
      enrolledCount: editingBatch ? editingBatch.enrolledCount : 0,
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

    setBatches(updatedBatches);
    localStorage.setItem('studyx_batches', JSON.stringify(updatedBatches));
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      subjects: [],
      imageUrl: '',
      startDate: '',
      endDate: '',
      fee: 0,
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
      imageUrl: batch.imageUrl,
      startDate: batch.startDate,
      endDate: batch.endDate,
      fee: batch.fee,
      status: batch.status,
    });
    setEditingBatch(batch);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this batch? This will also delete all associated lectures, notes, and DPPs.')) {
      const updatedBatches = batches.filter(batch => batch.id !== id);
      setBatches(updatedBatches);
      localStorage.setItem('studyx_batches', JSON.stringify(updatedBatches));
      
      // Also clean up associated content
      const lectures = JSON.parse(localStorage.getItem('studyx_lectures') || '[]');
      const notes = JSON.parse(localStorage.getItem('studyx_notes') || '[]');
      const dpps = JSON.parse(localStorage.getItem('studyx_dpps') || '[]');
      
      localStorage.setItem('studyx_lectures', JSON.stringify(lectures.filter((l: any) => l.batchId !== id)));
      localStorage.setItem('studyx_notes', JSON.stringify(notes.filter((n: any) => n.batchId !== id)));
      localStorage.setItem('studyx_dpps', JSON.stringify(dpps.filter((d: any) => d.batchId !== id)));
      
      toast.success('Batch and associated content deleted successfully');
    }
  };

  const toggleBatchStatus = (id: string) => {
    const updatedBatches = batches.map(batch => 
      batch.id === id 
        ? { ...batch, status: batch.status === 'active' ? 'inactive' as const : 'active' as const }
        : batch
    );
    setBatches(updatedBatches);
    localStorage.setItem('studyx_batches', JSON.stringify(updatedBatches));
    toast.success('Batch status updated');
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setFormData({...formData, subjects: [...formData.subjects, subject]});
    } else {
      setFormData({...formData, subjects: formData.subjects.filter(s => s !== subject)});
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
                  <Label htmlFor="fee" className="text-foreground">Fee (₹)</Label>
                  <Input
                    id="fee"
                    type="number"
                    value={formData.fee}
                    onChange={(e) => setFormData({...formData, fee: Number(e.target.value)})}
                    placeholder="Enter fee amount"
                  />
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {subjects.map(subject => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={formData.subjects.includes(subject)}
                        onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                      />
                      <Label htmlFor={subject} className="text-sm text-foreground">{subject}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="text-foreground">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-foreground">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="imageUrl" className="text-foreground">Thumbnail Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="Enter image URL"
                />
              </div>

              <div>
                <Label htmlFor="status" className="text-foreground">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as 'active' | 'inactive'})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
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
                <TableHead className="text-foreground">Subjects</TableHead>
                <TableHead className="text-foreground">Students</TableHead>
                <TableHead className="text-foreground">Fee</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="text-foreground font-medium">{batch.name}</TableCell>
                  <TableCell className="text-foreground">
                    <div className="flex flex-wrap gap-1">
                      {batch.subjects.slice(0, 3).map(subject => (
                        <span key={subject} className="px-2 py-1 bg-muted text-xs rounded">
                          {subject}
                        </span>
                      ))}
                      {batch.subjects.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-xs rounded">
                          +{batch.subjects.length - 3} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{batch.enrolledCount || 0}</TableCell>
                  <TableCell className="text-foreground">₹{batch.fee || 0}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleBatchStatus(batch.id)}
                      className="flex items-center space-x-1"
                    >
                      {batch.status === 'active' ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-red-600" />
                          <span className="text-red-600">Inactive</span>
                        </>
                      )}
                    </Button>
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
