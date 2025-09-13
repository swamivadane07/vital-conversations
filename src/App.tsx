import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Doctors from "./pages/Doctors";
import LabTests from "./pages/LabTests";
import HealthDashboard from "./pages/HealthDashboard";
import AdvancedSearch from "./pages/AdvancedSearch";
import VoiceInput from "./pages/VoiceInput";
import AIAnalysis from "./pages/AIAnalysis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Chat />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="lab-tests" element={<LabTests />} />
            <Route path="health-dashboard" element={<HealthDashboard />} />
            <Route path="advanced-search" element={<AdvancedSearch />} />
            <Route path="voice-input" element={<VoiceInput />} />
            <Route path="ai-analysis" element={<AIAnalysis />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
