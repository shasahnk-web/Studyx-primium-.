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
    const isCompleted = localStorage.getItem('preHomepageCompleted') === 'true';
    setPreHomepageCompleted(isCompleted);
    setIsLoading(false);
  }, []);

  // Function to mark PreHomepage as completed
  const completePreHomepage = () => {
    localStorage.setItem('preHomepageCompleted', 'true');
    setPreHomepageCompleted(true);
  };

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
            {/* Root path - Show PreHomepage if not completed, else redirect to /home */}
            <Route
              path="/"
              element={
                !preHomepageCompleted ? (
                  <PreHomepage onComplete={completePreHomepage} />
                ) : (
                  <Navigate to="/home" replace />
                )
              }
            />

            {/* Protected routes - Only accessible after PreHomepage completion */}
            <Route
              path="/home"
              element={
                !preHomepageCompleted ? (
                  <Navigate to="/" replace />
                ) : (
                  <Index />
                )
              }
            />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/courses/:courseId" element={<CoursePage />} />
            <Route path="/batch/:batchId" element={<BatchPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/panel" element={<AdminPanel />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
