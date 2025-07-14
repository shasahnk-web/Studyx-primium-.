
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import CoursePage from "./pages/CoursePage";
import BatchPage from "./pages/BatchPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import Homepage from "./pages/Homepage";
import PreHomepage from "./pages/PreHomepage";

const queryClient = new QueryClient();

const App = () => {
  const [preHomepageCompleted, setPreHomepageCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has completed the pre-homepage
    const preHomepageComplete = localStorage.getItem('preHomepageCompleted') === 'true';
    setPreHomepageCompleted(preHomepageComplete);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Pre-homepage - shows first */}
            <Route 
              path="/pre-homepage" 
              element={<PreHomepage />} 
            />
            
            {/* Protected routes - only accessible after pre-homepage completion */}
            <Route 
              path="/home" 
              element={
                !preHomepageCompleted ? <Navigate to="/pre-homepage" replace /> :
                <Index />
              } 
            />
            <Route 
              path="/homepage" 
              element={
                !preHomepageCompleted ? <Navigate to="/pre-homepage" replace /> :
                <Homepage />
              } 
            />
            <Route 
              path="/courses/:courseId" 
              element={
                !preHomepageCompleted ? <Navigate to="/pre-homepage" replace /> :
                <CoursePage />
              } 
            />
            <Route 
              path="/batch/:batchId" 
              element={
                !preHomepageCompleted ? <Navigate to="/pre-homepage" replace /> :
                <BatchPage />
              } 
            />
            <Route 
              path="/admin" 
              element={
                !preHomepageCompleted ? <Navigate to="/pre-homepage" replace /> :
                <AdminLogin />
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                !preHomepageCompleted ? <Navigate to="/pre-homepage" replace /> :
                <AdminDashboard />
              } 
            />
            <Route 
              path="/admin/panel" 
              element={
                !preHomepageCompleted ? <Navigate to="/pre-homepage" replace /> :
                <AdminPanel />
              } 
            />
            
            {/* Root path - redirect based on completion status */}
            <Route 
              path="/" 
              element={
                !preHomepageCompleted ? <Navigate to="/pre-homepage" replace /> :
                <Navigate to="/home" replace />
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
