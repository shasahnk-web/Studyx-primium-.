import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Calendar, Clock, Upload, GraduationCap, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { fetchBatches, type Batch, fetchLiveLectures, createLiveLecture, updateLiveLecture, deleteLiveLecture, type LiveLecture } from '@/services/supabaseService';

const subjects = ['Maths', 'Chemistry', 'Biology', 'Physics', 'Hindi', 'English', 'IT', 'Sanskrit', 'SST'];
const platforms = ['Zoom', 'Google Meet', 'YouTube Live', 'Microsoft Teams', 'Other'];
const grades = ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'JEE', 'NEET'];

interface UILiveLecture {
  id: string;
  title: string;
  description: string;
  meetingUrl: string;
  date: string;
  time: string;
  subject: string;
  topic: string;
  batchId: string;
  batchName: string; // Added batchName for direct display
  platform: string;
  createdAt: string;
}

export function LiveLecturesSection() {
  const [liveLectures, setLiveLectures] = useState<UILiveLecture[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLecture, setEditingLecture] = useState<UILiveLecture | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meetingUrl: '',
    date: '',
    time: '',
    subject: '',
    topic: '',
    batchId: '',
    platform: '',
  });

  // Bulk upload states
  const [bulkData, setBulkData] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [defaultSubject, setDefaultSubject] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');

  useEffect(() => {
    loadLiveLecturesFromSupabase();
    loadBatchesFromSupabase();
  }, []);

  const loadBatchesFromSupabase = async () => {
    try {
      setLoadingBatches(true);
      setBatchError(null);
      const batchesData = await fetchBatches();
      
      if (batchesData.length === 0) {
        setBatchError('No batches found. Please create some batches first.');
      } else {
        setBatches(batchesData);
      }
    } catch (error) {
      console.error('Error loading batches:', error);
      setBatchError('Failed to load batches. Please try again.');
      toast.error('Failed to load batches');
    } finally {
      setLoadingBatches(false);
    }
  };

  const loadLiveLecturesFromSupabase = async () => {
    try {
      const liveLecturesData = await fetchLiveLectures();
      
      // Transform data with batch names included
      const transformedLectures: UILiveLecture[] = liveLecturesData.map(lecture => {
        const batch = batches.find(b => b.id === lecture.batch_id);
        return {
          id: lecture.id,
          title: lecture.title,
          description: lecture.description || '',
          meetingUrl: lecture.meeting_url,
          date: lecture.live_date,
          time: lecture.live_time,
          subject: lecture.subject || '',
          topic: lecture.topic || '',
          batchId: lecture.batch_id || '',
          batchName: batch ? batch.name : 'Unknown Batch', // Include batch name
          platform: lecture.platform || 'YouTube Live',
          createdAt: lecture.created_at || new Date().toISOString(),
        };
      });
      
      setLiveLectures(transformedLectures);
    } catch (error) {
      console.error('Error loading live lectures:', error);
      toast.error('Failed to load live lectures');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.meetingUrl || !formData.date || !formData.time || !formData.subject || !formData.batchId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const lectureData = {
        title: formData.title,
        description: formData.description,
        meeting_url: formData.meetingUrl,
        live_date: formData.date,
        live_time: formData.time,
        subject: formData.subject,
        topic: formData.topic,
        batch_id: formData.batchId,
        platform: formData.platform,
      };

      if (editingLecture) {
        await updateLiveLecture(editingLecture.id, lectureData);
        toast.success('Live lecture updated successfully');
      } else {
        await createLiveLecture(lectureData);
        toast.success('Live lecture created successfully');
      }

      await loadLiveLecturesFromSupabase();
      resetForm();
    } catch (error) {
      console.error('Error saving live lecture:', error);
      toast.error('Failed to save live lecture');
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkData.trim()) {
      toast.error('Please enter lecture data');
      return;
    }

    if (!selectedBatch) {
      toast.error('Please select a batch');
      return;
    }

    try {
      const lines = bulkData.trim().split('\n');
      const newLectures = [];
      
      let currentTitle = '';
      let currentLinks: string[] = [];
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        if (!trimmedLine.startsWith('http')) {
          if (currentTitle && currentLinks.length > 0) {
            for (let i = 0; i < currentLinks.length; i++) {
              const lectureData = {
                title: `${currentTitle} - Lecture ${i + 1}`,
                description: `Live lecture for ${currentTitle}`,
                meeting_url: currentLinks[i],
                live_date: new Date().toISOString().split('T')[0],
                live_time: '10:00',
                subject: defaultSubject || 'General',
                topic: currentTitle,
                batch_id: selectedBatch,
                platform: 'YouTube Live',
              };
              
              const created = await createLiveLecture(lectureData);
              if (created) newLectures.push(created);
            }
          }
          
          currentTitle = trimmedLine;
          currentLinks = [];
        } else {
          currentLinks.push(trimmedLine);
        }
      }
      
      if (currentTitle && currentLinks.length > 0) {
        for (let i = 0; i < currentLinks.length; i++) {
          const lectureData = {
            title: `${currentTitle} - Lecture ${i + 1}`,
            description: `Live lecture for ${currentTitle}`,
            meeting_url: currentLinks[i],
            live_date: new Date().toISOString().split('T')[0],
            live_time: '10:00',
            subject: defaultSubject || 'General',
            topic: currentTitle,
            batch_id: selectedBatch,
            platform: 'YouTube Live',
          };
          
          const created = await createLiveLecture(lectureData);
          if (created) newLectures.push(created);
        }
      }

      if (newLectures.length === 0) {
        toast.error('No valid lecture data found');
        return;
      }

      await loadLiveLecturesFromSupabase();
      setBulkData('');
      setSelectedGrade('');
      setDefaultSubject('');
      setSelectedBatch('');
      
      toast.success(`${newLectures.length} live lectures uploaded successfully!`);
    } catch (error) {
      toast.error('Error processing bulk data. Please check the format.');
      console.error('Bulk upload error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      meetingUrl: '',
      date: '',
      time: '',
      subject: '',
      topic: '',
      batchId: '',
      platform: '',
    });
    setShowForm(false);
    setEditingLecture(null);
  };

  const handleEdit = (lecture: UILiveLecture) => {
    setFormData({
      title: lecture.title,
      description: lecture.description,
      meetingUrl: lecture.meetingUrl,
      date: lecture.date,
      time: lecture.time,
      subject: lecture.subject,
      topic: lecture.topic,
      batchId: lecture.batchId,
      platform: lecture.platform,
    });
    setEditingLecture(lecture);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this live lecture?')) {
      try {
        await deleteLiveLecture(id);
        await loadLiveLecturesFromSupabase();
        toast.success('Live lecture deleted successfully');
      } catch (error) {
        console.error('Error deleting live lecture:', error);
        toast.error('Failed to delete live lecture');
      }
    }
  };

  const formatDateTime = (date: string, time: string) => {
    return new Date(`${date}T${time}`).toLocaleString();
  };

  const isUpcoming = (date: string, time: string) => {
    const lectureDateTime = new Date(`${date}T${time}`);
    return lectureDateTime > new Date();
  };

  const renderBatchSelect = (value: string, onValueChange: (value: string) => void, placeholder: string) => {
    if (loadingBatches) {
      return (
        <div className="flex items-center space-x-2 p-2 border rounded">
          <Loader className="w-4 h-4 animate-spin" />
          <span className="text-sm text-gray-500">Loading batches...</span>
        </div>
      );
    }

    if (batchError) {
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-2 border border-red-300 rounded bg-red-50 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{batchError}</span>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={loadBatchesFromSupabase}
          >
            Retry Loading Batches
          </Button>
        </div>
      );
    }

    if (batches.length === 0) {
      return (
        <div className="flex items-center space-x-2 p-2 border border-yellow-300 rounded bg-yellow-50 text-yellow-700">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">No batches available. Please create batches first.</span>
        </div>
      );
    }

    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {batches.map(batch => (
            <SelectItem key={batch.id} value={batch.id}>
              {batch.name} {batch.subjects && batch.subjects.length > 0 && `(${batch.subjects.join(', ')})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Live Lectures Management</h1>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Live Lecture</span>
        </Button>
      </div>

      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manage">Manage Lectures</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Calendar className="w-5 h-5" />
                  <span>{editingLecture ? 'Edit Live Lecture' : 'Add New Live Lecture'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter lecture title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
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
                      <Label htmlFor="topic">Topic</Label>
                      <Input
                        id="topic"
                        value={formData.topic}
                        onChange={(e) => setFormData({...formData, topic: e.target.value})}
                        placeholder="Enter topic name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="batch">Batch *</Label>
                      {renderBatchSelect(
                        formData.batchId,
                        (value) => setFormData({...formData, batchId: value}),
                        "Select batch"
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="platform">Platform</Label>
                      <Select value={formData.platform} onValueChange={(value) => setFormData({...formData, platform: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms.map(platform => (
                            <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="meetingUrl">Meeting URL *</Label>
                    <Input
                      id="meetingUrl"
                      value={formData.meetingUrl}
                      onChange={(e) => setFormData({...formData, meetingUrl: e.target.value})}
                      placeholder="Enter meeting/stream URL"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter lecture description"
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" disabled={loadingBatches || batchError !== null}>
                      {editingLecture ? 'Update Live Lecture' : 'Add Live Lecture'}
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
              <CardTitle>All Live Lectures ({liveLectures.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveLectures.map((lecture) => (
                    <TableRow key={lecture.id}>
                      <TableCell className="font-medium">{lecture.title}</TableCell>
                      <TableCell>{lecture.subject}</TableCell>
                      <TableCell>{lecture.batchName}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDateTime(lecture.date, lecture.time)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          isUpcoming(lecture.date, lecture.time) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isUpcoming(lecture.date, lecture.time) ? 'Upcoming' : 'Past'}
                        </span>
                      </TableCell>
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
              {liveLectures.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No live lectures found. Add your first live lecture!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5" />
                <span>Bulk Upload Lectures</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="defaultSubject">Default Subject (optional)</Label>
                  <Select value={defaultSubject} onValueChange={setDefaultSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Auto-detect from text" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="batch">Select Batch *</Label>
                  {renderBatchSelect(
                    selectedBatch,
                    setSelectedBatch,
                    "Choose a batch"
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="bulkData">Paste Your Lecture Data</Label>
                <Textarea
                  id="bulkData"
                  value={bulkData}
                  onChange={(e) => setBulkData(e.target.value)}
                  placeholder={`Example format:
Upload class 9 maths chapter 1 lectures
Lecture 1 link
https://example.com/video1
Lecture 2 link
https://example.com/video2

Upload Biology lectures link of class 9 chapter 1
Lecture 1 link
https://example.com/video3`}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <Button 
                onClick={handleBulkUpload}
                disabled={!bulkData.trim() || !selectedBatch || loadingBatches || batchError !== null}
                className="w-full"
                size="lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload All Lectures
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
