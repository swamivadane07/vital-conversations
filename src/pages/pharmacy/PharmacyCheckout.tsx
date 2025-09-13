import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, MapPin, Truck, Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const PharmacyCheckout = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    state: ""
  });

  const orderItems = [
    { id: "1", name: "Paracetamol", brand: "Crocin", quantity: 2, price: 25.50 },
    { id: "2", name: "Metformin", brand: "Glucon-D", quantity: 1, price: 85.00 },
    { id: "3", name: "Vitamin D3", brand: "D-Rise", quantity: 1, price: 120.00 }
  ];

  const subtotal = 230.50;
  const deliveryFee = 0;
  const tax = 11.53;
  const total = 242.03;

  const handlePlaceOrder = () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Order Placed Successfully",
      description: "Your order has been placed and will be processed shortly",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/pharmacy/cart">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          <p className="text-muted-foreground">Complete your medicine order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={deliveryAddress.fullName}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={deliveryAddress.phone}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Complete Address *</Label>
                <Textarea
                  id="address"
                  value={deliveryAddress.address}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="House no, Street, Landmark"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select value={deliveryAddress.state} onValueChange={(value) => setDeliveryAddress(prev => ({ ...prev, state: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={deliveryAddress.pincode}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, pincode: e.target.value }))}
                    placeholder="400001"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-muted-foreground">Visa, MasterCard, RuPay</p>
                    </div>
                  </div>
                </div>

                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-primary rounded-sm"></div>
                    <div>
                      <p className="font-medium">UPI Payment</p>
                      <p className="text-sm text-muted-foreground">PhonePe, GPay, Paytm</p>
                    </div>
                  </div>
                </div>

                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'wallet' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                  onClick={() => setPaymentMethod('wallet')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-secondary rounded-sm"></div>
                    <div>
                      <p className="font-medium">Digital Wallet</p>
                      <p className="text-sm text-muted-foreground">Paytm, PhonePe Wallet</p>
                    </div>
                  </div>
                </div>

                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">Pay when delivered</p>
                    </div>
                  </div>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-4 space-y-4 p-4 border rounded-lg bg-muted/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Card Number" />
                    <Input placeholder="Cardholder Name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM/YY" />
                    <Input placeholder="CVV" />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/20">
                  <Input placeholder="Enter UPI ID (example@upi)" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.brand} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button onClick={handlePlaceOrder} className="w-full" size="lg">
                Place Order
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Secure & encrypted payment</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PharmacyCheckout;