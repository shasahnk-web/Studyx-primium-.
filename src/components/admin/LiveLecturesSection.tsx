
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Calendar, Clock, Upload, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

interface LiveLecture {
  id: string;
  title: string;
  description: string;
  meetingUrl: string;
  date: string;
  time: string;
  subject: string;
  topic: string;
  batchId: string;
  platform: string;
  createdAt: string;
}

const subjects = ['Maths', 'Chemistry', 'Biology', 'Physics', 'Hindi', 'English', 'IT', 'Sanskrit', 'SST'];
const platforms = ['Zoom', 'Google Meet', 'YouTube Live', 'Microsoft Teams', 'Other'];
const grades = ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'JEE', 'NEET'];

export function LiveLecturesSection() {
  const [liveLectures, setLiveLectures] = useState<LiveLecture[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLecture, setEditingLecture] = useState<LiveLecture | null>(null);
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
    loadLiveLectures();
    loadBatches();
  }, []);

  const loadLiveLectures = () => {
    const savedLectures = JSON.parse(localStorage.getItem('studyx_live_lectures') || '[]');
    setLiveLectures(savedLectures);
  };

  const loadBatches = () => {
    const savedBatches = JSON.parse(localStorage.getItem('studyx_batches') || '[]');
    setBatches(savedBatches);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.meetingUrl || !formData.date || !formData.time || !formData.subject || !formData.batchId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newLecture: LiveLecture = {
      id: editingLecture ? editingLecture.id : Date.now().toString(),
      ...formData,
      createdAt: editingLecture ? editingLecture.createdAt : new Date().toISOString(),
    };

    let updatedLectures;
    if (editingLecture) {
      updatedLectures = liveLectures.map(lecture => 
        lecture.id === editingLecture.id ? newLecture : lecture
      );
      toast.success('Live lecture updated successfully');
    } else {
      updatedLectures = [...liveLectures, newLecture];
      toast.success('Live lecture added successfully');
    }

    setLiveLectures(updatedLectures);
    localStorage.setItem('studyx_live_lectures', JSON.stringify(updatedLectures));
    
    resetForm();
  };

  const handleBulkUpload = () => {
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
      const newLectures: LiveLecture[] = [];
      
      let currentTitle = '';
      let currentLinks: string[] = [];
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        // Check if it's a title line (doesn't start with http)
        if (!trimmedLine.startsWith('http')) {
          // If we have accumulated links, process them
          if (currentTitle && currentLinks.length > 0) {
            currentLinks.forEach((link, index) => {
              const lecture: LiveLecture = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                title: `${currentTitle} - Lecture ${index + 1}`,
                description: `Live lecture for ${currentTitle}`,
                meetingUrl: link,
                date: new Date().toISOString().split('T')[0],
                time: '10:00',
                subject: defaultSubject || 'General',
                topic: currentTitle,
                batchId: selectedBatch,
                platform: 'YouTube Live',
                createdAt: new Date().toISOString(),
              };
              newLectures.push(lecture);
            });
          }
          
          // Set new title and reset links
          currentTitle = trimmedLine;
          currentLinks = [];
        } else {
          // It's a link
          currentLinks.push(trimmedLine);
        }
      }
      
      // Process remaining links
      if (currentTitle && currentLinks.length > 0) {
        currentLinks.forEach((link, index) => {
          const lecture: LiveLecture = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: `${currentTitle} - Lecture ${index + 1}`,
            description: `Live lecture for ${currentTitle}`,
            meetingUrl: link,
            date: new Date().toISOString().split('T')[0],
            time: '10:00',
            subject: defaultSubject || 'General',
            topic: currentTitle,
            batchId: selectedBatch,
            platform: 'YouTube Live',
            createdAt: new Date().toISOString(),
          };
          newLectures.push(lecture);
        });
      }

      if (newLectures.length === 0) {
        toast.error('No valid lecture data found');
        return;
      }

      const updatedLectures = [...liveLectures, ...newLectures];
      setLiveLectures(updatedLectures);
      localStorage.setItem('studyx_live_lectures', JSON.stringify(updatedLectures));
      
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

  const handleEdit = (lecture: LiveLecture) => {
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

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this live lecture?')) {
      const updatedLectures = liveLectures.filter(lecture => lecture.id !== id);
      setLiveLectures(updatedLectures);
      localStorage.setItem('studyx_live_lectures', JSON.stringify(updatedLectures));
      toast.success('Live lecture deleted successfully');
    }
  };

  const getBatchName = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  const formatDateTime = (date: string, time: string) => {
    return new Date(`${date}T${time}`).toLocaleString();
  };

  const isUpcoming = (date: string, time: string) => {
    const lectureDateTime = new Date(`${date}T${time}`);
    return lectureDateTime > new Date();
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="date" className="text-foreground">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-foreground">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="platform" className="text-foreground">Platform</Label>
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
                    <Label htmlFor="meetingUrl" className="text-foreground">Meeting URL *</Label>
                    <Input
                      id="meetingUrl"
                      value={formData.meetingUrl}
                      onChange={(e) => setFormData({...formData, meetingUrl: e.target.value})}
                      placeholder="Enter meeting/stream URL"
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
              <CardTitle className="text-foreground">All Live Lectures ({liveLectures.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Title</TableHead>
                    <TableHead className="text-foreground">Subject</TableHead>
                    <TableHead className="text-foreground">Batch</TableHead>
                    <TableHead className="text-foreground">Date & Time</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveLectures.map((lecture) => (
                    <TableRow key={lecture.id}>
                      <TableCell className="text-foreground font-medium">{lecture.title}</TableCell>
                      <TableCell className="text-foreground">{lecture.subject}</TableCell>
                      <TableCell className="text-foreground">{getBatchName(lecture.batchId)}</TableCell>
                      <TableCell className="text-foreground">
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
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <GraduationCap className="w-5 h-5" />
                <span>Bulk Upload Lectures</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="grade" className="text-foreground">Grade</Label>
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
                  <Label htmlFor="defaultSubject" className="text-foreground">Default Subject (optional)</Label>
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
                  <Label htmlFor="batch" className="text-foreground">Select Batch</Label>
                  <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a batch" />
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
                <Label htmlFor="bulkData" className="text-foreground">Paste Your Lecture Data</Label>
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
                disabled={!bulkData.trim() || !selectedBatch}
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
