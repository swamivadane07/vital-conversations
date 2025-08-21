import { useState } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const AppointmentScheduler = () => {
  const [date, setDate] = useState<Date>();
  const [appointmentType, setAppointmentType] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [doctorType, setDoctorType] = useState("");
  const [patientName, setPatientName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [reason, setReason] = useState("");

  const appointmentTypes = [
    "General Consultation",
    "Follow-up Visit",
    "Routine Check-up",
    "Vaccination",
    "Lab Results Review",
    "Specialist Referral"
  ];

  const doctorTypes = [
    "General Practitioner",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Pediatrician",
    "Psychiatrist",
    "Orthopedist"
  ];

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  const scheduleAppointment = () => {
    // This would connect to the backend appointment API
    const appointmentData = {
      date,
      appointmentType,
      preferredTime,
      doctorType,
      patientName,
      contactNumber,
      reason
    };
    console.log("Scheduling appointment:", appointmentData);
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          Schedule Appointment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Patient Information */}
        <div className="grid grid-cols-1 gap-3">
          <div>
            <Label htmlFor="patientName" className="text-sm font-medium">
              Patient Name
            </Label>
            <Input
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Full name"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="contactNumber" className="text-sm font-medium">
              Contact Number
            </Label>
            <Input
              id="contactNumber"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Phone number"
              className="mt-1"
            />
          </div>
        </div>

        {/* Appointment Type */}
        <div>
          <Label className="text-sm font-medium">
            Appointment Type
          </Label>
          <Select value={appointmentType} onValueChange={setAppointmentType}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select appointment type..." />
            </SelectTrigger>
            <SelectContent>
              {appointmentTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Doctor Type */}
        <div>
          <Label className="text-sm font-medium">
            Healthcare Provider
          </Label>
          <Select value={doctorType} onValueChange={setDoctorType}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select doctor type..." />
            </SelectTrigger>
            <SelectContent>
              {doctorTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Selection */}
        <div>
          <Label className="text-sm font-medium">
            Preferred Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full mt-1 justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Selection */}
        <div>
          <Label className="text-sm font-medium">
            Preferred Time
          </Label>
          <Select value={preferredTime} onValueChange={setPreferredTime}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select time..." />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map(time => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reason for Visit */}
        <div>
          <Label htmlFor="reason" className="text-sm font-medium">
            Reason for Visit
          </Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Brief description of your health concern or reason for the appointment..."
            className="mt-1 min-h-[80px]"
          />
        </div>

        {/* Schedule Button */}
        <Button 
          onClick={scheduleAppointment}
          className="w-full bg-gradient-primary hover:opacity-90 shadow-medical"
          disabled={!patientName || !date || !appointmentType}
        >
          <Clock className="mr-2 w-4 h-4" />
          Schedule Appointment
        </Button>

        {/* Information */}
        <div className="p-3 bg-accent/30 border border-accent/40 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
            <div className="text-xs text-accent-foreground">
              <p className="font-medium mb-1">Next Steps:</p>
              <p>After scheduling, you'll receive a confirmation with appointment details and location information.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};