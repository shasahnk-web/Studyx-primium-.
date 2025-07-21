import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { VerificationHandler } from "./components/VerificationHandler";
import { VerifyPage } from "./components/VerifyPage";
import { PrivateRoute } from "./components/PrivateRoute";
import { isVerified } from "./utils/auth";
import Index from "./pages/Index";
import CoursePage from "./pages/CoursePage";
import BatchPage from "./pages/BatchPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import Homepage from "./pages/Homepage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public verification routes */}
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/set-verified" element={<VerificationHandler />} />
            
            {/* Protected routes - everything else requires verification */}
            <Route element={<PrivateRoute>
              <Routes>
                {/* Main application routes */}
                <Route path="/home" element={<Index />} />
                <Route path="/homepage" element={<Homepage />} />
                <Route path="/courses/:courseId" element={<CoursePage />} />
                <Route path="/batch/:batchId" element={<BatchPage />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/panel" element={<AdminPanel />} />
              </Routes>
            </PrivateRoute>} />
            
            {/* Root path redirect */}
            <Route path="/" element={<Navigate to={isVerified() ? "/home" : "/verify"} replace />} />
            
            {/* Catch-all route - redirect unmatched routes to verify */}
            <Route path="*" element={<Navigate to="/verify" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
