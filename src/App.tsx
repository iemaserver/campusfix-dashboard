import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";
import ReportComplaint from "./pages/ReportComplaint";
import TrackComplaints from "./pages/TrackComplaints";
import ComplaintDetails from "./pages/ComplaintDetails";
import AdminDashboard from "./pages/AdminDashboard";
import ClerkTasks from "./pages/ClerkTasks";
import AppLayout from "./layout/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/report" element={<ReportComplaint />} />
            <Route path="/track" element={<TrackComplaints />} />
            <Route path="/complaints/:id" element={<ComplaintDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/clerk" element={<ClerkTasks />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
