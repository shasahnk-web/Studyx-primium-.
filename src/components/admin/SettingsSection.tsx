
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Lock, Upload, Palette } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [siteLogoUrl, setSiteLogoUrl] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentPassword !== '5355') {
      toast.error('Current password is incorrect');
      return;
    }

    if (newPassword.length < 4) {
      toast.error('New password must be at least 4 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    // In a real app, this would be handled securely on the backend
    localStorage.setItem('studyx_admin_password', newPassword);
    toast.success('Password changed successfully');
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogoUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!siteLogoUrl) {
      toast.error('Please enter a logo URL');
      return;
    }

    localStorage.setItem('studyx_site_logo', siteLogoUrl);
    toast.success('Site logo updated successfully');
  };

  const exportData = () => {
    const data = {
      batches: JSON.parse(localStorage.getItem('studyx_batches') || '[]'),
      lectures: JSON.parse(localStorage.getItem('studyx_lectures') || '[]'),
      notes: JSON.parse(localStorage.getItem('studyx_notes') || '[]'),
      dpps: JSON.parse(localStorage.getItem('studyx_dpps') || '[]'),
      liveLectures: JSON.parse(localStorage.getItem('studyx_live_lectures') || '[]'),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studyx_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('studyx_batches');
      localStorage.removeItem('studyx_lectures');
      localStorage.removeItem('studyx_notes');
      localStorage.removeItem('studyx_dpps');
      localStorage.removeItem('studyx_live_lectures');
      
      toast.success('All data cleared successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <Lock className="w-5 h-5" />
              <span>Change Admin Password</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-foreground">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-foreground">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <Upload className="w-5 h-5" />
              <span>Site Logo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogoUpdate} className="space-y-4">
              <div>
                <Label htmlFor="logoUrl" className="text-foreground">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={siteLogoUrl}
                  onChange={(e) => setSiteLogoUrl(e.target.value)}
                  placeholder="Enter logo image URL"
                />
              </div>
              <Button type="submit" className="w-full">
                Update Logo
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Settings className="w-5 h-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={exportData} variant="outline" className="w-full">
              Export All Data
            </Button>
            <Button onClick={clearAllData} variant="destructive" className="w-full">
              Clear All Data
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Export your data as a backup or clear all data to start fresh. Clearing data cannot be undone.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Palette className="w-5 h-5" />
            <span>Default Subjects</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Current subjects: Maths, Chemistry, Biology, Physics, Hindi, English, IT, Sanskrit, SST
            </p>
            <p className="text-sm text-muted-foreground">
              Subject customization will be available in a future update.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
