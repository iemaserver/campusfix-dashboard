import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";
import ReportComplaint from "./pages/ReportComplaint";
import TrackComplaints from "./pages/TrackComplaints";
import ComplaintDetails from "./pages/ComplaintDetails";
import AdminDashboard from "./pages/AdminDashboard";
import WelcomePage from "./pages/WelcomePage";
import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";
import ManagerLogin from "./pages/ManagerLogin";

import AppLayout from "./layout/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Guard: redirect to welcome if no student session
const RequireStudent = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('student_user');
  return user ? <>{children}</> : <Navigate to="/welcome" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public auth routes (no navbar) */}
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/student-register" element={<StudentRegister />} />
          <Route path="/manager-login" element={<ManagerLogin />} />

          {/* App routes (with navbar) */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<RequireStudent><StudentDashboard /></RequireStudent>} />
            <Route path="/report" element={<RequireStudent><ReportComplaint /></RequireStudent>} />
            <Route path="/track" element={<RequireStudent><TrackComplaints /></RequireStudent>} />
            <Route path="/complaints/:id" element={<RequireStudent><ComplaintDetails /></RequireStudent>} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
