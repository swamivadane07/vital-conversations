import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, Calendar, MapPin, CreditCard, Clock } from "lucide-react";
import { useState } from "react";

interface LabTest {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  preparation: string;
  reportTime: string;
}

interface CartItem {
  test: LabTest;
  quantity: number;
}

interface LabTestCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (testId: string, quantity: number) => void;
}

export const LabTestCart = ({ cartItems, onUpdateQuantity }: LabTestCartProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [patientNotes, setPatientNotes] = useState("");

  const labCenters = [
    "HealthLab Downtown - 123 Main St",
    "QuickTest Center - 456 Oak Ave", 
    "MediLab Express - 789 Pine Rd",
    "CityHealth Diagnostics - 321 Elm St"
  ];

  const timeSlots = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM"
  ];

  const subtotal = cartItems.reduce((total, item) => total + (item.test.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Your cart is empty</p>
        <p className="text-sm text-muted-foreground mt-2">
          Add some lab tests to get started
        </p>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Booking Confirmed!</h3>
        <p className="text-sm text-muted-foreground">
          Your lab tests are scheduled for {appointmentDate} at {appointmentTime}
        </p>
        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
          {selectedCenter}
        </Badge>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Total Amount: ${total.toFixed(2)}</p>
          <p>You'll receive confirmation details via email</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Step 1: Review Cart */}
      {step === 1 && (
        <>
          <div>
            <h3 className="font-semibold mb-4">Review Your Tests</h3>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <Card key={item.test.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.test.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.test.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.test.duration}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Report: {item.test.reportTime}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateQuantity(item.test.id, item.quantity - 1)}
                            className="w-6 h-6 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium min-w-[1.5rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateQuantity(item.test.id, item.quantity + 1)}
                            className="w-6 h-6 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right ml-4">
                          <div className="font-semibold text-sm">
                            ${(item.test.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ${item.test.price} each
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onUpdateQuantity(item.test.id, 0)}
                          className="w-6 h-6 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Price Summary */}
            <Card className="mt-4 bg-muted/30">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button onClick={() => setStep(2)} className="w-full btn-hover">
            Continue to Scheduling
          </Button>
        </>
      )}

      {/* Step 2: Schedule Appointment */}
      {step === 2 && (
        <>
          <div>
            <h3 className="font-semibold mb-4">Schedule Your Tests</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Date</label>
                  <Input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Time</label>
                  <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Lab Center
                </label>
                <select
                  value={selectedCenter}
                  onChange={(e) => setSelectedCenter(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Select a lab center</option>
                  {labCenters.map(center => (
                    <option key={center} value={center}>{center}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Additional Notes (Optional)
                </label>
                <Textarea
                  placeholder="Any special instructions or medical history relevant to these tests..."
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Preparation Instructions */}
              <Card className="bg-blue-50/50 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Preparation Instructions</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {cartItems.map(item => (
                      <li key={item.test.id}>
                        <strong>{item.test.name}:</strong> {item.test.preparation}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
              Back to Cart
            </Button>
            <Button 
              onClick={() => setStep(3)}
              disabled={!appointmentDate || !appointmentTime || !selectedCenter}
              className="flex-1 btn-hover"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Book & Pay ${total.toFixed(2)}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};