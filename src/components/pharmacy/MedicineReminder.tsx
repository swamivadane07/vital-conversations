import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, Pill, Bell, Plus, Edit3, Trash2 } from "lucide-react";

interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  times: string[];
  isActive: boolean;
  notes?: string;
}

const MedicineReminder = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      medicineName: "Metformin",
      dosage: "500mg",
      frequency: "Twice Daily",
      times: ["08:00", "20:00"],
      isActive: true,
      notes: "Take with food"
    },
    {
      id: "2",
      medicineName: "Vitamin D3",
      dosage: "60000 IU",
      frequency: "Weekly",
      times: ["09:00"],
      isActive: true,
      notes: "Sunday morning"
    },
    {
      id: "3",
      medicineName: "Blood Pressure Medication",
      dosage: "5mg",
      frequency: "Daily",
      times: ["07:00"],
      isActive: false
    }
  ]);

  const toggleReminder = (reminderId: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === reminderId
          ? { ...reminder, isActive: !reminder.isActive }
          : reminder
      )
    );
  };

  const deleteReminder = (reminderId: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
  };

  const getNextDose = (times: string[]) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (const time of times) {
      const [hours, minutes] = time.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;
      
      if (timeInMinutes > currentTime) {
        return time;
      }
    }
    
    return times[0]; // Next day's first dose
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const activeReminders = reminders.filter(r => r.isActive);

  return (
    <div className="space-y-6">
      {/* Quick Overview */}
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Medicine Reminders</h3>
              <p className="text-sm opacity-90">
                {activeReminders.length} active reminder{activeReminders.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <Button variant="secondary" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Doses */}
      {activeReminders.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Next Doses Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeReminders.map((reminder) => {
              const nextTime = getNextDose(reminder.times);
              return (
                <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Pill className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{reminder.medicineName}</p>
                      <p className="text-sm text-muted-foreground">
                        {reminder.dosage} at {formatTime(nextTime)}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Mark Taken
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* All Reminders */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Medicine Reminders</CardTitle>
              <CardDescription>Manage your daily medication schedule</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {reminders.length === 0 ? (
            <div className="text-center py-8">
              <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reminders set</h3>
              <p className="text-muted-foreground mb-4">
                Add medicine reminders to stay on track with your treatment
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create First Reminder
              </Button>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div key={reminder.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{reminder.medicineName}</h4>
                      <Badge variant="outline">{reminder.dosage}</Badge>
                      <Badge variant="secondary">{reminder.frequency}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Times: {reminder.times.map(formatTime).join(', ')}</span>
                      </div>
                    </div>
                    {reminder.notes && (
                      <p className="text-sm text-muted-foreground">
                        Note: {reminder.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={reminder.isActive}
                        onCheckedChange={() => toggleReminder(reminder.id)}
                      />
                      <Label className="text-sm">
                        {reminder.isActive ? 'Active' : 'Inactive'}
                      </Label>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicineReminder;