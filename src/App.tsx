
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
import GatePage from "./pages/GatePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [gateCompleted, setGateCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has completed the gate
    const completed = localStorage.getItem('gateCompleted') === 'true';
    setGateCompleted(completed);
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
            {/* Gate page - always accessible */}
            <Route path="/gate" element={<GatePage />} />
            
            {/* Protected routes - only accessible after gate completion */}
            <Route 
              path="/home" 
              element={gateCompleted ? <Index /> : <Navigate to="/gate" replace />} 
            />
            <Route 
              path="/courses/:courseId" 
              element={gateCompleted ? <CoursePage /> : <Navigate to="/gate" replace />} 
            />
            <Route 
              path="/batch/:batchId" 
              element={gateCompleted ? <BatchPage /> : <Navigate to="/gate" replace />} 
            />
            <Route 
              path="/admin" 
              element={gateCompleted ? <AdminLogin /> : <Navigate to="/gate" replace />} 
            />
            <Route 
              path="/admin/dashboard" 
              element={gateCompleted ? <AdminDashboard /> : <Navigate to="/gate" replace />} 
            />
            <Route 
              path="/admin/panel" 
              element={gateCompleted ? <AdminPanel /> : <Navigate to="/gate" replace />} 
            />
            
            {/* Root path - redirect based on gate completion */}
            <Route 
              path="/" 
              element={gateCompleted ? <Navigate to="/home" replace /> : <Navigate to="/gate" replace />} 
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
