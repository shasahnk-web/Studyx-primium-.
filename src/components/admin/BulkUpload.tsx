
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BulkUploadProps {
  onUpdate: () => void;
}

const BulkUpload = ({ onUpdate }: BulkUploadProps) => {
  const [batchData, setBatchData] = useState('');
  const [lectureData, setLectureData] = useState('');
  const [noteData, setNoteData] = useState('');
  const [dppData, setDPPData] = useState('');

  const batchTemplate = `[
  {
    "name": "JEE Main 2024 Batch",
    "description": "Complete preparation for JEE Main 2024",
    "subjects": ["Physics", "Chemistry", "Mathematics"],
    "image": "https://example.com/image.jpg",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "fee": "15000",
    "courseId": "pw-courses"
  }
]`;

  const lectureTemplate = `[
  {
    "title": "Physics Chapter 1 - Kinematics",
    "videoLink": "https://youtube.com/watch?v=example",
    "batchId": "batch_id_here"
  }
]`;

  const noteTemplate = `[
  {
    "title": "Physics Chapter 1 Notes",
    "pdfLink": "https://example.com/notes.pdf",
    "batchId": "batch_id_here"
  }
]`;

  const dppTemplate = `[
  {
    "title": "Physics Chapter 1 DPP",
    "pdfLink": "https://example.com/dpp.pdf",
    "batchId": "batch_id_here"
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

  const handleBulkLectureUpload = () => {
    try {
      const lectures = JSON.parse(lectureData);
      
      if (!Array.isArray(lectures)) {
        throw new Error('Data must be an array');
      }

      const existingLectures = JSON.parse(localStorage.getItem('studyx_lectures') || '[]');
      const newLectures = lectures.map(lecture => ({
        ...lecture,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      }));

      const updatedLectures = [...existingLectures, ...newLectures];
      localStorage.setItem('studyx_lectures', JSON.stringify(updatedLectures));
      
      setLectureData('');
      onUpdate();
      toast.success(`${newLectures.length} lectures uploaded successfully!`);
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
              <li>• For content uploads, make sure batch IDs exist</li>
              <li>• Use the provided templates as reference</li>
            </ul>
          </div>
        </div>
      </div>

      <Tabs defaultValue="batches" className="w-full">
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
                  rows={8}
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
                disabled={!lectureData.trim()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Lectures
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
