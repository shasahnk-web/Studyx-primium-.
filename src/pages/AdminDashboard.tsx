
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Plus, BookOpen, FileText, Video, Upload } from 'lucide-react';
import { toast } from 'sonner';
import BatchManager from '@/components/admin/BatchManager';
import ContentManager from '@/components/admin/ContentManager';
import BulkUpload from '@/components/admin/BulkUpload';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    batches: 0,
    lectures: 0,
    notes: 0,
    dpps: 0
  });

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('studyx_admin_auth');
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    // Load stats
    updateStats();
  }, [navigate]);

  const updateStats = () => {
    const batches = JSON.parse(localStorage.getItem('studyx_batches') || '[]');
    const lectures = JSON.parse(localStorage.getItem('studyx_lectures') || '[]');
    const notes = JSON.parse(localStorage.getItem('studyx_notes') || '[]');
    const dpps = JSON.parse(localStorage.getItem('studyx_dpps') || '[]');

    setStats({
      batches: batches.length,
      lectures: lectures.length,
      notes: notes.length,
      dpps: dpps.length
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('studyx_admin_auth');
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-bold">Study Pro Max Admin</span>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Batches</p>
                  <p className="text-2xl font-bold">{stats.batches}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Lectures</p>
                  <p className="text-2xl font-bold">{stats.lectures}</p>
                </div>
                <Video className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Notes</p>
                  <p className="text-2xl font-bold">{stats.notes}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total DPPs</p>
                  <p className="text-2xl font-bold">{stats.dpps}</p>
                </div>
                <Upload className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="batches" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="batches" className="data-[state=active]:bg-gray-700">
              Batch Management
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-gray-700">
              Content Management
            </TabsTrigger>
            <TabsTrigger value="bulk" className="data-[state=active]:bg-gray-700">
              Bulk Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="batches" className="mt-6">
            <BatchManager onUpdate={updateStats} />
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <ContentManager onUpdate={updateStats} />
          </TabsContent>

          <TabsContent value="bulk" className="mt-6">
            <BulkUpload onUpdate={updateStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
