import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { fetchBatches, type Batch } from '@/services/supabaseService';

interface BulkUploadProps {
  onUpdate: () => void;
}

const BulkUpload = ({ onUpdate }: BulkUploadProps) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [batchData, setBatchData] = useState('');
  const [lectureData, setLectureData] = useState('');
  const [noteData, setNoteData] = useState('');
  const [dppData, setDPPData] = useState('');

  // Load batches on component mount
  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setBatchesLoading(true);
      console.log('🔄 Loading batches for bulk upload...');
      const batchesData = await fetchBatches();
      console.log('✅ Loaded batches for bulk upload:', batchesData.length);
      setBatches(batchesData);
    } catch (error) {
      console.error('❌ Error loading batches:', error);
      toast.error('Failed to load batches. Please refresh the page.');
    } finally {
      setBatchesLoading(false);
    }
  };

  const batchTemplate = `[
  {
    "name": "JEE Main 2024 Batch",
    "description": "Complete preparation for JEE Main 2024",
    "subjects": ["Physics", "Chemistry", "Mathematics"],
    "image_url": "https://example.com/image.jpg",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "fee": "15000",
    "course_id": "pw-courses"
  }
]`;

  const lectureTemplate = `[
  {
    "title": "Physics Chapter 1 - Kinematics",
    "description": "Introduction to motion and kinematics concepts",
    "video_url": "https://youtube.com/watch?v=example",
    "subject": "Physics",
    "topic": "Kinematics",
    "batch_id": "select_batch_id_from_dropdown_below"
  }
]`;

  const noteTemplate = `[
  {
    "title": "Physics Chapter 1 Notes",
    "description": "Comprehensive notes on kinematics",
    "pdf_url": "https://example.com/notes.pdf",
    "subject": "Physics",
    "batch_id": "select_batch_id_from_dropdown_below"
  }
]`;

  const dppTemplate = `[
  {
    "title": "Physics Chapter 1 DPP",
    "description": "Daily practice problems for kinematics",
    "pdf_url": "https://example.com/dpp.pdf",
    "subject": "Physics",
    "batch_id": "select_batch_id_from_dropdown_below"
  }
]`;

  const handleBulkBatchUpload = () => {
    try {
      const batches = JSON.parse(batchData);
      
      if (!Array.isArray(batches)) {
        throw new Error('Data must be an array');
      }

      const existingBatches = JSON.parse(localStorage.getItem('studyx_batches') || '[]');
      const newBatches = batches.map(batch => ({
        ...batch,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      }));

      const updatedBatches = [...existingBatches, ...newBatches];
      localStorage.setItem('studyx_batches', JSON.stringify(updatedBatches));
      
      setBatchData('');
      onUpdate();
      toast.success(`${newBatches.length} batches uploaded successfully!`);
    } catch (error) {
      toast.error('Invalid JSON format. Please check your data.');
      console.error('Batch upload error:', error);
    }
  };

  const handleBulkLectureUpload = async () => {
    try {
      const lectures = JSON.parse(lectureData);
      
      if (!Array.isArray(lectures)) {
        throw new Error('Data must be an array');
      }

      // Validate that all lectures have valid batch_ids
      for (const lecture of lectures) {
        if (!lecture.batch_id) {
          toast.error('All lectures must have a batch_id. Please select from available batches.');
          return;
        }
        
        const batchExists = batches.find(batch => batch.id === lecture.batch_id);
        if (!batchExists) {
          toast.error(`Batch with ID "${lecture.batch_id}" not found. Please use valid batch IDs.`);
          return;
        }
      }

      // Use Supabase service to create lectures
      const { createLecture } = await import('@/services/supabaseService');
      
      let successCount = 0;
      let errorCount = 0;

      for (const lectureData of lectures) {
        const batch = batches.find(b => b.id === lectureData.batch_id);
        const lectureWithCourseId = {
          ...lectureData,
          course_id: batch?.course_id || 'pw-courses'
        };

        const created = await createLecture(lectureWithCourseId);
        if (created) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} lectures uploaded successfully!`);
        setLectureData('');
        onUpdate();
      }
      
      if (errorCount > 0) {
        toast.error(`${errorCount} lectures failed to upload.`);
      }
    } catch (error) {
      toast.error('Invalid JSON format. Please check your data.');
      console.error('Lecture upload error:', error);
    }
  };

  const handleBulkNoteUpload = () => {
    try {
      const notes = JSON.parse(noteData);
      
      if (!Array.isArray(notes)) {
        throw new Error('Data must be an array');
      }

      const existingNotes = JSON.parse(localStorage.getItem('studyx_notes') || '[]');
      const newNotes = notes.map(note => ({
        ...note,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      }));

      const updatedNotes = [...existingNotes, ...newNotes];
      localStorage.setItem('studyx_notes', JSON.stringify(updatedNotes));
      
      setNoteData('');
      onUpdate();
      toast.success(`${newNotes.length} notes uploaded successfully!`);
    } catch (error) {
      toast.error('Invalid JSON format. Please check your data.');
      console.error('Note upload error:', error);
    }
  };

  const handleBulkDPPUpload = () => {
    try {
      const dpps = JSON.parse(dppData);
      
      if (!Array.isArray(dpps)) {
        throw new Error('Data must be an array');
      }

      const existingDPPs = JSON.parse(localStorage.getItem('studyx_dpps') || '[]');
      const newDPPs = dpps.map(dpp => ({
        ...dpp,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      }));

      const updatedDPPs = [...existingDPPs, ...newDPPs];
      localStorage.setItem('studyx_dpps', JSON.stringify(updatedDPPs));
      
      setDPPData('');
      onUpdate();
      toast.success(`${newDPPs.length} DPPs uploaded successfully!`);
    } catch (error) {
      toast.error('Invalid JSON format. Please check your data.');
      console.error('DPP upload error:', error);
    }
  };

  // Available Batches Component
  const AvailableBatchesList = () => {
    if (batchesLoading) {
      return (
        <div className="flex items-center justify-center p-4">
          <Loader className="w-4 h-4 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Loading batches...</span>
        </div>
      );
    }

    if (batches.length === 0) {
      return (
        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-400">No Batches Available</h4>
              <p className="text-sm text-red-300">Please create batches first before uploading content.</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
        <h4 className="font-semibold text-blue-400 mb-2">Available Batches ({batches.length}):</h4>
        <div className="max-h-32 overflow-y-auto">
          <div className="grid grid-cols-1 gap-1 text-sm">
            {batches.map(batch => (
              <div key={batch.id} className="flex justify-between text-blue-300">
                <span className="font-mono text-xs truncate">{batch.id}</span>
                <span className="truncate ml-2">{batch.name}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-blue-300 mt-2">
          Copy the batch ID from above and use it in your JSON data.
        </p>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bulk Upload</h2>
      
      <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-400 mb-2">Important Notes:</h3>
            <ul className="text-sm text-blue-300 space-y-1">
              <li>• Data must be in valid JSON format</li>
              <li>• All required fields must be included</li>
              <li>• For content uploads, use valid batch IDs from the list below</li>
              <li>• Use the provided templates as reference</li>
            </ul>
          </div>
        </div>
      </div>

      <AvailableBatchesList />

      <Tabs defaultValue="batches" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="batches" className="data-[state=active]:bg-gray-700">
            Batches
          </TabsTrigger>
          <TabsTrigger value="lectures" className="data-[state=active]:bg-gray-700">
            Lectures
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-gray-700">
            Notes
          </TabsTrigger>
          <TabsTrigger value="dpps" className="data-[state=active]:bg-gray-700">
            DPPs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="batches" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Bulk Upload Batches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="batchTemplate">Template (JSON Format):</Label>
                <Textarea
                  id="batchTemplate"
                  value={batchTemplate}
                  readOnly
                  className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
                  rows={10}
                />
              </div>
              
              <div>
                <Label htmlFor="batchData">Paste Your Batch Data (JSON):</Label>
                <Textarea
                  id="batchData"
                  value={batchData}
                  onChange={(e) => setBatchData(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white font-mono"
                  rows={8}
                  placeholder="Paste your batch JSON data here..."
                />
              </div>
              
              <Button 
                onClick={handleBulkBatchUpload}
                disabled={!batchData.trim()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Batches
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lectures" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Bulk Upload Lectures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="lectureTemplate">Template (JSON Format):</Label>
                <Textarea
                  id="lectureTemplate"
                  value={lectureTemplate}
                  readOnly
                  className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
                  rows={10}
                />
              </div>
              
              <div>
                <Label htmlFor="lectureData">Paste Your Lecture Data (JSON):</Label>
                <Textarea
                  id="lectureData"
                  value={lectureData}
                  onChange={(e) => setLectureData(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white font-mono"
                  rows={8}
                  placeholder="Paste your lecture JSON data here..."
                />
              </div>
              
              <Button 
                onClick={handleBulkLectureUpload}
                disabled={!lectureData.trim() || batchesLoading}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {batchesLoading ? 'Loading Batches...' : 'Upload Lectures'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Bulk Upload Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="noteTemplate">Template (JSON Format):</Label>
                <Textarea
                  id="noteTemplate"
                  value={noteTemplate}
                  readOnly
                  className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
                  rows={8}
                />
              </div>
              
              <div>
                <Label htmlFor="noteData">Paste Your Note Data (JSON):</Label>
                <Textarea
                  id="noteData"
                  value={noteData}
                  onChange={(e) => setNoteData(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white font-mono"
                  rows={8}
                  placeholder="Paste your note JSON data here..."
                />
              </div>
              
              <Button 
                onClick={handleBulkNoteUpload}
                disabled={!noteData.trim()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Notes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dpps" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Bulk Upload DPPs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dppTemplate">Template (JSON Format):</Label>
                <Textarea
                  id="dppTemplate"
                  value={dppTemplate}
                  readOnly
                  className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
                  rows={8}
                />
              </div>
              
              <div>
                <Label htmlFor="dppData">Paste Your DPP Data (JSON):</Label>
                <Textarea
                  id="dppData"
                  value={dppData}
                  onChange={(e) => setDPPData(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white font-mono"
                  rows={8}
                  placeholder="Paste your DPP JSON data here..."
                />
              </div>
              
              <Button 
                onClick={handleBulkDPPUpload}
                disabled={!dppData.trim()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload DPPs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BulkUpload;
