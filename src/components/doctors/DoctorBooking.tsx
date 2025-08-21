import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Clock, Video, MapPin, CreditCard } from "lucide-react";
import { format } from "date-fns";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  price: number;
  availability: string[];
}

interface DoctorBookingProps {
  doctor: Doctor;
}

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM"
];

export const DoctorBooking = ({ doctor }: DoctorBookingProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedType, setSelectedType] = useState<"video" | "in-person">("video");
  const [symptoms, setSymptoms] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleBooking = () => {
    // Here you would normally process the booking
    console.log("Booking details:", {
      doctor: doctor.id,
      date: selectedDate,
      time: selectedTime,
      type: selectedType,
      symptoms
    });
    setStep(3);
  };

  const isDateAvailable = (date: Date) => {
    const dayName = format(date, 'EEE');
    return doctor.availability.includes(dayName) && date >= new Date();
  };

  if (step === 3) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto">
          <CalendarDays className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Booking Confirmed!</h3>
        <p className="text-sm text-muted-foreground">
          Your consultation with {doctor.name} is scheduled for{" "}
          {selectedDate && format(selectedDate, "MMMM dd, yyyy")} at {selectedTime}
        </p>
        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
          {selectedType === "video" ? "Video Consultation" : "In-Person Visit"}
        </Badge>
        <p className="text-xs text-muted-foreground">
          You'll receive a confirmation email with meeting details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Date & Time */}
      {step === 1 && (
        <>
          <div>
            <h3 className="font-semibold mb-4">Select Date & Time</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Choose Date</label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => !isDateAvailable(date)}
                  className="rounded-md border shadow-card"
                />
              </div>
              
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium mb-2">Available Time Slots</label>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="text-xs"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Consultation Type</label>
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-all ${
                  selectedType === "video" ? "ring-2 ring-primary bg-primary/5" : ""
                }`}
                onClick={() => setSelectedType("video")}
              >
                <CardContent className="p-4 text-center">
                  <Video className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="font-medium">Video Call</div>
                  <div className="text-xs text-muted-foreground">Online consultation</div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${
                  selectedType === "in-person" ? "ring-2 ring-primary bg-primary/5" : ""
                }`}
                onClick={() => setSelectedType("in-person")}
              >
                <CardContent className="p-4 text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="font-medium">In-Person</div>
                  <div className="text-xs text-muted-foreground">Clinic visit</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Button 
            onClick={() => setStep(2)}
            disabled={!selectedDate || !selectedTime}
            className="w-full btn-hover"
          >
            Continue to Details
          </Button>
        </>
      )}

      {/* Step 2: Symptoms & Payment */}
      {step === 2 && (
        <>
          <div>
            <h3 className="font-semibold mb-4">Consultation Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Describe your symptoms or reason for consultation
                </label>
                <Textarea
                  placeholder="Please describe your symptoms, concerns, or the reason for this consultation..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Booking Summary */}
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Doctor:</span>
                    <span className="font-medium">{doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{selectedDate && format(selectedDate, "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedType === "video" ? "Video Call" : "In-Person"}
                    </Badge>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total:</span>
                    <span className="text-primary">${doctor.price}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
            <Button 
              onClick={handleBooking}
              disabled={!symptoms.trim()}
              className="flex-1 btn-hover"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Book & Pay ${doctor.price}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};