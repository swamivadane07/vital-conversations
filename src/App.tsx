import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WelcomePopup } from "@/components/auth/WelcomePopup";

import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import Doctors from "./pages/Doctors";
import LabTests from "./pages/LabTests";
import HealthDashboard from "./pages/HealthDashboard";
import AdvancedSearch from "./pages/AdvancedSearch";
import VoiceInput from "./pages/VoiceInput";
import AIAnalysis from "./pages/AIAnalysis";
import MedicalRecords from "./pages/MedicalRecords";
import NotFound from "./pages/NotFound";
import Pharmacy from "./pages/Pharmacy";
import PrescriptionUpload from "./pages/pharmacy/PrescriptionUpload";
import MedicineCatalog from "./pages/pharmacy/MedicineCatalog";
import PharmacyCart from "./pages/pharmacy/PharmacyCart";
import PharmacyCheckout from "./pages/pharmacy/PharmacyCheckout";
import OrderTracking from "./pages/pharmacy/OrderTracking";
import OrderHistory from "./pages/pharmacy/OrderHistory";
import PharmacyProfile from "./pages/pharmacy/PharmacyProfile";
import PharmacyDashboard from "./pages/pharmacy/PharmacyDashboard";
import OnlineStore from "./pages/OnlineStore";
import QuickActionsPage from "./pages/QuickActions";

const queryClient = new QueryClient();

// Component to handle welcome popup
const AppWithPopup = () => {
  const { showWelcomePopup, setShowWelcomePopup } = useAuth();
  
  return (
    <>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<Chat />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="lab-tests" element={<LabTests />} />
          <Route path="health-dashboard" element={<HealthDashboard />} />
          <Route path="advanced-search" element={<AdvancedSearch />} />
          <Route path="voice-input" element={<VoiceInput />} />
          <Route path="ai-analysis" element={<AIAnalysis />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="pharmacy" element={<PharmacyDashboard />} />
          <Route path="pharmacy/upload-prescription" element={<PrescriptionUpload />} />
          <Route path="pharmacy/catalog" element={<MedicineCatalog />} />
          <Route path="pharmacy/cart" element={<PharmacyCart />} />
          <Route path="pharmacy/checkout" element={<PharmacyCheckout />} />
          <Route path="pharmacy/track" element={<OrderTracking />} />
          <Route path="pharmacy/orders" element={<OrderHistory />} />
          <Route path="pharmacy/profile" element={<PharmacyProfile />} />
          <Route path="online-store" element={<OnlineStore />} />
          <Route path="quick-actions" element={<QuickActionsPage />} />
        </Route>
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Welcome Popup */}
      <WelcomePopup 
        isVisible={showWelcomePopup} 
        onClose={() => setShowWelcomePopup(false)} 
      />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppWithPopup />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
