
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Video, FileText, BookOpen, Calendar, Users } from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBatches: 0,
    totalLectures: 0,
    totalNotes: 0,
    totalDPPs: 0,
    upcomingLectures: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    const batches = JSON.parse(localStorage.getItem('studyx_batches') || '[]');
    const lectures = JSON.parse(localStorage.getItem('studyx_lectures') || '[]');
    const notes = JSON.parse(localStorage.getItem('studyx_notes') || '[]');
    const dpps = JSON.parse(localStorage.getItem('studyx_dpps') || '[]');
    const liveLectures = JSON.parse(localStorage.getItem('studyx_live_lectures') || '[]');
    
    const upcoming = liveLectures.filter((lecture: any) => {
      const lectureDate = new Date(lecture.date + 'T' + lecture.time);
      return lectureDate > new Date();
    });

    setStats({
      totalBatches: batches.length,
      totalLectures: lectures.length,
      totalNotes: notes.length,
      totalDPPs: dpps.length,
      upcomingLectures: upcoming.length,
      totalStudents: batches.reduce((sum: number, batch: any) => sum + (batch.enrolledCount || 0), 0),
    });
  }, []);

  const statCards = [
    { title: 'Total Batches', value: stats.totalBatches, icon: Users, color: 'text-blue-600' },
    { title: 'Total Lectures', value: stats.totalLectures, icon: Video, color: 'text-green-600' },
    { title: 'Total Notes', value: stats.totalNotes, icon: FileText, color: 'text-purple-600' },
    { title: 'Total DPPs', value: stats.totalDPPs, icon: BookOpen, color: 'text-orange-600' },
    { title: 'Upcoming Live', value: stats.upcomingLectures, icon: Calendar, color: 'text-red-600' },
    { title: 'Total Students', value: stats.totalStudents, icon: BarChart3, color: 'text-indigo-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to StudyX Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Video className="h-4 w-4 text-green-600" />
                <span className="text-sm text-foreground">New lecture uploaded: Physics Chapter 1</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-foreground">Batch "JEE Main 2024" created</span>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-foreground">Notes uploaded for Chemistry</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Server Status</span>
                <span className="text-sm text-green-600 font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Database</span>
                <span className="text-sm text-green-600 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Storage</span>
                <span className="text-sm text-green-600 font-medium">Available</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
