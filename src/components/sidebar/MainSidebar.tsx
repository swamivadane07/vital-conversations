import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Stethoscope, 
  MessageCircle, 
  Users, 
  TestTube, 
  Calendar, 
  Phone, 
  AlertTriangle, 
  Heart,
  Brain,
  Activity,
  Home,
  Search,
  Mic,
  Zap,
  Pill,
  Store,
  Gauge
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/LogoutButton";

export const MainSidebar = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const location = useLocation();

  const navigationItems = [
    {
      title: "AI Chat",
      icon: MessageCircle,
      path: "/",
      description: "Medical AI Assistant"
    },
    {
      title: "Quick Actions",
      icon: Gauge,
      path: "/quick-actions",
      description: "Essential health services & emergency contacts"
    },
    {
      title: "Health Dashboard",
      icon: Activity,
      path: "/health-dashboard",
      description: "Advanced health insights"
    },
    {
      title: "Find Doctors",
      icon: Users,
      path: "/doctors",
      description: "Online consultations"
    },
    {
      title: "Lab Tests",
      icon: TestTube,
      path: "/lab-tests",
      description: "Book diagnostic tests"
    },
    {
      title: "Pharmacy",
      icon: Pill,
      path: "/pharmacy",
      description: "Online medicine delivery"
    },
    {
      title: "Online Store",
      icon: Store,
      path: "/online-store",
      description: "Browse medicine catalog"
    }
  ];

  const advancedFeatures = [
    {
      title: "Advanced Search",
      icon: Search,
      path: "/advanced-search",
      description: "Powerful search with filters"
    },
    {
      title: "Voice Input",
      icon: Mic,
      path: "/voice-input",
      description: "Voice symptom analysis"
    },
    {
      title: "AI Analysis",
      icon: Zap,
      path: "/ai-analysis",
      description: "Advanced AI health insights"
    }
  ];

  const quickActions = [
    {
      title: "Symptom Checker",
      icon: Stethoscope,
      id: "symptoms",
      description: "Analyze your symptoms",
      color: "text-blue-600",
      path: "/symptom-checker",
    },
    {
      title: "Schedule Appointment",
      icon: Calendar,
      id: "appointments",
      description: "Book with healthcare providers",
      color: "text-green-600",
      path: "/schedule-appointment",
    },
    {
      title: "Emergency Help",
      icon: Phone,
      id: "emergency",
      description: "Urgent medical contacts",
      color: "text-red-600",
      path: "/emergency-help",
    }
  ];

  const quickHealthTips = [
    { icon: Heart, tip: "Stay hydrated - drink 8 glasses of water daily", color: "text-red-500" },
    { icon: Brain, tip: "Get 7-9 hours of quality sleep", color: "text-purple-500" },
    { icon: Activity, tip: "Exercise for 30 minutes daily", color: "text-green-500" }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar className="border-r bg-card shadow-soft">
      <div className="p-4">
        <SidebarTrigger className="mb-4" />
      </div>
      
      <SidebarContent className="p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-medical rounded-lg shadow-glow">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">HealthCare Pro</h2>
                <p className="text-xs text-muted-foreground">Your medical companion</p>
              </div>
            </div>
            <UserMenu />
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-foreground mb-4 px-1">
            Main Services
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid grid-cols-1 gap-3">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-medical ${
                      isActive 
                        ? 'bg-gradient-primary text-white shadow-glow border-primary/30' 
                        : 'bg-card/80 hover:bg-muted/80 text-foreground border-border/50 hover:border-primary/30'
                    }`
                  }
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-all ${
                        location.pathname === item.path
                          ? 'bg-white/20 text-white' 
                          : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                      }`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <div className="font-semibold text-sm mb-1">{item.title}</div>
                        <div className={`text-xs ${
                          location.pathname === item.path
                            ? 'text-white/80' 
                            : 'text-muted-foreground'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </NavLink>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Advanced Features */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-sm font-medium text-foreground mb-4 px-1">
            AI-Powered Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid grid-cols-1 gap-3">
              {advancedFeatures.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                      isActive 
                        ? 'bg-gradient-primary text-white shadow-glow border-primary/50 shadow-primary/20' 
                        : 'bg-card/60 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 text-foreground border-primary/20 hover:border-primary/40 hover:shadow-soft'
                    }`
                  }
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl transition-all ${
                        location.pathname === item.path
                          ? 'bg-white/20 text-white shadow-sm' 
                          : 'bg-gradient-to-br from-primary/10 to-accent/10 text-primary group-hover:from-primary/20 group-hover:to-accent/20 group-hover:shadow-sm'
                      }`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <div className="font-semibold text-sm mb-1">{item.title}</div>
                        <div className={`text-xs ${
                          location.pathname === item.path
                            ? 'text-white/90' 
                            : 'text-muted-foreground group-hover:text-foreground/80'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Active indicator */}
                  {location.pathname === item.path && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/30 rounded-r-full" />
                  )}
                </NavLink>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-sm font-medium text-foreground mb-4 px-1">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => 
                    `group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                      isActive 
                        ? 'bg-primary/10 border-primary/30 shadow-medical' 
                        : 'bg-card/80 hover:bg-muted/80 border-border/50 hover:border-primary/20 hover:shadow-soft'
                    }`
                  }
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-all ${
                        location.pathname === item.path
                          ? 'bg-primary/20 shadow-sm' 
                          : 'bg-muted/50 group-hover:bg-primary/10'
                      }`}>
                        <item.icon className={`w-5 h-5 ${
                          location.pathname === item.path ? 'text-primary' : item.color
                        }`} />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <div className="font-semibold text-sm text-foreground mb-1">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                      {/* Active indicator */}
                      {location.pathname === item.path && (
                        <div className="w-1 h-6 bg-primary/40 rounded-full" />
                      )}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </NavLink>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>


        {/* Health Tips */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-sm font-medium text-foreground mb-4 px-1">
            Daily Health Tips
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid grid-cols-1 gap-3">
              {quickHealthTips.map((tip, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-card/80 to-muted/20 hover:from-primary/5 hover:to-accent/5 border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-soft animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-all">
                        <tip.icon className={`w-5 h-5 ${tip.color} group-hover:scale-110 transition-transform`} />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <p className="text-sm text-foreground leading-relaxed font-medium group-hover:text-primary/90 transition-colors">
                          {tip.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated border accent */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${tip.color.replace('text-', 'bg-')} opacity-60 group-hover:opacity-100 transition-opacity rounded-l-xl`} />
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Subtle sparkle effect on hover */}
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
                </div>
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
              className="bg-white/20 hover:bg-white/30 text-white border-white/20 btn-hover"
            >
              Call 911 Now
            </Button>
          </CardContent>
        </Card>
      </SidebarContent>
    </Sidebar>
  );
};