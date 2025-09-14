import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Calendar, 
  AlertTriangle, 
  Phone, 
  MessageSquare,
  Headphones,
  ArrowLeft 
} from "lucide-react";
import { SymptomChecker } from "@/components/sidebar/SymptomChecker";
import { AppointmentScheduler } from "@/components/sidebar/AppointmentScheduler";
import { EmergencyInfo } from "@/components/sidebar/EmergencyInfo";

const QuickActions = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const quickActions = [
    {
      title: "Symptom Checker",
      description: "Analyze your symptoms",
      icon: Stethoscope,
      action: "symptom-checker",
      variant: "default" as const
    },
    {
      title: "Schedule Appointment", 
      description: "Book with healthcare providers",
      icon: Calendar,
      action: "appointment-scheduler",
      variant: "secondary" as const
    },
    {
      title: "Emergency Help",
      description: "Urgent medical contacts",
      icon: AlertTriangle,
      action: "emergency-info",
      variant: "destructive" as const
    }
  ];

  const emergencyContacts = [
    {
      service: "Emergency Services",
      availability: "24/7",
      description: "Life-threatening emergencies",
      number: "911",
      action: () => window.open("tel:911", "_self")
    },
    {
      service: "Poison Control",
      availability: "24/7", 
      description: "Poisoning and overdose help",
      number: "1-800-222-1222",
      action: () => window.open("tel:18002221222", "_self")
    },
    {
      service: "Crisis Text Line",
      availability: "24/7",
      description: "Mental health crisis support", 
      number: "Text HOME to 741741",
      action: () => window.open("sms:741741?body=HOME", "_self")
    },
    {
      service: "Nurse Hotline",
      availability: "24/7",
      description: "Medical advice and guidance",
      number: "1-800-NURSES",
      action: () => window.open("tel:18006877377", "_self")
    }
  ];

  // If an active section is selected, show it
  if (activeSection) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSection(null)}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl font-semibold">
                {activeSection === "symptom-checker" && "Symptom Checker"}
                {activeSection === "appointment-scheduler" && "Schedule Appointment"}
                {activeSection === "emergency-info" && "Emergency Help"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {activeSection === "symptom-checker" && <SymptomChecker />}
            {activeSection === "appointment-scheduler" && <AppointmentScheduler />}
            {activeSection === "emergency-info" && <EmergencyInfo />}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
          <CardDescription>
            Get immediate access to essential health services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant={action.variant}
                size="lg"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setActiveSection(action.action)}
              >
                <action.icon className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-sm opacity-90">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card id="emergency-contacts">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-xl font-semibold text-destructive">
              Emergency Contacts
            </CardTitle>
          </div>
          <CardDescription>
            Immediate access to emergency and crisis support services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emergencyContacts.map((contact, index) => (
            <div key={contact.service}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{contact.service}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {contact.availability}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {contact.description}
                  </p>
                  <p className="text-lg font-mono font-semibold text-primary">
                    {contact.number}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={contact.action}
                  className="ml-4 flex-shrink-0"
                >
                  {contact.service === "Crisis Text Line" ? (
                    <MessageSquare className="h-4 w-4" />
                  ) : (
                    <Phone className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;