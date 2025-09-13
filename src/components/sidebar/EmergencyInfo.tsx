import { Phone, MapPin, Clock, AlertTriangle, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const EmergencyInfo = () => {
  const emergencyContacts = [
    {
      name: "Emergency Services",
      number: "911",
      description: "Life-threatening emergencies",
      available: "24/7",
      priority: "critical"
    },
    {
      name: "Poison Control",
      number: "1-800-222-1222",
      description: "Poisoning and overdose help",
      available: "24/7",
      priority: "urgent"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Mental health crisis support",
      available: "24/7",
      priority: "support"
    },
    {
      name: "Nurse Hotline",
      number: "1-800-NURSES",
      description: "Medical advice and guidance",
      available: "24/7",
      priority: "advice"
    }
  ];

  const emergencySigns = [
    "Chest pain or pressure",
    "Difficulty breathing",
    "Severe bleeding",
    "Loss of consciousness",
    "Severe burns",
    "Suspected stroke symptoms",
    "Severe allergic reactions",
    "High fever with stiff neck"
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-gradient-emergency text-white";
      case "urgent": return "bg-warning text-warning-foreground";
      case "support": return "bg-primary text-primary-foreground";
      case "advice": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical": return AlertTriangle;
      case "urgent": return Heart;
      case "support": return Phone;
      case "advice": return Zap;
      default: return Phone;
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Phone className="w-5 h-5 text-emergency" />
          Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Emergency Contacts */}
        <div className="space-y-3">
          {emergencyContacts.map((contact, index) => {
            const Icon = getPriorityIcon(contact.priority);
            return (
              <Card 
                key={index} 
                className={`${getPriorityColor(contact.priority)} shadow-soft border-0`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <h4 className="font-semibold text-sm">{contact.name}</h4>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {contact.available}
                    </Badge>
                  </div>
                  
                  <p className="text-xs mb-3 opacity-90">{contact.description}</p>
                  
                  <Button 
                    size="sm"
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20"
                    onClick={() => window.open(`tel:${contact.number.replace(/[^0-9]/g, '')}`, '_self')}
                  >
                    <Phone className="w-3 h-3 mr-2" />
                    {contact.number}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Emergency Signs */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-4 h-4" />
              When to Call 911
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {emergencySigns.map((sign, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full flex-shrink-0 mt-1" />
                  <span className="text-sm text-destructive font-medium leading-relaxed">{sign}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Services */}
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-accent-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold mb-2 text-sm text-accent-foreground">Find Nearest Hospital</p>
                <p className="mb-3 text-sm text-accent-foreground/80 leading-relaxed">
                  Enable location services for fastest emergency response
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-sm h-8 border-accent-foreground/30 hover:bg-accent-foreground/10"
                >
                  <MapPin className="w-3 h-3 mr-2" />
                  Enable Location
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Note */}
        <div className="p-4 bg-muted/50 border border-border rounded-lg">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            <strong className="text-foreground">Remember:</strong> In any life-threatening situation, call 911 immediately. 
            Don't wait or try to drive yourself to the hospital.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};