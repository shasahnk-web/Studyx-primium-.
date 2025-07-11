
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function BulkUploadSection() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const processCsvUpload = async () => {
    if (!csvFile) {
      toast.error('Please select a CSV file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const text = await csvFile.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Simulate processing with progress
      const totalLines = lines.length - 1;
      let processed = 0;

      const lectures = [];
      const notes = [];
      const dpps = [];

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',').map(v => v.trim());
        const row: any = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index];
        });

        // Process based on type
        if (row.type === 'lecture') {
          lectures.push({
            id: Date.now().toString() + Math.random(),
            title: row.title || '',
            description: row.description || '',
            videoUrl: row.videoUrl || row.url || '',
            subject: row.subject || '',
            topic: row.topic || '',
            batchId: row.batchId || '',
            createdAt: new Date().toISOString(),
          });
        } else if (row.type === 'note') {
          notes.push({
            id: Date.now().toString() + Math.random(),
            title: row.title || '',
            description: row.description || '',
            pdfUrl: row.pdfUrl || row.url || '',
            subject: row.subject || '',
            lectureId: row.lectureId || '',
            batchId: row.batchId || '',
            createdAt: new Date().toISOString(),
          });
        } else if (row.type === 'dpp') {
          dpps.push({
            id: Date.now().toString() + Math.random(),
            title: row.title || '',
            description: row.description || '',
            pdfUrl: row.pdfUrl || row.url || '',
            subject: row.subject || '',
            lectureId: row.lectureId || '',
            batchId: row.batchId || '',
            createdAt: new Date().toISOString(),
          });
        }

        processed++;
        setUploadProgress((processed / totalLines) * 100);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Save to localStorage
      if (lectures.length > 0) {
        const existingLectures = JSON.parse(localStorage.getItem('studyx_lectures') || '[]');
        localStorage.setItem('studyx_lectures', JSON.stringify([...existingLectures, ...lectures]));
      }

      if (notes.length > 0) {
        const existingNotes = JSON.parse(localStorage.getItem('studyx_notes') || '[]');
        localStorage.setItem('studyx_notes', JSON.stringify([...existingNotes, ...notes]));
      }

      if (dpps.length > 0) {
        const existingDpps = JSON.parse(localStorage.getItem('studyx_dpps') || '[]');
        localStorage.setItem('studyx_dpps', JSON.stringify([...existingDpps, ...dpps]));
      }

      toast.success(`Bulk upload completed! ${lectures.length} lectures, ${notes.length} notes, ${dpps.length} DPPs uploaded.`);
      setCsvFile(null);
      setUploadProgress(0);
      
    } catch (error) {
      toast.error('Error processing CSV file. Please check the format.');
      console.error('CSV processing error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSampleCsv = () => {
    const sampleData = `type,title,description,url,subject,topic,batchId,lectureId
lecture,Introduction to Physics,Basic concepts of physics,https://youtube.com/watch?v=example,Physics,Mechanics,batch-1,
note,Physics Chapter 1 Notes,Detailed notes for chapter 1,https://drive.google.com/file/d/example,Physics,,batch-1,lecture-1
dpp,Physics DPP 1,Daily practice problems,https://drive.google.com/file/d/example,Physics,,batch-1,lecture-1`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_upload_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Bulk Upload</h1>
        <Button onClick={downloadSampleCsv} variant="outline" className="flex items-center space-x-2">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Download Sample CSV</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Upload className="w-5 h-5" />
            <span>CSV Bulk Upload</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">CSV Format Instructions</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>type:</strong> lecture, note, or dpp</li>
                  <li>• <strong>title:</strong> Title of the content</li>
                  <li>• <strong>description:</strong> Description (optional)</li>
                  <li>• <strong>url:</strong> Video URL for lectures, PDF URL for notes/DPPs</li>
                  <li>• <strong>subject:</strong> Subject name</li>
                  <li>• <strong>topic:</strong> Topic name (optional)</li>
                  <li>• <strong>batchId:</strong> Batch ID (required)</li>
                  <li>• <strong>lectureId:</strong> Lecture ID for notes/DPPs (optional)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="csvFile" className="text-foreground">Select CSV File</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                disabled={isUploading}
              />
            </div>

            {csvFile && (
              <div className="text-sm text-muted-foreground">
                Selected file: {csvFile.name} ({(csvFile.size / 1024).toFixed(2)} KB)
              </div>
            )}

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">Processing...</span>
                  <span className="text-muted-foreground">{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <Button 
              onClick={processCsvUpload}
              disabled={!csvFile || isUploading}
              className="w-full"
            >
              {isUploading ? 'Processing...' : 'Upload CSV'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">ZIP File Upload (Coming Soon)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>ZIP file upload with automatic mapping will be available soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
