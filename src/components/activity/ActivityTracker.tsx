import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Activity } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const activityTypes = [
  "Cardio",
  "Strength Training", 
  "Yoga",
  "Walking",
  "Running",
  "Cycling",
  "Swimming",
  "Sports",
  "Other"
];

export const ActivityTracker = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    activityType: "",
    activityName: "",
    durationMinutes: "",
    caloriesBurned: "",
    notes: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to track activities",
        variant: "destructive",
      });
      return;
    }

    if (!formData.activityType || !formData.activityName || !formData.durationMinutes) {
      toast({
        title: "Required fields missing",
        description: "Please fill in activity type, name, and duration",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("activities")
        .insert({
          user_id: user.id,
          activity_type: formData.activityType,
          activity_name: formData.activityName,
          duration_minutes: parseInt(formData.durationMinutes),
          calories_burned: formData.caloriesBurned ? parseInt(formData.caloriesBurned) : null,
          date: format(date, "yyyy-MM-dd"),
          notes: formData.notes || null
        });

      if (error) throw error;

      toast({
        title: "Activity logged!",
        description: "Your activity has been successfully recorded",
      });

      // Reset form
      setFormData({
        activityType: "",
        activityName: "",
        durationMinutes: "",
        caloriesBurned: "",
        notes: ""
      });
      setDate(new Date());
    } catch (error) {
      console.error("Error logging activity:", error);
      toast({
        title: "Error",
        description: "Failed to log activity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Log Activity
        </CardTitle>
        <CardDescription>
          Track your physical activities and fitness progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activityType">Activity Type</Label>
              <Select value={formData.activityType} onValueChange={(value) => handleInputChange("activityType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activityName">Activity Name</Label>
              <Input
                id="activityName"
                placeholder="e.g., Morning jog, Gym session"
                value={formData.activityName}
                onChange={(e) => handleInputChange("activityName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="30"
                value={formData.durationMinutes}
                onChange={(e) => handleInputChange("durationMinutes", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">Calories Burned (optional)</Label>
              <Input
                id="calories"
                type="number"
                placeholder="200"
                value={formData.caloriesBurned}
                onChange={(e) => handleInputChange("caloriesBurned", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="How did you feel? Any observations..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {isLoading ? "Logging Activity..." : "Log Activity"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};