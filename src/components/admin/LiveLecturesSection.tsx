import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Calendar, Clock, Upload, GraduationCap, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { fetchBatches, type Batch, fetchLiveLectures, createLiveLecture, updateLiveLecture, deleteLiveLecture } from '@/services/supabaseService';

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
  batchName: string;
  platform: string;
}

export function LiveLecturesSection() {
  const [state, setState] = useState({
    liveLectures: [] as UILiveLecture[],
    batches: [] as Batch[],
    loadingBatches: true,
    batchError: null as string | null,
    showForm: false,
    editingLecture: null as UILiveLecture | null,
    formData: {
      title: '', description: '', meetingUrl: '', date: '', time: '',
      subject: '', topic: '', batchId: '', platform: ''
    },
    bulkData: '', selectedGrade: '', defaultSubject: '', selectedBatch: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await loadBatchesFromSupabase();
    await loadLiveLecturesFromSupabase();
  };

  const loadBatchesFromSupabase = async () => {
    try {
      setState(s => ({...s, loadingBatches: true, batchError: null}));
      const batchesData = await fetchBatches();
      setState(s => ({...s, batches: batchesData, loadingBatches: false}));
    } catch (error) {
      setState(s => ({...s, batchError: 'Failed to load batches', loadingBatches: false}));
      toast.error('Failed to load batches');
    }
  };

  const loadLiveLecturesFromSupabase = async () => {
    try {
      const liveLecturesData = await fetchLiveLectures();
      const transformedLectures = liveLecturesData.map(lecture => ({
        id: lecture.id,
        title: lecture.title,
        description: lecture.description || '',
        meetingUrl: lecture.meeting_url,
        date: lecture.live_date,
        time: lecture.live_time,
        subject: lecture.subject || '',
        topic: lecture.topic || '',
        batchId: lecture.batch_id || '',
        batchName: state.batches.find(b => b.id === lecture.batch_id)?.name || 'Unknown Batch',
        platform: lecture.platform || 'YouTube Live'
      }));
      setState(s => ({...s, liveLectures: transformedLectures}));
    } catch (error) {
      toast.error('Failed to load live lectures');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { formData, editingLecture, batches } = state;
    
    if (!formData.title || !formData.meetingUrl || !formData.date || 
        !formData.time || !formData.subject || !formData.batchId) {
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
        platform: formData.platform
      };

      editingLecture 
        ? await updateLiveLecture(editingLecture.id, lectureData)
        : await createLiveLecture(lectureData);

      await loadLiveLecturesFromSupabase();
      resetForm();
      toast.success(`Live lecture ${editingLecture ? 'updated' : 'created'} successfully`);
    } catch (error) {
      toast.error('Failed to save live lecture');
    }
  };

  const handleBulkUpload = async () => {
    const { bulkData, selectedBatch, defaultSubject } = state;
    if (!bulkData.trim() || !selectedBatch) {
      toast.error('Please enter lecture data and select a batch');
      return;
    }

    try {
      const lines = bulkData.trim().split('\n');
      let currentTitle = '', currentLinks: string[] = [];
      const newLectures = [];

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        if (!trimmedLine.startsWith('http')) {
          await processLinks(currentTitle, currentLinks, newLectures);
          currentTitle = trimmedLine;
          currentLinks = [];
        } else {
          currentLinks.push(trimmedLine);
        }
      }
      await processLinks(currentTitle, currentLinks, newLectures);

      if (newLectures.length === 0) {
        toast.error('No valid lecture data found');
        return;
      }

      await loadLiveLecturesFromSupabase();
      setState(s => ({...s, bulkData: '', selectedGrade: '', defaultSubject: '', selectedBatch: ''}));
      toast.success(`${newLectures.length} lectures uploaded successfully!`);
    } catch (error) {
      toast.error('Error processing bulk data');
    }
  };

  const processLinks = async (title: string, links: string[], newLectures: any[]) => {
    if (!title || links.length === 0) return;
    const { selectedBatch, defaultSubject } = state;

    for (let i = 0; i < links.length; i++) {
      const lectureData = {
        title: `${title} - Lecture ${i + 1}`,
        description: `Live lecture for ${title}`,
        meeting_url: links[i],
        live_date: new Date().toISOString().split('T')[0],
        live_time: '10:00',
        subject: defaultSubject || 'General',
        topic: title,
        batch_id: selectedBatch,
        platform: 'YouTube Live'
      };
      const created = await createLiveLecture(lectureData);
      if (created) newLectures.push(created);
    }
  };

  const resetForm = () => setState(s => ({
    ...s, 
    showForm: false, 
    editingLecture: null,
    formData: {
      title: '', description: '', meetingUrl: '', date: '', time: '',
      subject: '', topic: '', batchId: '', platform: ''
    }
  }));

  const handleEdit = (lecture: UILiveLecture) => setState(s => ({
    ...s,
    showForm: true,
    editingLecture: lecture,
    formData: {
      title: lecture.title,
      description: lecture.description,
      meetingUrl: lecture.meetingUrl,
      date: lecture.date,
      time: lecture.time,
      subject: lecture.subject,
      topic: lecture.topic,
      batchId: lecture.batchId,
      platform: lecture.platform
    }
  }));

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this live lecture?')) {
      try {
        await deleteLiveLecture(id);
        await loadLiveLecturesFromSupabase();
        toast.success('Live lecture deleted successfully');
      } catch (error) {
        toast.error('Failed to delete live lecture');
      }
    }
  };

  const formatDateTime = (date: string, time: string) => new Date(`${date}T${time}`).toLocaleString();
  const isUpcoming = (date: string, time: string) => new Date(`${date}T${time}`) > new Date();

  const renderBatchSelect = (value: string, onValueChange: (value: string) => void, placeholder: string) => {
    const { loadingBatches, batchError, batches } = state;

    if (loadingBatches) return (
      <div className="flex items-center space-x-2 p-2 border rounded">
        <Loader className="w-4 h-4 animate-spin" />
        <span className="text-sm text-gray-500">Loading batches...</span>
      </div>
    );

    if (batchError) return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2 p-2 border border-red-300 rounded bg-red-50 text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{batchError}</span>
        </div>
        <Button variant="outline" size="sm" onClick={loadBatchesFromSupabase}>
          Retry Loading Batches
        </Button>
      </div>
    );

    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={batches.length ? placeholder : "No batches available"} />
        </SelectTrigger>
        {batches.length > 0 && (
          <SelectContent>
            {batches.map(batch => (
              <SelectItem key={batch.id} value={batch.id}>
                {batch.name} {batch.subjects?.length > 0 && `(${batch.subjects.join(', ')})`}
              </SelectItem>
            ))}
          </SelectContent>
        )}
      </Select>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Live Lectures Management</h1>
        <Button onClick={() => setState(s => ({...s, showForm: true}))}>
          <Plus className="w-4 h-4 mr-2" /> Add Live Lecture
        </Button>
      </div>

      <Tabs defaultValue="manage">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manage">Manage Lectures</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          {state.showForm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{state.editingLecture ? 'Edit Live Lecture' : 'Add New Live Lecture'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Title *</Label>
                      <Input value={state.formData.title} onChange={e => setState(s => ({...s, formData: {...s.formData, title: e.target.value}}))} required />
                    </div>
                    <div>
                      <Label>Subject *</Label>
                      <Select value={state.formData.subject} onValueChange={v => setState(s => ({...s, formData: {...s.formData, subject: v}}))}>
                        <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                        <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Topic</Label>
                      <Input value={state.formData.topic} onChange={e => setState(s => ({...s, formData: {...s.formData, topic: e.target.value}}))} />
                    </div>
                    <div>
                      <Label>Batch *</Label>
                      {renderBatchSelect(state.formData.batchId, v => setState(s => ({...s, formData: {...s.formData, batchId: v}}), "Select batch")}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Date *</Label>
                      <Input type="date" value={state.formData.date} onChange={e => setState(s => ({...s, formData: {...s.formData, date: e.target.value}}))} required />
                    </div>
                    <div>
                      <Label>Time *</Label>
                      <Input type="time" value={state.formData.time} onChange={e => setState(s => ({...s, formData: {...s.formData, time: e.target.value}}))} required />
                    </div>
                    <div>
                      <Label>Platform</Label>
                      <Select value={state.formData.platform} onValueChange={v => setState(s => ({...s, formData: {...s.formData, platform: v}}))}>
                        <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                        <SelectContent>{platforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Meeting URL *</Label>
                    <Input value={state.formData.meetingUrl} onChange={e => setState(s => ({...s, formData: {...s.formData, meetingUrl: e.target.value}}))} required />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea value={state.formData.description} onChange={e => setState(s => ({...s, formData: {...s.formData, description: e.target.value}}))} rows={3} />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit">{state.editingLecture ? 'Update' : 'Add'} Live Lecture</Button>
                    <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>All Live Lectures ({state.liveLectures.length})</CardTitle></CardHeader>
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
                  {state.liveLectures.map(lecture => (
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
                          isUpcoming(lecture.date, lecture.time) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isUpcoming(lecture.date, lecture.time) ? 'Upcoming' : 'Past'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(lecture)}><Edit className="w-4 h-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(lecture.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {state.liveLectures.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No live lectures found</div>
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
                  <Label>Grade</Label>
                  <Select value={state.selectedGrade} onValueChange={v => setState(s => ({...s, selectedGrade: v}))}>
                    <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                    <SelectContent>{grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Default Subject</Label>
                  <Select value={state.defaultSubject} onValueChange={v => setState(s => ({...s, defaultSubject: v}))}>
                    <SelectTrigger><SelectValue placeholder="Auto-detect" /></SelectTrigger>
                    <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Select Batch *</Label>
                  {renderBatchSelect(state.selectedBatch, v => setState(s => ({...s, selectedBatch: v})), "Choose batch")}
                </div>
              </div>

              <div>
                <Label>Paste Your Lecture Data</Label>
                <Textarea
                  value={state.bulkData}
                  onChange={e => setState(s => ({...s, bulkData: e.target.value}))}
                  placeholder="Example format:\nTitle\nhttps://link1.com\nhttps://link2.com"
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <Button 
                onClick={handleBulkUpload}
                disabled={!state.bulkData.trim() || !state.selectedBatch}
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
