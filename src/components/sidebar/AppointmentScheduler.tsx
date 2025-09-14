import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export const AppointmentScheduler = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>();
  const [appointmentType, setAppointmentType] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [doctorType, setDoctorType] = useState("");
  const [patientName, setPatientName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "success" | "error">("pending");

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

  // Check for payment success on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentParam = urlParams.get("payment");
    const sessionId = urlParams.get("session_id");

    if (paymentParam === "success" && sessionId) {
      handlePaymentSuccess(sessionId);
    } else if (paymentParam === "cancelled") {
      setPaymentStatus("error");
      toast({
        title: "Payment cancelled",
        description: "Your appointment booking was cancelled",
        variant: "destructive",
      });
    }
  }, []);

  const handlePaymentSuccess = async (sessionId: string) => {
    if (!user) return;
    
    setPaymentStatus("processing");
    
    try {
      const { data, error } = await supabase.functions.invoke("send-appointment-confirmation", {
        body: { sessionId },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      setPaymentStatus("success");
      toast({
        title: "Appointment confirmed!",
        description: "You'll receive a confirmation email shortly",
      });

      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error("Error confirming appointment:", error);
      setPaymentStatus("error");
      toast({
        title: "Confirmation error",
        description: "Payment successful but confirmation failed. Please contact support.",
        variant: "destructive",
      });
    }
  };

  const scheduleAppointment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to schedule an appointment",
        variant: "destructive",
      });
      return;
    }

    if (!patientName || !appointmentType || !date || !preferredTime) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setPaymentStatus("processing");
    
    try {
      const appointmentData = {
        patientName,
        contactNumber: contactNumber || "Not provided",
        appointmentType,
        doctorType: doctorType || "General Practitioner",
        appointmentDate: format(date, "yyyy-MM-dd"),
        appointmentTime: preferredTime,
        reason: reason || "General consultation",
      };

      const { data, error } = await supabase.functions.invoke("create-appointment-payment", {
        body: { appointmentData },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      if (data.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      setPaymentStatus("error");
      toast({
        title: "Booking failed",
        description: "Unable to process appointment booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show success state
  if (paymentStatus === "success") {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            Appointment Confirmed!
          </CardTitle>
          <CardDescription>
            Your appointment has been successfully booked and payment processed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">What's next?</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Check your email for appointment details</li>
                <li>• Arrive 15 minutes early on your appointment date</li>
                <li>• Bring a valid ID and insurance card</li>
              </ul>
            </div>
            <Button onClick={() => {
              setPaymentStatus("pending");
              setPatientName("");
              setContactNumber("");
              setAppointmentType("");
              setDoctorType("");
              setDate(undefined);
              setPreferredTime("");
              setReason("");
            }}>
              Book Another Appointment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Schedule an Appointment</CardTitle>
        <CardDescription>
          Book your healthcare appointment quickly and easily - $50.00
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Patient Information */}
        <div className="grid grid-cols-1 gap-3">
          <div>
            <Label htmlFor="patientName" className="text-sm font-medium">
              Patient Name *
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
            Appointment Type *
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
            Preferred Date *
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
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Selection */}
        <div>
          <Label className="text-sm font-medium">
            Preferred Time *
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
            placeholder="Brief description of your health concern..."
            className="mt-1 min-h-[80px]"
          />
        </div>

        {/* Schedule Button */}
        <Button 
          onClick={scheduleAppointment}
          className="w-full"
          disabled={!patientName || !appointmentType || !date || !preferredTime || isLoading || !user}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {isLoading ? "Processing..." : "Pay & Book Appointment ($50.00)"}
        </Button>

        {!user && (
          <p className="text-sm text-muted-foreground text-center mt-2">
            Please log in to schedule an appointment
          </p>
        )}

        {/* Next Steps Info */}
        <div className="p-3 bg-muted/50 border rounded-lg">
          <h4 className="font-medium text-sm mb-2">Next Steps:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Complete secure payment via Stripe</li>
            <li>• Receive email confirmation with appointment details</li>
            <li>• Arrive 15 minutes early with valid ID</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};