import { useState } from "react";
import { 
  Stethoscope, 
  Calendar, 
  Phone, 
  AlertTriangle, 
  Heart,
  Brain,
  Activity,
  ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SymptomChecker } from "./SymptomChecker";
import { AppointmentScheduler } from "./AppointmentScheduler";
import { EmergencyInfo } from "./EmergencyInfo";

export const MedicalSidebar = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const menuItems = [
    {
      title: "Symptom Checker",
      icon: Stethoscope,
      id: "symptoms",
      description: "Analyze your symptoms",
      color: "text-blue-600"
    },
    {
      title: "Schedule Appointment",
      icon: Calendar,
      id: "appointments",
      description: "Book with healthcare providers",
      color: "text-green-600"
    },
    {
      title: "Emergency Help",
      icon: Phone,
      id: "emergency",
      description: "Urgent medical contacts",
      color: "text-red-600"
    }
  ];

  const quickHealthTips = [
    { icon: Heart, tip: "Stay hydrated - drink 8 glasses of water daily", color: "text-red-500" },
    { icon: Brain, tip: "Get 7-9 hours of quality sleep", color: "text-purple-500" },
    { icon: Activity, tip: "Exercise for 30 minutes daily", color: "text-green-500" }
  ];

  return (
    <Sidebar className="w-80 border-r bg-card shadow-soft">
      <SidebarContent className="p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-medical rounded-lg shadow-glow">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Health Tools</h2>
              <p className="text-xs text-muted-foreground">Your medical assistant</p>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-foreground mb-3">
            Medical Services
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(activeSection === item.id ? null : item.id)}
                    className={`w-full p-3 rounded-lg border transition-all hover:shadow-soft ${
                      activeSection === item.id 
                        ? 'bg-primary/10 border-primary/20 shadow-medical' 
                        : 'bg-card hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm text-foreground">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${
                        activeSection === item.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Active Section Content */}
        {activeSection && (
          <div className="mt-6">
            {activeSection === "symptoms" && <SymptomChecker />}
            {activeSection === "appointments" && <AppointmentScheduler />}
            {activeSection === "emergency" && <EmergencyInfo />}
          </div>
        )}

        {/* Health Tips */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-sm font-medium text-foreground mb-3">
            Daily Health Tips
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3">
              {quickHealthTips.map((tip, index) => (
                <Card key={index} className="border-l-4 border-l-primary/30 shadow-soft">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <tip.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tip.color}`} />
                      <p className="text-xs text-muted-foreground leading-relaxed">{tip.tip}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Emergency Banner */}
        <Card className="mt-6 border-emergency/20 bg-gradient-emergency shadow-soft">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-white mx-auto mb-2" />
            <p className="text-sm font-medium text-white mb-2">Medical Emergency?</p>
            <Button 
              size="sm" 
              className="bg-white/20 hover:bg-white/30 text-white border-white/20"
            >
              Call 911 Now
            </Button>
          </CardContent>
        </Card>
      </SidebarContent>
    </Sidebar>
  );
};