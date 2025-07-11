
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { LecturesSection } from '@/components/admin/LecturesSection';
import { NotesSection } from '@/components/admin/NotesSection';
import { DPPSection } from '@/components/admin/DPPSection';
import { BulkUploadSection } from '@/components/admin/BulkUploadSection';
import { LiveLecturesSection } from '@/components/admin/LiveLecturesSection';
import { BatchesSection } from '@/components/admin/BatchesSection';
import { SettingsSection } from '@/components/admin/SettingsSection';
import { SidebarProvider } from '@/components/ui/sidebar';

export type AdminSection = 'dashboard' | 'lectures' | 'notes' | 'dpp' | 'bulk' | 'live' | 'batches' | 'settings';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('studyx_admin_auth');
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
  }, [navigate]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'lectures':
        return <LecturesSection />;
      case 'notes':
        return <NotesSection />;
      case 'dpp':
        return <DPPSection />;
      case 'bulk':
        return <BulkUploadSection />;
      case 'live':
        return <LiveLecturesSection />;
      case 'batches':
        return <BatchesSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
        />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;
